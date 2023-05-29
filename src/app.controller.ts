import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { MessagePattern } from '@nestjs/microservices';
import { UpdatePersonMessageDto } from './dto/update-person-message.dto';
import { AddPersonsToMovieDto } from './dto/add-persons-to-movie.dto';

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

  @MessagePattern({ cmd: 'deletePerson' })
  async deletePerson(data: { personId: number }) {
    console.log(
      'Persons MS - Persons Controller - deletePerson at',
      new Date(),
    );
    return this.appService.deletePerson(data.personId);
  }

  @MessagePattern({ cmd: 'getPersonById' })
  async getPersonById(data: { personId: number }) {
    console.log(
      'Persons MS - Persons Controller - getPersonById at',
      new Date(),
    );
    return this.appService.getPersonById(data.personId);
  }

  @MessagePattern({ cmd: 'addPersonsToMovie' })
  async addPersonsToMovie(data: AddPersonsToMovieDto) {
    console.log(
      'Persons MS - Persons Controller - addPersonsToMovie at',
      new Date(),
    );
    return this.appService.addPersonsToMovie(data);
  }

  @MessagePattern({ cmd: 'getMoviesByActor' })
  async getMoviesByActor(personId: number) {
    console.log(
      'Persons MS - Persons Controller - getMoviesByActor at',
      new Date(),
    );
    return this.appService.getMoviesByActor(personId);
  }

  @MessagePattern({ cmd: 'getMoviesByDirector' })
  async getMoviesByDirector(personId: number) {
    console.log(
      'Persons MS - Persons Controller - getMoviesByDirector at',
      new Date(),
    );
    return this.appService.getMoviesByDirector(personId);
  }

  @MessagePattern({ cmd: 'getMoviePersons' })
  async getMoviePersons(movieId: number) {
    console.log(
      'Persons MS - Persons Controller - getMoviePersons at',
      new Date(),
    );
    return this.appService.getMoviePersons(movieId);
  }

  @MessagePattern({ cmd: 'deleteMovie' })
  async deleteMovie(movieId: number) {
    console.log('Persons MS - Persons Controller - deleteMovie at', new Date());
    return this.appService.deleteMovie(movieId);
  }

  @MessagePattern({ cmd: 'findPersonByName' })
  async findPersonByName(personName: { personName: string }) {
    console.log(
      'Persons MS - Persons Controller - findPersonByName at',
      new Date(),
    );
    return this.appService.findPersonByName(personName.personName);
  }
}
