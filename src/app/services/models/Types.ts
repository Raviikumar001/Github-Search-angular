export interface UserRepresentation {
  avatar_url?: string;
  html_url: string;
  name: string;
  company?: string;
  blog?: string;
  email?: string;
  location?: string;
  bio?: string;
  twitter_username?: string;
  public_repos?: number;
  followers: number;
  following: number;
}

export interface RepositoryRepresentation {
  name: string;
  description: string;
  html_url: string;
  topics: Array<string>;
  language: Array<string>;
  default_branch: string;
  fork: number;
  pushed_at: string;
}
