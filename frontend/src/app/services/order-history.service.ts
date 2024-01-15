// Importing necessary Angular modules and RxJS functionalities
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Importing custom type for OrderHistory
import { OrderHistory } from '../common/order-history';

// Importing environment configuration for API URL
import { environment } from 'src/environments/environment';

// The @Injectable decorator marks this class as one that can be injected with dependencies
@Injectable({
  providedIn: 'root' // Provided in the root level, making it globally available
})
export class OrderHistoryService {
  // URL for the order history API endpoint, derived from the environment configuration
  private orderUrl = environment.apiUrl + '/orders';

  // Constructor with HttpClient injected for making HTTP requests
  constructor(private httpClient: HttpClient) { }

  // Method to get order history for a specific customer email
  getOrderHistory(theEmail: string): Observable<GetResponseOrderHistory> {
    // Constructing the URL with a query parameter for the customer's email
    const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${theEmail}`;

    // Making a GET request to the constructed URL and expecting a response of type GetResponseOrderHistory
    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);
  }
}

// Interface to model the response structure for order history from the API
interface GetResponseOrderHistory {
  _embedded: {
    orders: OrderHistory[];
  }
}
