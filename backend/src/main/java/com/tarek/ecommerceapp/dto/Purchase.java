package com.tarek.ecommerceapp.dto;


import com.tarek.ecommerceapp.entity.Address;
import com.tarek.ecommerceapp.entity.Customer;
import com.tarek.ecommerceapp.entity.Order;
import com.tarek.ecommerceapp.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase { 
    private Customer customer;
    private Order order;
    private Address shippingAddress;
    private Address billingAddress;
    private Set<OrderItem> orderItems;
}
