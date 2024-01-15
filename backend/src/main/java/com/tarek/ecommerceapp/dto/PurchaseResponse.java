package com.tarek.ecommerceapp.dto;


import lombok.Data;

@Data
public class PurchaseResponse {
    private final String orderTrackingNumber; //response with tracking number after you valid purchase
}
