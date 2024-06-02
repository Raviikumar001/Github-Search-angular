import { Component } from '@angular/core';
import {
  RepositoryRepresentation,
  UserRepresentation,
} from '../services/models/Types';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  NoReposFound: boolean = false;
  isFetchingRepos: boolean = false;
  username: string = '';
  page: number = 1;
  selectedPageSize: number = 10;
  pageSizes: number[] = [10, 25, 50, 100];

  totalPages: number = 0;
  currentPage: number = 1;
  pageNumbers: number[] = [];

  startPageNumber = 1;
  endPageNumber = 10;

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

  Repos: Array<RepositoryRepresentation> = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap
      .subscribe((params) => {
        console.log(params.get('page'));
        if (params.get('username') === '') {
          this.navigateToHomePage();
        }
        this.username = params.get('username') || '';
        this.page = Number(params.get('page')) || 1;
        this.currentPage = Number(params.get('page')) || 1;
        const perPageFromUrl = Number(params.get('per_page'));
        if (this.pageSizes.includes(perPageFromUrl)) {
          this.selectedPageSize = perPageFromUrl;
        } else {
          this.selectedPageSize = 10; // Default to 10 if the value from the URL is not valid
        }
        // Fetch user profile data if username is present
        if (this.username) {
          this.fetchUserProfile();
          this.fetchRepositories();
        }
      })
      .add(() => {
        this.isLoading = false;
      });
  }

  handlePageSizeChange(event: Event): void {
    const newPageSize = Number((event.target as HTMLSelectElement).value);
    if (this.pageSizes.includes(newPageSize)) {
      this.selectedPageSize = newPageSize;
      this.page = 1;
      this.currentPage = 1;
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
          }
        },
        error: (error) => {
          console.error('Error fetching user data:', error.error.message);
          if (error.error.message) {
            this.isLoading = false;
            this.error = error.error.message;

            this.navigateToHomePage();
          }
        },
      });
    } else {
      this.error = 'Username cannot be empty';
    }
  }

  fetchRepositories(): void {
    this.isFetchingRepos = true;
    this.apiService
      .getRepos(this.username, this.currentPage, this.selectedPageSize)
      .subscribe({
        next: (response) => {
          // Handle the fetched repositories data
          this.isFetchingRepos = false;
          console.log('Fetched repositories:', response.data);
          if (response.data.length === 0) {
            this.NoReposFound = true;
          }
          // You can assign the data to a property in your component
          // or perform any other necessary operations
          this.Repos = response.data;
          // Access the totalPages and currentPage properties from the response
          this.totalPages = response.totalPages;
          this.currentPage = response.currentPage;

          this.updatePageNumberRange();
          // Generate an array of page numbers
          // this.pageNumbers = Array.from(
          //   { length: this.totalPages },
          //   (_, i) => i + 1
          // );

          this.pageNumbers = Array.from(
            { length: this.totalPages },
            (_, i) => i + 1
          );
        },
        error: (error) => {
          this.isFetchingRepos = false;
          console.error('Error fetching repositories:', error);
          this.navigateToHomePage();
          // Handle the error
        },
      });
  }

  //elipiss
  updatePageNumberRange(): void {
    const maxPagesToShow = 10;
    const maxPossibleStartPage = Math.max(
      this.totalPages - maxPagesToShow + 1,
      1
    );
    this.startPageNumber = Math.min(
      Math.max(this.currentPage - Math.floor(maxPagesToShow / 2), 1),
      maxPossibleStartPage
    );
    this.endPageNumber = Math.min(
      this.startPageNumber + maxPagesToShow - 1,
      this.totalPages
    );
  }

  //

  navigateToHomePage(): void {
    this.router.navigate([''], {});
  }

  navigateToSearchPage() {
    this.router.navigate(['/search'], {
      queryParams: {
        username: this.username,
        page: this.currentPage, // Reset the page to 1 when changing the page size
        per_page: this.selectedPageSize,
      },
    });
  }

  //page navigations

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePageNumberRange();
      this.navigateToSearchPage();
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePageNumberRange();
      this.navigateToSearchPage();
    }
  }

  goToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.updatePageNumberRange();
    this.navigateToSearchPage();
  }
}
