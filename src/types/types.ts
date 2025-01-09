type Operation =  'OR' | 'AND'

export interface RepositoryQuery {
    languages?: string;
    languagesOperation?: Operation;
    stars?: string;
    forks?: string;
    created_after?: string; // ISO date strings
    created_before?: string;
    updated_after?: string;
    updated_before?: string;
    topics?: string;
    topicsOperation?: Operation;
    licenses?: string;
    owner_type?: string;
    open_issues_count?: string;
    is_trending?: boolean;
    stars_last_week?: string;
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
    is_trending?: boolean;
    stars_last_week?: number;
    forks_last_week?: number;
    watchers_last_week?: number;
    creation_date?: Date;
    last_updated?: Date;
    last_pushed?: Date;
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

  export interface Thresholds {
    stars_threshold: number;
    forks_threshold: number;
    watchers_threshold: number;
  }
  