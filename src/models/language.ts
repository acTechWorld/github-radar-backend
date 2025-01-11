import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Repository } from '@/models/Repository';

@Entity('languages')
export class Language {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name!: string;

  @ManyToMany(() => Repository, (repository) => repository.languages)
  repositories!: Repository[];
}
