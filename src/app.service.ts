import { Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entity/person.entity';
import { ArrayContains, Like, Repository } from "typeorm";
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

  async getMoviesByActor(personId: number) {
    console.log(
      'Persons MS - Persons Service - getMoviesByActor at',
      new Date(),
    );
    return this.movieRepository
      .find({
        where: {
          actors: { personId: personId },
        },
      })
      .then((result) => result.map((movie) => movie.movieId));
  }

  async getMoviesByDirector(personId: number) {
    console.log(
      'Persons MS - Persons Service - getMoviesByDirector at',
      new Date(),
    );
    return this.movieRepository
      .find({
        where: {
          director: { personId: personId },
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
        'cinematographer',
        'screenwriter',
        'composer',
      ],
      where: {
        movieId: movieId,
      },
    });
  }

  async deleteMovie(movieId: number) {
    console.log('Persons MS - Persons Service - deleteMovie at', new Date());
    return this.movieRepository.delete({ movieId: movieId });
  }

  async findPersonByName(personName: string) {
    console.log(
      'Persons MS - Persons Service - findPersonByName at',
      new Date(),
    );
    return this.personRepository
      .createQueryBuilder('person')
      .select()
      .where('person.nameRu ilike :name', { name: `%${personName}%` })
      .orWhere('person.nameEn ilike :name', { name: `%${personName}%` })
      .execute();
  }

  private async addPersonsEntityToMovieEntity(
    movie: Movie,
    data: AddPersonsToMovieDto,
  ) {
    console.log(
      'Persons MS - Persons Service - getMoviesByDirector at',
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
    movie.cinematographer = await Promise.all(
      data.cinematographer.map(
        async (cinematographerId) =>
          await this.personRepository.findOneBy({
            personId: cinematographerId,
          }),
      ),
    );
    movie.screenwriter = await Promise.all(
      data.screenwriter.map(
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
}
