export class AddPersonsToMovieDto {
  readonly movieId: number;
  readonly director: number[];
  readonly actors: number[];
  readonly producer: number[];
  readonly operator: number[];
  readonly editor: number[];
  readonly composer: number[];
}
