import { CreatePersonDto } from './create-person.dto';

export class UpdatePersonMessageDto extends CreatePersonDto {
  readonly personId: number;
  readonly updatePersonDto: CreatePersonDto;
}
