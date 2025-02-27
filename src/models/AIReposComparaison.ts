import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ai_repos_comparaison')
export class AIReposComparaison {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name!: string;

  @Column({ type: 'varchar', length: 100 })
  type!: string;

  @Column({type: "text"})
  content?: string;

  //Technical Date
  @Column({ type: 'timestamp', default: () => 'NOW()' })
  created_at!: Date;

  //Technical Date
  @Column({ type: 'timestamp', default: () => 'NOW()', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;
}
