import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
 
@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css'],
})
export class LoginStatusComponent implements OnInit {
  isAuthenticated: boolean = false;
  userFullName!: string ;

  storage: Storage = sessionStorage;
  

  constructor(private oktaAuthService: OktaAuthStateService, @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {}

  ngOnInit(): void {
    this.oktaAuthService.authState$.subscribe(
      (result) => {
      this.isAuthenticated = result.isAuthenticated!;
      this.getUserDetails();
    });
  }

  getUserDetails() {
    if (this.isAuthenticated) {
      // fetch the logged in user details

      // user full name is exposed as a property name
      this.oktaAuth.getUser().then((res:any) => {
        this.userFullName = res.name;

        // retrieve the user's email from auth response
        const email = res.email;

        // store the email in browser storage
        this.storage.setItem('userEmail', JSON.stringify(email));
      });
    }
  }

  logout() {
    // terminates the session with Okta and removes current tokens
    this.oktaAuth.signOut();

    localStorage.removeItem('okta-original-uri-storage');
    localStorage.removeItem('okta-cache-storage');
    localStorage.removeItem('okta-shared-transaction-storage');
    localStorage.removeItem('okta-token-storage');
  }
}