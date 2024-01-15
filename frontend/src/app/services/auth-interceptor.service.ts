// Import necessary Angular HTTP and core modules
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

// Import Okta authentication modules
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

// Import RxJS Observable and other utilities
import { Observable, from, lastValueFrom } from 'rxjs';

// Import environment configuration
import { environment } from 'src/environments/environment';

// Decorator marking the class as injectable and provided in the root level
@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  // Constructor with OktaAuth injected for authentication
  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

  // Implementation of the intercept method from HttpInterceptor
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Interceptor executed', req); // Logging the intercepted request
    // Convert the promise returned by handleAccess to an Observable
    return from(this.handleAccess(req, next));
  }

  // Private async method to handle the request
  private async handleAccess(req: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    // Define a secure endpoint that requires the access token
    const theEndpoint = environment.apiUrl + '/orders';
    const secureEndpoints = [theEndpoint];
    
    // Check if the request URL is one of the secure endpoints
    if (secureEndpoints.some(url => req.urlWithParams.includes(url))) {
      // Fetch the access token from OktaAuth
      const accessToken = this.oktaAuth.getAccessToken();
      console.log('accessToken', this.oktaAuth.isAuthenticated()); // Log the access token and authentication status
      // Clone the request and set the Authorization header with the access token
      req = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + accessToken
        }
      });
    }
    // Pass the request to the next handler in the chain
    return await lastValueFrom(next.handle(req));
  }
}
