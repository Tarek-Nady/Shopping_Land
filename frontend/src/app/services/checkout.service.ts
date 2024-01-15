// Importing necessary Angular modules and RxJS Observable
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Importing custom types
import { Purchase } from '../common/purchase';
import { PaymentInfo } from '../common/payment-info';

// Importing environment configuration
import { environment } from 'src/environments/environment';

// The @Injectable decorator marks this class as one that can be injected with dependencies
@Injectable({
  providedIn: 'root' // Provided in the root level, making it globally available
})
export class CheckoutService {
  // URL for the purchase API endpoint, derived from the environment configuration
  private purchaseUrl = environment.apiUrl + '/checkout/purchase';

  // URL for the payment intent API endpoint, also derived from the environment configuration
  private paymentIntentUrl = environment.apiUrl + '/checkout/payment-intent';

  // Constructor with HttpClient injected for making HTTP requests
  constructor(private httpClient: HttpClient) {}

  // Method to place an order. It sends a POST request to the purchase API endpoint
  // The method accepts a Purchase object and returns an Observable
  placeOrder(purchase: Purchase): Observable<any> {
    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }

  // Method to create a payment intent. It sends a POST request to the payment intent API endpoint
  // The method accepts a PaymentInfo object and returns an Observable
  createPaymentIntent(paymentInfo: PaymentInfo): Observable<any> {
    return this.httpClient.post<PaymentInfo>(this.paymentIntentUrl, paymentInfo);
  }
}
