import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private apiService: ApiService, private router: Router) {}
  username: string = '';
  userData: any;
  isLoading: boolean = false;
  error: string = '';

  onSubmitSearch() {
    if (this.username.trim()) {
      this.isLoading = true;
      this.apiService.getUser(this.username).subscribe({
        next: (data) => {
          if (data) {
            console.log(data);
            this.isLoading = false;
            this.userData = data;
            this.error = '';
            this.navigateToSearchPage();
          }
        },
        error: (error) => {
          // console.error('Error fetching user data:', error.error.message);
          if (error.error.message) {
            this.isLoading = false;
            this.error = error.error.message;
          }
          // Handle error scenario
        },
      });
    } else {
      // Handle empty username scenario
    }
  }

  navigateToSearchPage() {
    this.router.navigate(['/search'], {
      queryParams: {
        username: this.username,
        page: 1,
        per_page: 10,
      },
    });
  }
}
