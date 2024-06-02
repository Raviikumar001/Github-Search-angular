import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { CachingService } from './caching/caching.service';
import { of, Observable } from 'rxjs';
import { Octokit } from 'octokit';

// Define MockOctokit inside the spec file
class MockOctokit {
  rest = {
    repos: {
      listForUser: jasmine.createSpy('listForUser').and.callFake(() =>
        Promise.resolve({
          data: [{ id: 1, name: 'repo1' }],
          headers: {
            link: '<https://api.github.com/user/repos?page=2>; rel="last"',
          },
        })
      ),
    },
  };
}

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  let cachingService: jasmine.SpyObj<CachingService>;
  let mockOctokit: MockOctokit;

  beforeEach(() => {
    const cachingServiceSpy = jasmine.createSpyObj('CachingService', [
      'getObservable',
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiService,
        { provide: CachingService, useValue: cachingServiceSpy },
        { provide: Octokit, useClass: MockOctokit },
      ],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
    cachingService = TestBed.inject(
      CachingService
    ) as jasmine.SpyObj<CachingService>;
    mockOctokit = TestBed.inject(Octokit) as unknown as MockOctokit;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch user data and use cache', () => {
    const dummyUser = { login: 'testuser', id: 1 };
    cachingService.getObservable.and.callFake((key, obs) => obs);

    service.getUser('testuser').subscribe((user) => {
      expect(user).toEqual(dummyUser);
    });

    const req = httpMock.expectOne('https://api.github.com/users/testuser');
    expect(req.request.method).toBe('GET');
    req.flush(dummyUser);
  });

  it('should fetch repos data and use cache', () => {
    const dummyRepos = [{ id: 1, name: 'repo1' }];
    const totalPages = 2;
    const currentPage = 1;

    // Create a properly typed Observable to ensure type safety
    const fetchObservable = new Observable<{
      data: any;
      totalPages: number;
      currentPage: number;
    }>((observer) => {
      mockOctokit.rest.repos
        .listForUser({
          username: 'testuser',
          per_page: 30,
          page: 1,
        })
        .then((response: { data: any; headers: { link: string } }) => {
          observer.next({
            data: response.data,
            totalPages,
            currentPage,
          });
          observer.complete();
        })
        .catch((error: any) => observer.error(error));
    });

    // Use generic type to ensure compatibility with service method
    cachingService.getObservable.and.callFake(
      <T>(key: string, obs: Observable<T>) =>
        fetchObservable as unknown as Observable<T>
    );

    service.getRepos('testuser', 1, 30).subscribe((result) => {
      expect(result.data).toEqual(dummyRepos);
      expect(result.totalPages).toEqual(totalPages);
      expect(result.currentPage).toEqual(currentPage);
    });

    expect(mockOctokit.rest.repos.listForUser).toHaveBeenCalledWith({
      username: 'testuser',
      per_page: 30,
      page: 1,
    });
  });
});
