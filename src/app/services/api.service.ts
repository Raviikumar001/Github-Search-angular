import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, throwError } from 'rxjs';
import { CachingService } from './caching/caching.service';
import { Octokit } from 'octokit';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl: string = 'https://api.github.com/users/';
  private octokit: Octokit;

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
  ): Observable<any> {
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
          observer.next(response.data);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
}
