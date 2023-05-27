import { Person } from './person.entity';
import { ManyToMany } from 'typeorm';

export class Movie {
  @ManyToMany(() => Person)
  actors: Person[];

  @ManyToMany(() => Person)
  director: Person[];
}
