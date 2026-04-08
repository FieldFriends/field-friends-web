import { z } from 'zod';

export function useFormIO() {

  /**
   * Export data to a JSON file and trigger a download.
   * @param data - The data object to export.
   * @param fileName - The name of the file to download (e.g., 'data.json').
   */
  const exportToJSON = (data: any, fileName: string) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);
  };

  /**
   * Import data from a JSON file and validate it against a Zod schema.
   * Attempts to recover as many valid fields as possible.
   * @param file - The File object to read.
   * @param schema - The Zod schema (must be ZodObject) to validate the parsed data.
   * @returns A promise that resolves to the validated partial data.
   */
  const importFromJSON = async <T extends z.ZodObject<any>>(file: File, schema: T): Promise<Partial<z.infer<T>>> => {
    try {
      const jsonString = await file.text();

      if (!jsonString) {
        throw new Error('File is empty');
      }

      const parsedData = JSON.parse(jsonString);

      // FriendDev: Check if basic structure is object.
      if (typeof parsedData !== 'object' || parsedData === null) {
        throw new Error('Invalid data structure: expected an object');
      }

      const validData: Partial<z.infer<T>> = {};
      const shape = schema.shape;

      // FriendDev: Go through each key. Check if it exists, and try to validate it.
      //            Lets us recover as many keys as possible.
      for (const [key, value] of Object.entries(parsedData)) {
        // FriendDev: The key exists in the schema.
        if (key in shape) {
          const fieldSchema = shape[key];

          // FriendDev: Try to parse that one field.
          const result = fieldSchema.safeParse(value);

          if (result.success) {
            validData[key as keyof z.infer<T>] = result.data;
          } else {
            console.warn(`Skipping invalid field '${key}':`, result.error);
          }
        }
      }

      return validData;

    } catch {
      throw new Error('Failed to parse JSON file');
    }
  };

  return {
    exportToJSON,
    importFromJSON,
  };
}
