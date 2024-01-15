// Importing necessary Angular core and Okta authentication modules.
import { Component, Inject, OnInit } from '@angular/core'; // Angular core modules for component creation and lifecycle hooks.
import { OKTA_AUTH } from '@okta/okta-angular'; // Importing a constant used for dependency injection with Okta.
import { OktaAuth } from '@okta/okta-auth-js'; // OktaAuth module for handling authentication.
import OktaSignIn from '@okta/okta-signin-widget'; // Importing Okta's sign-in widget module.
import myAppConfig from '../../config/my-app-config'; // Importing application-specific configuration for Okta.

// @Component decorator to define metadata for the LoginComponent.
@Component({
  selector: 'app-login', // Defines the custom HTML tag for this component.
  templateUrl: './login.component.html', // Link to the HTML template for this component.
  styleUrls: ['./login.component.css'] // Link to the CSS stylesheet for this component.
})
// LoginComponent class implementing OnInit interface for initialization logic.
export class LoginComponent implements OnInit {
  oktaSignin: any; // Property to hold the Okta sign-in widget instance.

  // Constructor for the LoginComponent, with dependency injection for OktaAuth.
  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {
    // Initializing the Okta sign-in widget with configuration settings.
    this.oktaSignin = new OktaSignIn({
      logo: '../../../assets/images/logo.png', // Setting a custom logo for the sign-in widget.
      baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0], // Base URL derived from issuer in the config.
      clientId: myAppConfig.oidc.clientId, // Client ID for Okta authentication.
      redirectUri: myAppConfig.oidc.redirectUri, // Redirect URI after successful authentication.
      authParams: {
        pkce: true, // Using Proof Key for Code Exchange (PKCE) flow for enhanced security.
        issuer: myAppConfig.oidc.issuer, // Issuer URL for Okta authentication.
        scopes: myAppConfig.oidc.scopes // Scopes for access privileges.
      }
    });
  }

  // ngOnInit lifecycle hook for additional initialization.
  ngOnInit(): void {
    this.oktaSignin.remove(); // Removing any previous instances of the sign-in widget.
    // Rendering the sign-in widget in the specified DOM element.
    this.oktaSignin.renderEl({
      el: '#okta-sign-in-widget' // Target element for the widget.
    },
      (response: any) => { // Callback for successful authentication.
        if (response.status === 'SUCCESS') {
          this.oktaAuth.signInWithRedirect(); // Redirecting after successful authentication.
        }
      },
      (error: any) => { // Error handling
        throw error; // Throwing an error in case of authentication failure.
}
);
}
}
