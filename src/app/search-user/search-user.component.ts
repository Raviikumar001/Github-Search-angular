import { Component } from '@angular/core';
import { UserRepresentation } from '../services/models/user-representation';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faCoffee,
  faLocationDot,
  faGlobe,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.component.html',
  styleUrls: ['./search-user.component.scss'],
})
export class SearchUserComponent {
  //font awsome icons variables
  faCoffee = faCoffee;

  faLocationDot = faLocationDot;
  faGlobe = faGlobe;
  faSearch = faSearch;
  //
  //component states
  isLoading: boolean = false;
  username: string = '';
  page: number = 1;
  selectedPageSize: number = 10;
  pageSizes: number[] = [10, 25, 50, 100];
  Profile: UserRepresentation = {
    avatar_url: '',
    html_url: '',
    name: '',
    company: '',
    blog: '',
    email: '',
    location: '',
    bio: '',
    twitter_username: '',
    public_repos: 0,
    followers: 0,
    following: 0,
  };
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      console.log(params.get('page'));
      if (params.get('username') === '') {
        this.navigateToHomePage();
      }
      this.username = params.get('username') || '';
      this.page = Number(params.get('page')) || 1;
      const perPageFromUrl = Number(params.get('per_page'));
      if (this.pageSizes.includes(perPageFromUrl)) {
        this.selectedPageSize = perPageFromUrl;
      } else {
        this.selectedPageSize = 10; // Default to 10 if the value from the URL is not valid
      }
      // Fetch user profile data if username is present
      if (this.username) {
        this.fetchUserProfile();
      }
    });
  }

  handlePageSizeChange(event: Event): void {
    const newPageSize = Number((event.target as HTMLSelectElement).value);
    if (this.pageSizes.includes(newPageSize)) {
      this.selectedPageSize = newPageSize;
      this.navigateToSearchPage();
    }
  }

  fetchUserProfile(): void {
    if (this.username.trim()) {
      this.isLoading = true;
      this.apiService.getUser(this.username).subscribe({
        next: (data) => {
          if (data) {
            console.log(data);
            this.isLoading = false;
            this.Profile = data;
            this.error = '';
          }
        },
        error: (error) => {
          console.error('Error fetching user data:', error.error.message);
          if (error.error.message) {
            this.isLoading = false;
            this.error = error.error.message;
          }
        },
      });
    } else {
      this.error = 'Username cannot be empty';
    }
  }

  navigateToHomePage(): void {
    this.router.navigate([''], {});
  }

  navigateToSearchPage() {
    this.router.navigate(['/search'], {
      queryParams: {
        username: this.username,
        page: 1, // Reset the page to 1 when changing the page size
        per_page: this.selectedPageSize,
      },
    });
  }
}
