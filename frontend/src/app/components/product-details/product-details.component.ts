import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

/**
 * Component decorator to define selector, template, and styles for the ProductDetailsComponent.
 * This component handles displaying the details of a specific product.
 */
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  // Uncomment the following line if you have specific styles for the product details component.
  // styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product: Product | undefined;  // The product to display details for

  /**
   * Constructor to inject dependencies.
   * @param productService - Service for fetching product data
   * @param cartService - Service for cart functionality
   * @param route - ActivatedRoute to access route parameters
   */
  constructor(private productService: ProductService, private cartService: CartService, private route: ActivatedRoute) { }

  /**
   * Lifecycle hook for initialization.
   * Subscribes to route parameters and fetches product details accordingly.
   */
  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });
  }

  /**
   * Handles fetching the product details.
   * Retrieves product details based on the product ID from the route.
   */
  handleProductDetails() {
    const theProductId: number = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProduct(theProductId).subscribe(
      data => {
        this.product = data;
      }
    );
  }

  /**
   * Adds the current product to the shopping cart.
   * Logs the action and uses the cart service to add the product.
   */
  addToCart() {
    console.log(`Adding to cart: ${this.product?.name}, Price: ${this.product?.unitPrice}`);
    const theCartItem = new CartItem(this.product!);
    this.cartService.addToCart(theCartItem);
  }
}
