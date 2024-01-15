import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Component decorator to define selector, template, and styles for the SearchComponent.
 * This component handles the search functionality.
 */
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  // Uncomment the following line if you have specific styles for the search component.
  // styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  /**
   * Constructor to inject dependencies.
   * @param router - Router for navigating to different routes.
   */
  constructor(private router: Router) { }

  /**
   * Method to perform search and navigate to the search route.
   * This method is triggered when a search is performed.
   * @param value - The search keyword entered by the user.
   */
  doSearch(value: string) {
    console.log(`value=${value}`);
    // Navigates to the search route with the given search value
    this.router.navigateByUrl(`/search/${value}`);
  }

  /**
   * Lifecycle hook for initialization.
   * Additional initialization processes can be added here.
   */
  ngOnInit() {
    // Initialization code can be added here if needed
  }
}
