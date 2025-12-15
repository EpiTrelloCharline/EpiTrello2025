import { validate } from 'class-validator';
import { CreateCardDto } from './create-card.dto';

describe('CreateCardDto', () => {
    it('should pass validation with valid data', async () => {
        const dto = new CreateCardDto();
        dto.title = 'Test Card';
        dto.listId = 'list-123';
        dto.description = 'A test description';

        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    });

    it('should fail validation without title', async () => {
        const dto = new CreateCardDto();
        dto.listId = 'list-123';

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('title');
    });

    it('should fail validation without listId', async () => {
        const dto = new CreateCardDto();
        dto.title = 'Test Card';

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('listId');
    });
});
