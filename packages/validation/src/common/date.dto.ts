import { z } from 'zod';

export const DateSchema = z.string().datetime().or(z.date());

export type DateDto = z.infer<typeof DateSchema>;

export const DateResponseSchema = z.object({
    createdAt: DateSchema,
    updatedAt: DateSchema,
});

export type DateResponseDto = z.infer<typeof DateResponseSchema>;
