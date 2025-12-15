import { validate } from 'class-validator';
import { CreateLabelDto } from './create-label.dto';

describe('CreateLabelDto', () => {
    it('should pass validation with valid data', async () => {
        const dto = new CreateLabelDto();
        dto.name = 'Test Label';
        dto.color = '#FF0000';

        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    });

    it('should fail validation with invalid color hex', async () => {
        const dto = new CreateLabelDto();
        dto.name = 'Test Label';
        dto.color = 'invalid-color';

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('color');
    });
});
