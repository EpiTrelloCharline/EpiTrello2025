import { validate } from 'class-validator';
import { CreateListDto } from './create-list.dto';

describe('CreateListDto', () => {
    it('should pass validation with valid data', async () => {
        const dto = new CreateListDto();
        dto.title = 'Test List';
        dto.boardId = 'board-123';

        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    });

    it('should fail validation without title', async () => {
        const dto = new CreateListDto();
        dto.boardId = 'board-123';

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('title');
    });

    it('should fail validation without boardId', async () => {
        const dto = new CreateListDto();
        dto.title = 'Test List';

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('boardId');
    });
});
