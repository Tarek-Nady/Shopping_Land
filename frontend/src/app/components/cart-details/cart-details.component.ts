// Importing Angular core and necessary classes
import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item'; // Import the CartItem model
import { CartService } from 'src/app/services/cart.service'; // Import the CartService

// Component decorator with metadata about the component
@Component({
  selector: 'app-cart-details', // The custom HTML tag to use this component
  templateUrl: './cart-details.component.html', // The HTML template for this component
  styleUrls: ['./cart-details.component.css'] // The CSS styles for this component
})
export class CartDetailsComponent implements OnInit {

  // Properties to hold the cart items, total price, and total quantity
  cartItems: CartItem[] = []; // Array to store cart items
  totalPrice: number = 0; // Store the total price of items in the cart
  totalQuantity: number = 0; // Store the total quantity of items in the cart

  // Constructor with dependency injection of CartService
  constructor(private cartService: CartService) { }

  // ngOnInit lifecycle hook to perform component initialization
  ngOnInit(): void {
    this.listCartDetails(); // Call to list the cart details on component initialization
  }

  // Method to list cart details and update total price and quantity
  listCartDetails() {
    this.cartItems  = this.cartService.cartItems; // Fetch the current cart items from the service
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data // Subscribe to totalPrice observable and update the property
    );

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data // Subscribe to totalQuantity observable and update the property
    );
    this.cartService.computeCartTotals(); // Call to compute the total price and quantity of the cart
  }

  // Method to increment the quantity of a cart item
  incrementQuantity(theCartItem: CartItem) {
    this.cartService.addToCart(theCartItem); // Add the item to the cart, which increments the quantity
  }

  // Method to decrement the quantity of a cart item
  decrementQuantity(theCartItem: CartItem) {
    this.cartService.decrementQuantity(theCartItem); // Decrement the quantity of the given cart item
  }

  // Method to remove an item from the cart
remove(theCartItem: CartItem) {
this.cartService.remove(theCartItem); // Remove the specified item from the cart
}
}
