import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

/**
 * Component decorator defining the selector, template, and styles for the ProductListComponent.
 * This component is responsible for displaying the list of products.
 */
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  // Uncomment the following line if you have specific styles for the product list.
  // styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  // Properties declaration
  products: Product[] = []; // Array to store products
  currentCategoryId: number = 1; // Current category ID, default is 1
  searchMode: boolean = false; // Flag to check if search mode is active
  thePageNumber: number = 1; // Current page number, default is 1
  thePageSize: number = 10; // Number of items per page
  theTotalElements: number = 0; // Total number of elements in the list
  previousCategoryId: number = 1; // Previous category ID for comparison
  previousKeyword: string = ""; // Previous search keyword for comparison

  /**
   * Constructor to inject services.
   * @param productService - The service for fetching product data
   * @param cartService - The service for cart functionality
   * @param route - ActivatedRoute for accessing route parameters
   */
  constructor(private productService: ProductService, private cartService: CartService, private route: ActivatedRoute) { }

  /**
   * Lifecycle hook for initialization.
   * Subscribes to route parameters and lists products accordingly.
   */
  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  /**
   * Lists products based on search mode.
   * Calls appropriate handler for search or list view.
   */
  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  /**
   * Handles product search functionality.
   * Retrieves products based on the search keyword.
   */
  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;
    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }
    this.productService.searchProductsPaginate(this.thePageNumber = 1,
      this.thePageSize,
      theKeyword).subscribe(
        this.proessResult());
  }

  /**
   * Handles listing of products by category.
   * Retrieves products
based on the selected category ID.
*/
  handleListProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      // Obtain category ID from route parameters and update currentCategoryId
      const categoryId = this.route.snapshot.paramMap.get('id');
      this.currentCategoryId = categoryId ? +categoryId : 1;
    } else {
      // Default to category ID 1 if no category ID is present in route
      this.currentCategoryId = 1;
    }

    // Reset page number if category changes
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;

    // Fetch products for the current category
    this.productService.getProductListPaginate(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId)
      .subscribe(this.proessResult());
  }

  /**
  
  Updates the page size based on user selection and refreshes the product list.
  @param pageSize - The new page size selected by the user
  */
  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }
  /**
  
  Processes the result of product list queries.
  Updates the component properties with the data obtained from the ProductService.
  @returns A function that takes the API data and updates the component state
  */
  proessResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }
  /**
  
  Adds a product to the cart.
  Logs the action and calls the cart service to add the product.
  @param theProduct - The product to be added to the cart
  */
  addToCart(theProduct: Product) {
    console.log(`Adding to cart: ${theProduct.name}, Price: ${theProduct.unitPrice}`);
    const theCartItem = new CartItem(theProduct);
    this.cartService.addToCart(theCartItem);
  }
}