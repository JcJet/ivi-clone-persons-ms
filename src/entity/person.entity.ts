import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  readonly personId: number;

  @Column({ type: 'text', nullable: false, unique: false })
  nameRu: string;

  @Column({ type: 'text', nullable: false, unique: false })
  nameEn: string;

  @Column({ type: 'text', nullable: true, unique: false })
  photo: string;

  @Column({
    type: 'text',
    nullable: false,
    unique: false,
    default: 'No description.',
  })
  description: string;

  @Column({
    type: 'text',
    nullable: false,
    unique: false,
    default: 'No biography.',
  })
  biography: string;
}
