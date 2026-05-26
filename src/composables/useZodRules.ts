import { toValue, type MaybeRefOrGetter } from 'vue';
import type { z } from 'zod';

/**
 * Returns a validation rule array for a specific field.
 * Evaluates the entire schema against the proposed form state.
 * @param schemaSource - The Zod schema or a getter/ref returning it.
 * @param formStateSource - The reactive form state or a getter/ref returning it.
 * @returns An object containing the rule function.
 */
export function useZodRules<TForm extends object>(
  schemaSource: MaybeRefOrGetter<z.ZodType<any>>,
  formStateSource: MaybeRefOrGetter<TForm>
) {
  const rule = (field: keyof TForm) => {
    return [
      (value: unknown) => {
        // FriendDev: Resolve the schema and form state.
        const schema = toValue(schemaSource);
        const formState = toValue(formStateSource);

        // FriendDev: Merge the proposed value into the form state.
        const stateToValidate = {
          ...formState,
          [field]: value
        };

        const result = schema.safeParse(stateToValidate);

        if (result.success) {
          return true;
        }

        // FriendDev: Find the first issue that belongs to this specific field.
        const issue = result.error.issues.find((i) => {
          return i.path[0] === field;
        });

        if (issue) {
          return issue.message;
        }

        return true;
      }
    ];
  };

  return { rule };
}