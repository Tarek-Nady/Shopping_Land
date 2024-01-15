// Package declaration
package com.tarek.ecommerceapp.controller;

// Import statements
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.tarek.ecommerceapp.dto.PaymentInfo;
import com.tarek.ecommerceapp.dto.Purchase;
import com.tarek.ecommerceapp.dto.PurchaseResponse;
import com.tarek.ecommerceapp.service.CheckoutService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.logging.Logger;

// Enabling Cross-Origin requests from specified origin
@CrossOrigin("https://localhost:4200")
// Marks the class as a REST controller
@RestController
// Base URL for all endpoints in this controller
@RequestMapping("/api/checkout")
public class CheckoutController {
    // Logger for logging messages
    private Logger logger = Logger.getLogger(getClass().getName());

    // Injecting the CheckoutService
    private CheckoutService checkoutService;

    // Constructor-based dependency injection for CheckoutService
    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping("/purchase")
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase) {
        PurchaseResponse purchaseResponse = checkoutService.placeOrder(purchase);
        return purchaseResponse;
    }

    @PostMapping("/payment-intent")
    public ResponseEntity<String> createPaymentIntent(@RequestBody PaymentInfo paymentInfo) throws StripeException {
        logger.info("PaymentInfo: " + paymentInfo.getAmount());
        PaymentIntent paymentIntent = checkoutService.createPaymentIntent(paymentInfo);
        String paymentStr = paymentIntent.toJson();
        return new ResponseEntity<>(paymentStr,  HttpStatus.OK);
    }
}
