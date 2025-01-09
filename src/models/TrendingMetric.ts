import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('trending_metrics')
export class TrendingMetric {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  language!: string; // e.g., "JavaScript", "Python"

  @Column({ type: 'int', default: 50 })
  min_star_growth!: number; // Minimum stars growth in a week to be trending

  @Column({ type: 'int', default: 10 })
  min_fork_growth!: number; // Minimum forks growth in a week to be trending

  @Column({ type: 'int', default: 5 })
  min_watcher_growth!: number; // Minimum watchers growth in a week to be trending

  @Column({ type: 'int', default: 70 })
  min_combined_growth!: number; // Minimum combined growth of all metrics to be trending

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;
}
