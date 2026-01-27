import { z } from 'zod';

export const textSchema = z.object({
  text: z.string()
    .min(1, 'Text is required')
    .max(2000, 'Text must be 2000 characters or less'),
});

export type TextData = z.infer<typeof textSchema>;

// Formatter is identity for text (no transformation needed)
export function formatText(data: TextData): string {
  return data.text;
}
