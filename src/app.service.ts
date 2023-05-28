import { Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entity/person.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Person) private personRepository: Repository<Person>,
  ) {}

  async createPerson(createPersonDto: CreatePersonDto) {
    console.log('Persons MS - Persons Service - createPerson at', new Date());
    return this.personRepository.save(createPersonDto);
  }

  async updatePerson(personId: number, updatePersonDto: CreatePersonDto) {
    console.log('Persons MS - Persons Service - updatePerson at', new Date());
    return this.personRepository.update(
      { personId: personId },
      updatePersonDto,
    );
  }

  async deletePerson(personId: number) {
    console.log('Persons MS - Persons Service - deletePerson at', new Date());
    return this.personRepository.delete({ personId: personId });
  }
}
