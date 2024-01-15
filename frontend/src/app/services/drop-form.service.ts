// Importing Angular's HttpClient for making HTTP requests and necessary RxJS operators
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';

// Importing custom types for Country and State
import { Country } from '../common/country';
import { State } from '../common/state';

// Importing environment configuration for API URL
import { environment } from 'src/environments/environment';

// @Injectable decorator marks this class as one that can be injected with dependencies
@Injectable({
  providedIn: 'root' // Provided in the root, making it available across the app
})
export class DropFormService {
  // URL for the countries API endpoint
  private countriesUrl = environment.apiUrl + '/countries';

  // URL for the states API endpoint
  private statesUrl = environment.apiUrl + '/states';

  // Constructor with HttpClient injected for making HTTP requests
  constructor(private httpClient: HttpClient) { }

  // Method to fetch countries data from the API
  getCountries(): Observable<Country[]> {
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  // Method to fetch states data based on a country code
  getStates(theCountryCode: string): Observable<State[]> {
    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;
    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response => response._embedded.states)
    );
  }

  // Method to generate an array of months for credit card expiration, starting from a given month
  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];
    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }
    return of(data);
  }

  // Method to generate an array of years for credit card expiration
  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;
    for(let theYear = startYear; theYear <= endYear; theYear++) {
data.push(theYear);
}
return of(data);
}
}

// Interface to model the response structure for countries from the API
interface GetResponseCountries {
_embedded: {
countries: Country[];
}
}

// Interface to model the response structure for states from the API
interface GetResponseStates {
_embedded: {
states: State[];
}
}
