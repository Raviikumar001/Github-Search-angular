import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchUserComponent } from './search-user.component';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SearchUserComponent', () => {
  let component: SearchUserComponent;
  let fixture: ComponentFixture<SearchUserComponent>;
  let apiServiceMock: any;
  let routerMock: any;
  let activatedRouteMock: any;

  beforeEach(async () => {
    apiServiceMock = jasmine.createSpyObj('ApiService', [
      'getUser',
      'getRepos',
    ]);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    activatedRouteMock = {
      queryParamMap: of({
        get: (param: string) => {
          switch (param) {
            case 'username':
              return 'testuser';
            case 'page':
              return '1';
            case 'per_page':
              return '10';
            default:
              return null;
          }
        },
      }),
    };

    await TestBed.configureTestingModule({
      declarations: [SearchUserComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.isLoading).toBeFalse();
    expect(component.NoReposFound).toBeFalse();
    expect(component.isFetchingRepos).toBeFalse();
    expect(component.username).toBe('testuser');
    expect(component.page).toBe(1);
    expect(component.selectedPageSize).toBe(10);
  });

  it('should navigate to home page if username is empty', () => {
    activatedRouteMock.queryParamMap = of({
      get: (param: string) => '',
    });
    component.ngOnInit();
    expect(routerMock.navigate).toHaveBeenCalledWith([''], {});
  });

  it('should fetch user profile data', () => {
    const mockProfile = {
      avatar_url: 'https://example.com/avatar.jpg',
      html_url: 'https://github.com/mockuser',
      name: 'John Doe',
      company: 'Tech Innovators Inc.',
      blog: 'https://johndoe.tech',
      email: 'johndoe@example.com',
      location: 'San Francisco, CA',
      bio: 'Full-stack developer with a passion for creating innovative solutions. Open-source enthusiast and tech blogger.',
      twitter_username: 'johndoe_tech',
      public_repos: 42,
      followers: 1500,
      following: 200,
    };
    apiServiceMock.getUser.and.returnValue(of(mockProfile));
    component.fetchUserProfile();
    expect(apiServiceMock.getUser).toHaveBeenCalledWith('testuser');
    expect(component.isLoading).toBeFalse();
    expect(component.Profile).toEqual(mockProfile);
  });

  it('should handle error when fetching user profile', () => {
    const errorResponse = { error: { message: 'User not found' } };
    apiServiceMock.getUser.and.returnValue(throwError(errorResponse));
    component.fetchUserProfile();
    expect(component.isLoading).toBeFalse();
    expect(component.error).toBe('User not found');
    expect(routerMock.navigate).toHaveBeenCalledWith([''], {});
  });

  it('should fetch repositories', () => {
    const mockRepos = {
      data: [
        {
          name: 'Repo 1',
          description: 'A sample repository',
          html_url: 'https://github.com/testuser/repo1',
          topics: ['sample', 'test'],
          language: ['JavaScript'],
          default_branch: 'main',
          forks: 5,
          pushed_at: '2023-05-01T12:00:00Z',
        },
      ],
      totalPages: 1,
      currentPage: 1,
    };

    apiServiceMock.getRepos.and.returnValue(of(mockRepos));
    component.fetchRepositories();
    expect(apiServiceMock.getRepos).toHaveBeenCalledWith('testuser', 1, 10);
    expect(component.isFetchingRepos).toBeFalse();
    expect(component.Repos).toEqual(mockRepos.data);
    expect(component.totalPages).toBe(1);
    expect(component.currentPage).toBe(1);
  });

  it('should handle error when fetching repositories', () => {
    apiServiceMock.getRepos.and.returnValue(throwError({}));
    component.fetchRepositories();
    expect(component.isFetchingRepos).toBeFalse();
    expect(routerMock.navigate).toHaveBeenCalledWith([''], {});
  });

  it('should handle page size change', () => {
    const event = { target: { value: '25' } } as unknown as Event;
    component.handlePageSizeChange(event);
    expect(component.selectedPageSize).toBe(25);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/search'], {
      queryParams: { username: 'testuser', page: 1, per_page: 25 },
    });
  });

  it('should navigate to previous page', () => {
    component.currentPage = 2;
    component.goToPreviousPage();
    expect(component.currentPage).toBe(1);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/search'], {
      queryParams: { username: 'testuser', page: 1, per_page: 10 },
    });
  });

  it('should navigate to next page', () => {
    component.totalPages = 3;
    component.currentPage = 1;
    component.goToNextPage();
    expect(component.currentPage).toBe(2);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/search'], {
      queryParams: { username: 'testuser', page: 2, per_page: 10 },
    });
  });

  it('should navigate to specific page', () => {
    component.goToPage(3);
    expect(component.currentPage).toBe(3);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/search'], {
      queryParams: { username: 'testuser', page: 3, per_page: 10 },
    });
  });

  it('should format date correctly', () => {
    const date = new Date();
    date.setDate(date.getDate() - 10); // 10 days ago
    const formattedDate = component.formatDate(date.toISOString());
    expect(formattedDate).toBe('10 days ago');
  });
});
