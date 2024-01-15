package com.tarek.ecommerceapp.service;

import com.stripe.model.PaymentIntent;
import com.tarek.ecommerceapp.dto.Purchase;
import com.tarek.ecommerceapp.dto.PurchaseResponse;
import com.tarek.ecommerceapp.dto.PaymentInfo;
import com.stripe.exception.StripeException;
public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);
    PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException;
}
