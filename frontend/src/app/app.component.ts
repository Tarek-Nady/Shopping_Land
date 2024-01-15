// Importing the Component decorator from Angular core
import { Component } from '@angular/core';

// The @Component decorator function is used to define metadata about the component
@Component({
  selector: 'app-root', // The CSS selector for the component; used in HTML to instantiate this component
  templateUrl: './app.component.html', // The path to the HTML template file for this component
  styleUrls: ['./app.component.css'] // The path to the CSS styles for this component
})
export class AppComponent {
  // A property 'title' defined on the AppComponent class
  title = 'angular-ecommerce';
}
