import { TrendingMetric } from "@/models/TrendingMetric";

type Operation =  'OR' | 'AND'

export interface RepositoryQuery {
    search?: string;
    languages?: string;
    languagesOperation?: Operation;
    stars?: string;
    forks?: string;
    watchers?: string;
    created_after?: string; // ISO date strings
    created_before?: string;
    updated_after?: string;
    updated_before?: string;
    technical_created_at_after?: string; // ISO date strings
    technical_created_at_before?: string;
    technical_updated_at_after?: string; // ISO date strings
    technical_updated_at_before?: string;
    topics?: string;
    topicsOperation?: Operation;
    licenses?: string;
    owner_types?: string;
    open_issues_count?: string;
    stars_last_week?: string;
    page: string;
    limit: string;
    trendingTypes?: string
    trendingTypesOperation? : Operation
    hasReadMe?: 'true' | 'false'
  }

export interface TrendingMetricQuery {
  languages?: string;
  trendingTypes?: string
}
export interface RepositoryBody {
    github_id: number;
    name: string;
    description?: string;
    html_url: string;
    owner_name: string;
    owner_avatar_url?: string;
    stars_count: number;
    forks_count: number;
    watchers_count: number;
    open_issues_count?: number;
    languages: string[]; // List of language names (strings)
    license?: string;
    topics?: string[];
    owner_type?: string; // 'Organization' or 'Individual'
    stars_last_week?: number;
    forks_last_week?: number;
    watchers_last_week?: number;
    creation_date?: Date;
    last_updated?: Date;
    last_pushed?: Date;
  }

  export interface RepositoryUpdateBody {
    github_id?: number;
    name?: string;
    description?: string;
    html_url?: string;
    owner_name?: string;
    owner_avatar_url?: string;
    stars_count?: number;
    forks_count?: number;
    watchers_count?: number;
    open_issues_count?: number;
    languages?: string[]; // List of language names (strings)
    trendingMetrics?: {type: TypeTrendingMetrics, language: string}[]; // List of language names (strings)
    license?: string;
    topics?: string[];
    owner_type?: string; // 'Organization' or 'Individual'
    stars_last_week?: number;
    forks_last_week?: number;
    watchers_last_week?: number;
    creation_date?: Date;
    last_updated?: Date;
    last_pushed?: Date;
    readme_content?: string | null
    last_update_readme?: Date;
  }

  export interface GithubRepoQuery {
    qSearch: string;
    page?: number;
    perPage?: number;
    sort?: 'stars' | 'updated' | 'full_name'
  }

  export interface GithubApiRepo {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    stars_count: number;
    forks_count: number;
    watchers_count: number;
    html_url: string;
    owner_name: string;
    owner_avatar_url: string;
    license: string | null;
    topics: string[];
    creation_date: string; // ISO format string
    last_updated: string;  // ISO format string
    last_pushed: string;  // ISO format string
    open_issues_count: number;
    owner_type: string;
  }

  export type TypeTrendingMetrics = 'global' | 'last_6_months'

  export type LanguageName = 'Vue' | 'React'

  export interface CalculatedTrendingMetrics {
    stars_threshold: number;
    forks_threshold: number;
    watchers_threshold: number;
    combined_threshold: number;
    max_stars: number;
    max_forks: number;
    max_watchers: number;
    type: TypeTrendingMetrics
  }
  