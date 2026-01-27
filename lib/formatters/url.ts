import { z } from 'zod';

// Schema with validation
export const urlSchema = z.object({
  url: z.string()
    .min(1, 'URL is required')
    .refine(
      (val) => {
        try {
          const url = new URL(val);
          return url.protocol === 'http:' || url.protocol === 'https:';
        } catch {
          return false;
        }
      },
      { message: 'Must be a valid URL starting with http:// or https://' }
    ),
});

// Infer TypeScript type from schema
export type UrlData = z.infer<typeof urlSchema>;

// Formatter is identity for URL (no transformation needed)
export function formatUrl(data: UrlData): string {
  return data.url;
}
