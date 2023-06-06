import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Repository, UpdateResult } from 'typeorm';
import { lastValueFrom } from 'rxjs';

import { CreatePersonDto } from './dto/create-person.dto';
import { Person } from './entity/person.entity';
import { AddPersonsToMovieDto } from './dto/add-persons-to-movie.dto';
import { Movie } from './entity/movie.entity';
import { ClientProxy, RpcException } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Person) private personRepository: Repository<Person>,
    @InjectRepository(Movie) private movieRepository: Repository<Movie>,
    @Inject('ToMoviesMs') private moviesRmqProxy: ClientProxy,
  ) {}

  async createPerson(createPersonDto: CreatePersonDto): Promise<Person> {
    console.log('Persons MS - Persons Service - createPerson at', new Date());

    return this.personRepository.save(createPersonDto);
  }

  async updatePerson(
    personId: number,
    updatePersonDto: CreatePersonDto,
  ): Promise<UpdateResult> {
    console.log('Persons MS - Persons Service - updatePerson at', new Date());

    await this.getPersonById(personId);

    return this.personRepository.update(
      { personId: personId },
      updatePersonDto,
    );
  }

  async deletePerson(personId: number): Promise<DeleteResult> {
    console.log('Persons MS - Persons Service - deletePerson at', new Date());

    return this.personRepository.delete({ personId: personId });
  }

  async getPersonById(
    personId: number,
  ): Promise<{ person: Person; movies: object[] }> {
    console.log('Persons MS - Persons Service - getPersonById at', new Date());

    const data: { person: Person; movies: object[] } = {
      person: null,
      movies: null,
    };

    data.person = await this.personRepository.findOneBy({
      personId: personId,
    });

    if (!data.person) {
      throw new RpcException(new NotFoundException('Person not found!'));
    }

    const moviesObjects: Movie[] = await this.movieRepository.find({
      where: [
        { actors: data.person },
        { director: data.person },
        { editor: data.person },
        { operator: data.person },
        { composer: data.person },
        { producer: data.person },
      ],
    });

    if (moviesObjects.length > 0) {
      const moviesIds: number[] = moviesObjects.map((movie) => movie.movieId);

      data.movies = await lastValueFrom(
        await this.moviesRmqProxy.send(
          { cmd: 'getMovies' },
          {
            movieFilterDto: {
              ids: moviesIds,
            },
          },
        ),
      );
    }

    return data;
  }

  async addPersonsToMovie(data: AddPersonsToMovieDto): Promise<Movie> {
    console.log(
      'Persons MS - Persons Service - addPersonsToMovie at',
      new Date(),
    );

    const movie: Movie = await this.movieRepository.save({
      movieId: data.movieId,
    });

    return this.addPersonsEntityToMovieEntity(movie, data);
  }

  async getMoviesByActor(personId: { personId }): Promise<number[]> {
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

  async getMoviePersons(movieId: number): Promise<Movie> {
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

  async deleteMovie(data: { movieId: number }): Promise<DeleteResult> {
    console.log('Persons MS - Persons Service - deleteMovie at', new Date());

    return this.movieRepository.delete({ movieId: data.movieId });
  }

  async findPersonByName(dto: {
    personName: string;
    position: string;
  }): Promise<Person[]> {
    console.log(
      'Persons MS - Persons Service - findActorByName at',
      new Date(),
    );

    return this.movieRepository
      .createQueryBuilder('movie')
      .innerJoin(`movie.${dto.position}`, 'person')
      .select([
        'person.personId as "personId"',
        'person.nameRu as "nameRu"',
        'person.nameEn as "nameEn"',
        'person.photo as "photo"',
        'person.description as "description"',
        'person.biography as "biography"',
      ])
      .where('person.nameEn ilike :name', { name: `%${dto.personName}%` })
      .orWhere('person.nameRu ilike :name', { name: `%${dto.personName}%` })
      .groupBy('person.personId')
      .limit(5)
      .execute();
  }

  async findPersonByNameService(personName: string): Promise<Person> {
    console.log(
      'Persons MS - Persons Service - findPersonByName at',
      new Date(),
    );

    return await this.personRepository.findOneBy({
      nameRu: personName,
    });
  }

  private async addPersonsEntityToMovieEntity(
    movie: Movie,
    data: AddPersonsToMovieDto,
  ): Promise<Movie> {
    console.log(
      'Persons MS - Persons Service - addPersonsEntityToMovieEntity at',
      new Date(),
    );

    const directorSet = [...new Set(data.director)];
    const actorsSet = [...new Set(data.actors)];
    const producerSet = [...new Set(data.producer)];
    const operatorSet = [...new Set(data.operator)];
    const editorSet = [...new Set(data.editor)];
    const composerSet = [...new Set(data.composer)];

    movie.director = await this.personRepository.find({
      where: {
        personId: In(directorSet),
      },
    });
    movie.actors = await this.personRepository.find({
      where: {
        personId: In(actorsSet),
      },
    });
    movie.composer = await this.personRepository.find({
      where: {
        personId: In(composerSet),
      },
    });
    movie.producer = await this.personRepository.find({
      where: {
        personId: In(producerSet),
      },
    });
    movie.editor = await this.personRepository.find({
      where: {
        personId: In(editorSet),
      },
    });
    movie.operator = await this.personRepository.find({
      where: {
        personId: In(operatorSet),
      },
    });

    return await this.movieRepository.save(movie);
  }
}
