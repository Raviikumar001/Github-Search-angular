import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HomeComponent } from './home.component';
import { ApiService } from '../services/api.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let apiServiceMock: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['getUser']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, FormsModule],
      declarations: [HomeComponent],
      providers: [{ provide: ApiService, useValue: apiServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    apiServiceMock = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    fixture.detectChanges();
  });
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to search page with correct query params on successful user search', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');
    const mockUserData = {
      /* mock user data */
    };
    apiServiceMock.getUser.and.returnValue(of(mockUserData));

    component.username = 'testuser';
    component.onSubmitSearch();

    expect(apiServiceMock.getUser).toHaveBeenCalledWith('testuser');
    expect(navigateSpy).toHaveBeenCalledWith(['/search'], {
      queryParams: {
        username: 'testuser',
        page: 1,
        per_page: 10,
      },
    });
  });

  it('should set the error message on failed user search', () => {
    const errorMessage = 'User not found';
    apiServiceMock.getUser.and.returnValue(
      throwError({ error: { message: errorMessage } })
    );

    component.username = 'testuser';
    component.onSubmitSearch();

    expect(component.error).toEqual(errorMessage);
  });

  it('should not search for an empty username', () => {
    const navigateSpy = spyOn(component, 'navigateToSearchPage');
    apiServiceMock.getUser.and.returnValue(of({}));

    component.username = '';
    component.onSubmitSearch();

    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
