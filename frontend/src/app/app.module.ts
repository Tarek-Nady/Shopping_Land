// Importing necessary Angular core modules, components, and services
import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ProductListComponent, ProductCategoryMenuComponent, ... } from './components/...';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ProductService, AuthInterceptorService, ... } from './services/...';
import { Routes, RouterModule, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { OktaAuthModule, OktaCallbackComponent, OKTA_CONFIG, OktaAuthGuard, ... } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import myAppConfig from './config/my-app-config';

// Configuration for OktaAuth
const oktaConfig = myAppConfig.oidc;
const oktaAuth = new OktaAuth(oktaConfig);

// Function to handle unauthorized access redirects
function sendToLoginPage(oktaAuth: OktaAuth, injector: Injector){
  const router = injector.get(Router);
  router.navigate(['/login']);
}

// Routes configuration for the application
const routes: Routes = [...];

// NgModule decorator to define the module
@NgModule({
  declarations: [
    // List of components that belong to this module
    AppComponent, ProductListComponent, ProductCategoryMenuComponent, ...
  ],
  imports: [
    // List of modules to import into this module
    RouterModule.forRoot(routes), BrowserModule, HttpClientModule, ...
  ],
  providers: [
    // Services and other providers including the configuration for OktaAuth
    ProductService, {provide: OKTA_CONFIG, useValue: {oktaAuth}}, ...
  ],
  bootstrap: [AppComponent] // The root component that Angular creates and inserts into the index.html host web page
})
export class AppModule { }
