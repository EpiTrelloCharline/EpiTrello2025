import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCardDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    listId: string;
}
