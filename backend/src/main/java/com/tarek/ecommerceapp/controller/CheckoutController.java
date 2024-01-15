package com.tarek.ecommerceapp.controller;


import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.tarek.ecommerceapp.dto.PaymentInfo;
import com.tarek.ecommerceapp.dto.Purchase;
import com.tarek.ecommerceapp.dto.PurchaseResponse;
import com.tarek.ecommerceapp.service.CheckoutService;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.logging.Logger;

@CrossOrigin("https://localhost:4200")
@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {
    private Logger logger = Logger.getLogger( getClass().getName());
    private CheckoutService checkoutService;

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
