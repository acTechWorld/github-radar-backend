import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ai_repo_analysis')
export class AIRepoAnalysis {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  repo_name!: string;

  @Column({ type: 'varchar', length: 255 })
  repo_owner!: string;

  @Column({type: "text"})
  content?: string;

  //Technical Date
  @Column({ type: 'timestamp', default: () => 'NOW()' })
  created_at!: Date;

  //Technical Date
  @Column({ type: 'timestamp', default: () => 'NOW()', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;
}
