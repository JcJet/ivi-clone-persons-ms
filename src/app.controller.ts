import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { AppService } from './app.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonMessageDto } from './dto/update-person-message.dto';
import { AddPersonsToMovieDto } from './dto/add-persons-to-movie.dto';
import { Person } from './entity/person.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Movie } from './entity/movie.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'createPerson' })
  async createPerson(data: {
    createPersonDto: CreatePersonDto;
  }): Promise<Person> {
    console.log(
      'Persons MS - Persons Controller - createPerson at',
      new Date(),
    );

    return this.appService.createPerson(data.createPersonDto);
  }

  @MessagePattern({ cmd: 'updatePerson' })
  async updatePerson(data: UpdatePersonMessageDto): Promise<UpdateResult> {
    console.log(
      'Persons MS - Persons Controller - updatePerson at',
      new Date(),
    );

    return this.appService.updatePerson(data.personId, data.updatePersonDto);
  }

  @MessagePattern({ cmd: 'deletePerson' })
  async deletePerson(data: { personId: number }): Promise<DeleteResult> {
    console.log(
      'Persons MS - Persons Controller - deletePerson at',
      new Date(),
    );

    return this.appService.deletePerson(data.personId);
  }

  @MessagePattern({ cmd: 'getPersonById' })
  async getPersonById(data: {
    personId: number;
  }): Promise<{ person: Person; movies: object[] }> {
    console.log(
      'Persons MS - Persons Controller - getPersonById at',
      new Date(),
    );

    return this.appService.getPersonById(data.personId);
  }

  @MessagePattern({ cmd: 'addPersonsToMovie' })
  async addPersonsToMovie(data: AddPersonsToMovieDto): Promise<Movie> {
    console.log(
      'Persons MS - Persons Controller - addPersonsToMovie at',
      new Date(),
    );

    return this.appService.addPersonsToMovie(data);
  }

  @MessagePattern({ cmd: 'getMoviesByActor' })
  async getMoviesByActor(personId: any): Promise<number[]> {
    console.log(
      'Persons MS - Persons Controller - getMoviesByActor at',
      new Date(),
    );

    return this.appService.getMoviesByActor(personId);
  }

  @MessagePattern({ cmd: 'getMoviePersons' })
  async getMoviePersons(movieId: number): Promise<Movie> {
    console.log(
      'Persons MS - Persons Controller - getMoviePersons at',
      new Date(),
    );

    return this.appService.getMoviePersons(movieId);
  }

  @MessagePattern({ cmd: 'deleteMovieFromPersons' })
  async deleteMovie(data: { movieId: number }): Promise<DeleteResult> {
    console.log('Persons MS - Persons Controller - deleteMovie at', new Date());

    return this.appService.deleteMovie(data);
  }

  @MessagePattern({ cmd: 'findPersonByName' })
  async findPersonByName(dto: {
    personName: string;
    position: string;
  }): Promise<Person[]> {
    console.log(
      'Persons MS - Persons Controller - findPersonByName at',
      new Date(),
    );

    return this.appService.findPersonByName(dto);
  }

  @MessagePattern({ cmd: 'findPersonByNameService' })
  async findPersonByNameService(personName: any): Promise<Person> {
    console.log(
      'Persons MS - Persons Controller - findPersonByNameService at',
      new Date(),
    );

    return this.appService.findPersonByNameService(personName.dto);
  }
}
