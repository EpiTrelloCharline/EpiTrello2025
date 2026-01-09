import { z } from 'zod';

export const SearchQuerySchema = z.object({
    q: z.string().min(1, 'Search query is required'),
    boardId: z.string().uuid().optional().or(z.string().length(0)),
    workspaceId: z.string().uuid().optional().or(z.string().length(0)),
});

export type SearchQueryDto = z.infer<typeof SearchQuerySchema>;
