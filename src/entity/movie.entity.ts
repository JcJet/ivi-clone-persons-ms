import { Person } from './person.entity';
import { Entity, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class Movie {
  @PrimaryColumn()
  movieId: number;

  @ManyToMany(() => Person)
  actors: Person[];

  @ManyToMany(() => Person)
  director: Person[];
}
