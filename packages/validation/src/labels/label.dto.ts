import { z } from 'zod';

export const LabelSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Name is required'),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color (e.g., #FF0000)'),
});

export type LabelDto = z.infer<typeof LabelSchema>;

export const CreateLabelSchema = LabelSchema.omit({ id: true });
export type CreateLabelDto = z.infer<typeof CreateLabelSchema>;
