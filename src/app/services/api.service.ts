import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, map, throwError } from 'rxjs';
import { CachingService } from './caching/caching.service';
import { Octokit } from 'octokit';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl: string = 'https://api.github.com/users/';
  private octokit: Octokit;

  totalPages: number = 0;
  currentPage: number = 1;
  constructor(
    private httpClient: HttpClient,
    private cachingService: CachingService
  ) {
    this.octokit = new Octokit();
  }

  getUser(githubUsername: string) {
    const cacheKey = `user-${githubUsername}`;
    const observable = this.httpClient.get(this.baseUrl + githubUsername);
    return this.cachingService.getObservable(cacheKey, observable);
  }

  getRepos(
    githubUsername: string,
    page: number,
    perPage: number
  ): Observable<{ data: any; totalPages: number; currentPage: number }> {
    const options = {
      per_page: perPage,
      page: page,
    };

    return new Observable((observer) => {
      this.octokit.rest.repos
        .listForUser({
          username: githubUsername,
          ...options,
        })
        .then((response) => {
          let totalRepos;
          const linkHeader = response.headers['link'];

          if (linkHeader) {
            // Extract the total count of repositories from the link header
            const links = linkHeader.split(',');
            const lastLink = links.find((link) => link.includes('rel="last"'));
            if (lastLink) {
              const lastPageMatch = lastLink.match(/&page=(\d+)>; rel="last"/);
              if (lastPageMatch) {
                const lastPageNumber = parseInt(lastPageMatch[1], 10);
                totalRepos = lastPageNumber * perPage;
              }
            }
          }

          // If totalRepos is still undefined, assume we are on the last page
          if (totalRepos === undefined) {
            totalRepos = response.data.length + (page - 1) * perPage;
          }

          const totalPages = Math.ceil(totalRepos / perPage);
          const currentPage = page;

          observer.next({ data: response.data, totalPages, currentPage });
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
}
