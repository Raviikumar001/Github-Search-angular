import { Component } from '@angular/core';
import { UserRepresentation } from '../services/models/user-representation';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import {
  faCoffee,
  faLocationDot,
  faGlobe,
  faSearch,
  faCodeBranch,
  faCodeFork,
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
  faCodeFork = faCodeFork;
  faCodeBranch = faCodeBranch;
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

  Repo = {
    name: 'Front-End-Web-UI-Frameworks-and-Tools-Bootstrap-4',
    description: 'null',
    html_url:
      'https://github.com/Raviikumar001/-Front-End-Web-UI-Frameworks-and-Tools-Bootstrap-4',
    topics: 'Javascript',
    language: 'HTML',
    default_branch: 'main',
    fork: 10,
    pushed_at: '2022-08-23T05:56:16Z',
  };
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
        // this.fetchUserProfile();
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

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const today = new Date();
    const diffInMs = today.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return '1 day ago';
    } else if (diffInDays < 30) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 365) {
      const diffInMonths = Math.floor(diffInDays / 30);
      return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    } else {
      const diffInYears = Math.floor(diffInDays / 365);
      return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
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

            this.fetchRepositories();
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

  fetchRepositories(): void {
    this.apiService
      .getRepos(this.username, this.page, this.selectedPageSize)
      .subscribe({
        next: (data) => {
          // Handle the fetched repositories data
          console.log('Fetched repositories:', data);
          // You can assign the data to a property in your component
          // or perform any other necessary operations
        },
        error: (error) => {
          console.error('Error fetching repositories:', error);
          // Handle the error
        },
      });
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
