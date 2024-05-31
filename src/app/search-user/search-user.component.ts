import { Component } from '@angular/core';
import { UserRepresentation } from '../services/models/user-representation';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faCoffee,
  faLocationDot,
  faGlobe,
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

  //
  //component states
  isLoading: boolean = false;
  username: string = '';
  page: number = 1;
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

  userProfile = {
    login: 'Raviikumar001',
    id: 52815192,
    node_id: 'MDQ6VXNlcjUyODE1MTky',
    avatar_url: 'https://avatars.githubusercontent.com/u/52815192?v=4',
    gravatar_id: '',
    url: 'https://api.github.com/users/Raviikumar001',
    html_url: 'https://github.com/Raviikumar001',
    followers_url: 'https://api.github.com/users/Raviikumar001/followers',
    following_url:
      'https://api.github.com/users/Raviikumar001/following{/other_user}',
    gists_url: 'https://api.github.com/users/Raviikumar001/gists{/gist_id}',
    starred_url:
      'https://api.github.com/users/Raviikumar001/starred{/owner}{/repo}',
    subscriptions_url:
      'https://api.github.com/users/Raviikumar001/subscriptions',
    organizations_url: 'https://api.github.com/users/Raviikumar001/orgs',
    repos_url: 'https://api.github.com/users/Raviikumar001/repos',
    events_url: 'https://api.github.com/users/Raviikumar001/events{/privacy}',
    received_events_url:
      'https://api.github.com/users/Raviikumar001/received_events',
    type: 'User',
    site_admin: false,
    name: 'Ravi kumar',
    company: null,
    blog: 'https://kumarravi.in/',
    location: 'Dehradun',
    email: null,
    hireable: null,
    bio: '😁 Ecstatic',
    twitter_username: 'ravikumrz',
    public_repos: 87,
    public_gists: 2,
    followers: 11,
    following: 8,
    created_at: '2019-07-12T06:57:12Z',
    updated_at: '2024-05-08T11:57:12Z',
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
      // Fetch user profile data if username is present
      if (this.username) {
        this.fetchUserProfile();
      }
    });
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
}
