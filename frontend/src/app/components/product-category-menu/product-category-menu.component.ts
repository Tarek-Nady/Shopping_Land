import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';

/**
 * Component decorator to define selector, template, and styles for the ProductCategoryMenuComponent.
 * This component is responsible for displaying the product categories menu.
 */
@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  // Uncomment the following line if you have specific styles for the product category menu component.
  // styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit {

  productCategories: ProductCategory[] = []; // Array to store product categories

  /**
   * Constructor to inject ProductService.
   * @param productService - Service to fetch product categories.
   */
  constructor(private productService: ProductService) {}

  /**
   * Lifecycle hook for initialization.
   * Calls the method to list product categories upon component initialization.
   */
  ngOnInit() {
    this.listProductCategories();
  }

  /**
   * Fetches and lists product categories.
   * Retrieves product categories from ProductService and assigns them to 'productCategories'.
   */
  listProductCategories() {
    this.productService.getProductCategories().subscribe(
      (data) => {
        // Uncomment the line below for debugging purposes to log the fetched categories
        // console.log('Product Categories=' + JSON.stringify(data));
        this.productCategories = data; // Assign the fetched data to 'productCategories'
      }
    );
  }
}
