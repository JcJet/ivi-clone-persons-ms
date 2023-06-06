import { Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';

import { Person } from './person.entity';

@Entity()
export class Movie {
  @PrimaryColumn()
  movieId: number;

  @ManyToMany(() => Person)
  @JoinTable()
  actors: Person[];

  @ManyToMany(() => Person)
  @JoinTable()
  director: Person[];

  @ManyToMany(() => Person)
  @JoinTable()
  producer: Person[];

  @ManyToMany(() => Person)
  @JoinTable()
  operator: Person[];

  @ManyToMany(() => Person)
  @JoinTable()
  editor: Person[];

  @ManyToMany(() => Person)
  @JoinTable()
  composer: Person[];
}
