import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaymentInfo } from '../common/payment-info';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private purchaseUrl = environment.apiUrl+'/checkout/purchase';
  
  private paymentIntentUrl = environment.apiUrl+'/checkout/payment-intent';
  
  constructor(private httpclient: HttpClient) {}
  
  placeOrder(purchase: Purchase): Observable<any> {
    return this.httpclient.post<Purchase>(this.purchaseUrl, purchase);
  }

  createPaymentIntent(paymentInfo: PaymentInfo): Observable<any> {
    return this.httpclient.post<PaymentInfo>(this.paymentIntentUrl, paymentInfo);
  }
}
