import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { MessagePattern } from '@nestjs/microservices';

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
}
