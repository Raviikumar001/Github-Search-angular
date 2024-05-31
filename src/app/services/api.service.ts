import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, throwError } from 'rxjs';
import { CachingService } from './caching/caching.service';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl: string = 'https://api.github.com/users/';
  constructor(
    private httpClient: HttpClient,
    private cachingService: CachingService
  ) {}

  getUser(githubUsername: string) {
    // return this.httpClient.get(this.baseUrl + githubUsername);

    const cacheKey = `user-${githubUsername}`;

    const observable = this.httpClient.get(this.baseUrl + githubUsername);
    return this.cachingService.getObservable(cacheKey, observable);
  }

  // implement getRepos method by referring to the documentation. Add proper types for the return type and params
}
