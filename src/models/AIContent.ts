import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ai_content')
export class AIContent {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name!: string;

  @Column({ type: 'varchar', length: 100 })
  type!: string;

  @Column({type: "text"})
  content?: string;
}
