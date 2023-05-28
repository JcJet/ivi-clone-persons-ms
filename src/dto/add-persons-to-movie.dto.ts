export class AddPersonsToMovieDto {
  readonly movieId: number;
  readonly director: number[];
  readonly actors: number[];
  readonly producer: number[];
  readonly cinematographer: number[];
  readonly screenwriter: number[];
  readonly composer: number[];
}
