import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
import { Repository } from './Repository';
import { TypeTrendingMetrics } from '@/types/types';

@Entity('trending_metrics')
export class TrendingMetric {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  language!: string; // e.g., "JavaScript", "Python"

  @Column({ type: 'varchar', length: 100 })
  type!: TypeTrendingMetrics;

  @Column({ type: 'float', default: 0.5 })
  stars_threshold!: number; // Minimum stars growth score in a week to be trending

  @Column({ type: 'float', default: 0.5 })
  forks_threshold!: number; // Minimum forks growth score in a week to be trending

  @Column({ type: 'float', default: 0.5 })
  watchers_threshold!: number; // Minimum watchers growth score in a week to be trending

  @Column({ type: 'float', default: 1.5 })
  combined_threshold!: number; // Minimum combined growth score of all metrics to be trending

  @Column({ type: 'int', default: 50 })
  max_stars!: number; // Minimum stars growth score in a week to be trending

  @Column({ type: 'int', default: 50 })
  max_forks!: number; // Minimum forks growth score in a week to be trending

  @Column({ type: 'int', default: 50 })
  max_watchers!: number; // Minimum watchers growth score in a week to be trending

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @ManyToMany(() => Repository, (repository) => repository.trending_metrics)
  repositories!: Repository[];
}
