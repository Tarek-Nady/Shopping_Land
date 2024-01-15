// Import necessary Angular core module and CartService
import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

// Component decorator defining the metadata for the component
@Component({
  selector: 'app-cart-status', // Selector used to identify this component in templates
  templateUrl: './cart-status.component.html', // Path to the HTML template for this component
  // styleUrls: ['./cart-status.component.css'] // Path to the CSS styles (currently commented out)
})
export class CartStatusComponent implements OnInit {

  // Properties to hold the total quantity and price of the cart
  totalQuantity: number = 0;
  totalPrice: number = 0.00;

  // Constructor with CartService injected
  // CartService is used for managing and accessing cart data
  constructor(private cartService: CartService) { }

  // ngOnInit lifecycle hook: Executed after the component's initial construction
  ngOnInit(): void {
    this.updateCartStatus(); // Call to update the cart status on component initialization
  }

  // Method to update the cart's total quantity and price
  updateCartStatus() {
    // Subscribing to the totalQuantity observable from CartService
    // When totalQuantity changes, the component's totalQuantity property is updated
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );  

    // Subscribing to the totalPrice observable from CartService
    // When totalPrice changes, the component's totalPrice property is updated
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );
  }

}
