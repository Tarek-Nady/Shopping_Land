// Package declaration
package com.tarek.ecommerceapp.service;

// Import statements
import com.stripe.model.PaymentIntent;
import com.tarek.ecommerceapp.dto.Purchase;
import com.tarek.ecommerceapp.dto.PurchaseResponse;
import com.tarek.ecommerceapp.dto.PaymentInfo;
import com.stripe.exception.StripeException;

// Public interface declaration
public interface CheckoutService {

    // Method signature for placing an order
    PurchaseResponse placeOrder(Purchase purchase);

    // Method signature for creating a payment intent with Stripe
    PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException;
}
