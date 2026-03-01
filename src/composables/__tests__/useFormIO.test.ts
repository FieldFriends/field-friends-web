import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useFormIO } from '../useFormIO';
import { z } from 'zod';

class MockFileReader {
  onload: ((event: any) => void) | null = null;
  onerror: ((event: any) => void) | null = null;

  readAsText(blob: Blob) {
    blob.text().then(text => {
      if (this.onload) {
        this.onload({ target: { result: text } });
      }
    }).catch(() => {
      if (this.onerror) {
        this.onerror({ target: { error: 'Failed to read' } });
      }
    });
  }
}

describe('useFormIO', () => {
  beforeEach(() => {
    vi.stubGlobal('FileReader', MockFileReader);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

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
