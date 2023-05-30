import { Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entity/person.entity';
import { Repository } from 'typeorm';
import { AddPersonsToMovieDto } from './dto/add-persons-to-movie.dto';
import { Movie } from './entity/movie.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Person) private personRepository: Repository<Person>,
    @InjectRepository(Movie) private movieRepository: Repository<Movie>,
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

  async getPersonById(personId: number) {
    console.log('Persons MS - Persons Service - getPersonById at', new Date());
    return this.personRepository.findOneBy({ personId: personId });
  }

  async addPersonsToMovie(data: AddPersonsToMovieDto) {
    console.log(
      'Persons MS - Persons Service - addPersonsToMovie at',
      new Date(),
    );
    if (!(await this.movieRepository.findOneBy({ movieId: data.movieId }))) {
      const movie = await this.movieRepository.save({ movieId: data.movieId });
      return this.addPersonsEntityToMovieEntity(movie, data);
    } else {
      const movie = await this.movieRepository.findOneBy({
        movieId: data.movieId,
      });
      return this.addPersonsEntityToMovieEntity(movie, data);
    }
  }

  async getMoviesByActor(personId: { personId }) {
    console.log(
      'Persons MS - Persons Service - getMoviesByActor at',
      new Date(),
    );
    return this.movieRepository
      .find({
        where: {
          actors: { personId: personId.personId },
        },
      })
      .then((result) => result.map((movie) => movie.movieId));
  }
  async getMoviesByDirector(personId: any) {
    console.log(
      'Persons MS - Persons Service - getMoviesByDirector at',
      new Date(),
    );
    return this.movieRepository
      .find({
        where: {
          director: { personId: personId.personId },
        },
      })
      .then((result) => result.map((movie) => movie.movieId));
  }

  async getMoviePersons(movieId: number) {
    console.log(
      'Persons MS - Persons Service - getMoviePersons at',
      new Date(),
    );

    return this.movieRepository.findOne({
      relations: [
        'actors',
        'director',
        'producer',
        'operator',
        'editor',
        'composer',
      ],
      where: {
        movieId: movieId,
      },
    });
  }

  async deleteMovie(data: { movieId: number }) {
    console.log('Persons MS - Persons Service - deleteMovie at', new Date());
    return this.movieRepository.delete({ movieId: data.movieId });
  }

  // async findPersonByName(personName: string) {
  //   console.log(
  //     'Persons MS - Persons Service - findPersonByName at',
  //     new Date(),
  //   );
  //   return this.personRepository
  //     .createQueryBuilder('person')
  //     .select([
  //       'person.personId as "personId"',
  //       'person.nameRu as "nameRu"',
  //       'person.nameEn as "nameEn"',
  //       'person.photo as "photo"',
  //       'person.description as "description"',
  //       'person.biography as "biography"',
  //     ])
  //     .where('person.nameRu ilike :name', { name: `%${personName}%` })
  //     .orWhere('person.nameEn ilike :name', { name: `%${personName}%` })
  //     .limit(5)
  //     .execute();
  // }

  private async addPersonsEntityToMovieEntity(
    movie: Movie,
    data: AddPersonsToMovieDto,
  ) {
    console.log(
      'Persons MS - Persons Service - addPersonsEntityToMovieEntity at',
      new Date(),
    );

    movie.director = await Promise.all(
      data.director.map(
        async (directorId) =>
          await this.personRepository.findOneBy({ personId: directorId }),
      ),
    );
    movie.actors = await Promise.all(
      data.actors.map(
        async (actorId) =>
          await this.personRepository.findOneBy({ personId: actorId }),
      ),
    );
    movie.producer = await Promise.all(
      data.producer.map(
        async (producerId) =>
          await this.personRepository.findOneBy({ personId: producerId }),
      ),
    );
    movie.operator = await Promise.all(
      data.operator.map(
        async (cinematographerId) =>
          await this.personRepository.findOneBy({
            personId: cinematographerId,
          }),
      ),
    );
    movie.editor = await Promise.all(
      data.editor.map(
        async (screenwriterId) =>
          await this.personRepository.findOneBy({ personId: screenwriterId }),
      ),
    );
    movie.composer = await Promise.all(
      data.composer.map(
        async (composerId) =>
          await this.personRepository.findOneBy({ personId: composerId }),
      ),
    );
    return await this.movieRepository.save(movie);
  }

  async findPersonByName(dto: { personName: string; position: string }) {
    console.log(
      'Persons MS - Persons Service - findActorByName at',
      new Date(),
    );
    return this.movieRepository
      .createQueryBuilder('movie')
      .leftJoin(`movie.${dto.position}`, 'person')
      .select([
        'person.personId as "personId"',
        'person.nameRu as "nameRu"',
        'person.nameEn as "nameEn"',
        'person.photo as "photo"',
        'person.description as "description"',
        'person.biography as "biography"',
      ])
      .where('person.nameEn ilike :name', { name: `%${dto.personName}%` })
      .limit(5)
      .execute();
  }
}
