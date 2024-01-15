// Import necessary Angular core modules and Okta authentication modules.
import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular'; // Okta modules for authentication state and service.
import { OktaAuth } from '@okta/okta-auth-js'; // OktaAuth module for handling authentication.

// @Component decorator defines the metadata for LoginStatusComponent.
@Component({
  selector: 'app-login-status', // Custom HTML tag for this component.
  templateUrl: './login-status.component.html', // HTML template for this component.
  styleUrls: ['./login-status.component.css'], // CSS stylesheet for this component.
})
// LoginStatusComponent class implementing OnInit for initialization logic.
export class LoginStatusComponent implements OnInit {
  isAuthenticated: boolean = false; // Property to track authentication status.
  userFullName!: string; // Property to store the full name of the authenticated user.

  storage: Storage = sessionStorage; // Defines storage mechanism, set to sessionStorage.

  // Constructor with dependency injection for OktaAuthStateService and OktaAuth.
  constructor(private oktaAuthService: OktaAuthStateService, @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {}

  // ngOnInit lifecycle hook for additional initialization.
  ngOnInit(): void {
    // Subscribing to authentication state changes.
    this.oktaAuthService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated!; // Updating authentication status.
        this.getUserDetails(); // Fetching user details if authenticated.
      }
    );
  }

  // Method to fetch details of the authenticated user.
  getUserDetails() {
    if (this.isAuthenticated) {
      // Fetches the logged-in user details.
      this.oktaAuth.getUser().then((res: any) => {
        this.userFullName = res.name; // Sets the user's full name.

        // Retrieves the user's email from the authentication response.
        const email = res.email;

        // Stores the user's email in browser storage.
        this.storage.setItem('userEmail', JSON.stringify(email));
      });
    }
  }

  // Method to handle user logout.
  logout() {
    // Terminates the session with Okta and removes current tokens.
    this.oktaAuth.signOut();

    // Removes various Okta-related items from localStorage.
    localStorage.removeItem('okta-original-uri-storage');
    localStorage.removeItem('okta-cache-storage');
    localStorage.removeItem('okta-shared-transaction-storage');
    localStorage.removeItem('okta-token-storage');
  }
}
