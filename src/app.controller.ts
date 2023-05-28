import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { MessagePattern } from '@nestjs/microservices';
import { UpdatePersonMessageDto } from "./dto/update-person-message.dto";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'createPerson' })
  async createPerson(data: { createPersonDto: CreatePersonDto }) {
    console.log(
      'Persons MS - Persons Controller - createPerson at',
      new Date(),
    );
    return this.appService.createPerson(data.createPersonDto);
  }

  @MessagePattern({ cmd: 'updatePerson' })
  async updatePerson(data: UpdatePersonMessageDto) {
    console.log(
      'Persons MS - Persons Controller - updatePerson at',
      new Date(),
    );
    return this.appService.updatePerson(data.personId, data.updatePersonDto);
  }
}
