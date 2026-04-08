import { describe, it, expect } from 'vitest';
import { useFormIO } from '../useFormIO';
import { z } from 'zod';

describe('useFormIO', () => {

  const { importFromJSON } = useFormIO();
  const TestSchema = z.object({
    name: z.string(),
    age: z.number(),
  });

  it('should import valid JSON data', async () => {
    const validData = { name: 'Alice', age: 30 };
    const file = new File([JSON.stringify(validData)], 'test.json', { type: 'application/json' });

    const result = await importFromJSON(file, TestSchema);

    expect(result).toEqual(validData);
  });

  it('should skip invalid fields in JSON data', async () => {
    const invalidData = { name: 'Bob', age: 'thirty' };
    const file = new File([JSON.stringify(invalidData)], 'test.json', { type: 'application/json' });

    const result = await importFromJSON(file, TestSchema);

    expect(result).toEqual({ name: 'Bob' });
  });

  it('should reject malformed JSON', async () => {
    const file = new File(['{ name: "Charlie" '], 'test.json', { type: 'application/json' });

    await expect(importFromJSON(file, TestSchema)).rejects.toThrow('Failed to parse JSON file');
  });
});
