import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, AfterLoad, BeforeInsert, BeforeUpdate, ManyToOne } from 'typeorm';
import { Language } from './Language';
import { TrendingMetric } from './TrendingMetric';

@Entity('repositories')
export class Repository {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'bigint', unique: true })
  github_id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'varchar', length: 500 })
  html_url!: string;

  @Column({ type: 'varchar', length: 255 })
  owner_name!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  owner_avatar_url!: string;

  @Column({ type: 'int' })
  stars_count!: number;

  @Column({ type: 'varchar', length: 255 })
  stars_history!: string;

  @Column({ type: 'int' })
  stars_last_week!: number;

  @BeforeInsert()
  @BeforeUpdate()
  getStarsLastWeek() {
    const listStars = this.stars_history?.split(',')
    if(listStars && listStars.length > 0) {
      const lastStars = parseInt(listStars[0])
      const firstStars = parseInt(listStars[listStars.length - 1])
      this.stars_last_week = listStars && listStars.length > 0 && !isNaN(lastStars) && !isNaN(firstStars) ? lastStars - firstStars : 0
    } else {
      this.stars_last_week = 0 
    }
  }

  @Column({ type: 'int' })
  forks_count!: number;

  @Column({ type: 'varchar', length: 255 })
  forks_history!: string;

  @Column({ type: 'int' })
  forks_last_week!: number;

  @BeforeInsert()
  @BeforeUpdate()
  getForksLastWeek() {
    const listForks = this.forks_history?.split(',')
    if(listForks && listForks?.length >0) {
      const lastForks = parseInt(listForks[0])
      const firstForks = parseInt(listForks[listForks.length - 1])
      this.forks_last_week = listForks && listForks.length > 0 && !isNaN(lastForks) && !isNaN(firstForks) ? lastForks - firstForks : 0
    } else {
      this.forks_last_week = 0 
    }
  }

  @Column({ type: 'int' })
  watchers_count!: number;

  @Column({ type: 'varchar', length: 255 })
  watchers_history!: string;

  @Column({ type: 'int' })
  watchers_last_week!: number;

  @BeforeInsert()
  @BeforeUpdate()
  getFWatchersLastWeek() {
    const listWatchers = this.watchers_history?.split(',')
    if(listWatchers && listWatchers?.length >0) {
      const lastWatchers = parseInt(listWatchers[0])
      const firstWatchers = parseInt(listWatchers[listWatchers.length - 1])
      this.watchers_last_week = listWatchers && listWatchers.length > 0 && !isNaN(lastWatchers) && !isNaN(firstWatchers) ? lastWatchers - firstWatchers : 0
    } else {
      this.watchers_last_week = 0
    }
  }

  @Column({ type: 'int', nullable: true })
  open_issues_count!: number;

  @ManyToMany(() => Language, (language) => language.repositories, { cascade: true })
  @JoinTable({
    name: 'repository_languages',
    joinColumn: {
      name: 'repository_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'language_id',
      referencedColumnName: 'id',
    },
  })
  languages!: Language[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  license!: string;

  @Column({ type: 'text', array: true, nullable: true })
  topics!: string[];

  //Repo Date
  @Column({ type: 'timestamp' })
  creation_date!: Date;

  //Repo Date
  @Column({ type: 'timestamp' })
  last_updated!: Date;

  //Technical Date
  @Column({ type: 'timestamp', default: () => 'NOW()' })
  created_at!: Date;

  //Technical Date
  @Column({ type: 'timestamp', default: () => 'NOW()', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  owner_type!: string; // 'Organization' or 'Individual'

  @ManyToMany(() => TrendingMetric, (trending_metric) => trending_metric.repositories, { cascade: true })
  @JoinTable({
    name: 'repository_trendingMetrics',
    joinColumn: {
      name: 'repository_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'trending_metric_id',
      referencedColumnName: 'id',
    },
  })
  trending_metrics!: TrendingMetric[]
}
