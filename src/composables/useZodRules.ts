import type { z } from 'zod';

/**
 * Returns a validation rule array for a specific field.
 * Usage: :rules="rule('fieldName')"
 */
export function useZodRules<T extends z.ZodObject<any>>(schema: T) {

  const rule = (field: keyof z.infer<T>) => {
    return [
      (value: any) => {
        const fieldSchema = schema.shape[field as string];

        if (!fieldSchema) {
          console.warn(`No Zod schema found for field: ${String(field)}`);
          return true;
        }

        // FriendDev: Run validation.
        const result = fieldSchema.safeParse(value);

        if (result.success) {
          return true;
        }

        // FriendDev: Start with a generic message.
        let message: string = "Field contains an error";

        try {
          // FriendDev: Try to get the error message.
          message = result.error.issues[0].message;
        } catch (e) {
          console.warn(`Could not find validation message for ${String(field)}`);
        }

        return message;
      }
    ];
  };

  return { rule };
}