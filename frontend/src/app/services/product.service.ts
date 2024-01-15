// Importing necessary Angular modules and RxJS functionalities
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

// Importing custom types for Product and ProductCategory
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

// Importing environment configuration for API URL
import { environment } from 'src/environments/environment';

// The @Injectable decorator marks this class as one that can be injected with dependencies
@Injectable({
    providedIn: 'root' // Provided in the root level, making it globally available
})
export class ProductService {
    // Base URL for the products API endpoint
    private baseUrl = environment.apiUrl + '/products';

    // URL for the product categories API endpoint
    private categoryUrl = environment.apiUrl + '/product-category';

    // Constructor with HttpClient injected for making HTTP requests
    constructor(private httpClient: HttpClient) { }

    // Method to fetch a single product by its ID
    getProduct(theProductId: number): Observable<Product> {
        const productUrl = `${this.baseUrl}/${theProductId}`;
        return this.httpClient.get<Product>(productUrl);
    }

    // Method to fetch a list of products, with pagination, based on a category ID
    getProductListPaginate(thePage: number, thePageSize: number, theCategoryId: number): Observable
  
This file defines an Angular service named ProductService, which is responsible for fetching product data and product category data from a backend API in an e - commerce application.The service uses Angular's HttpClient to make HTTP requests and RxJS operators for handling the responses. Here's a detailed breakdown:

typescript
Copy code
// Importing necessary Angular modules and RxJS functionalities
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

// Importing custom types for Product and ProductCategory
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

// Importing environment configuration for API URL
import { environment } from 'src/environments/environment';

// The @Injectable decorator marks this class as one that can be injected with dependencies
@Injectable({
    providedIn: 'root' // Provided in the root level, making it globally available
})
export class ProductService {
    // Base URL for the products API endpoint
    private baseUrl = environment.apiUrl + '/products';

    // URL for the product categories API endpoint
    private categoryUrl = environment.apiUrl + '/product-category';

    // Constructor with HttpClient injected for making HTTP requests
    constructor(private httpClient: HttpClient) { }

    // Method to fetch a single product by its ID
    getProduct(theProductId: number): Observable<Product> {
        const productUrl = `${this.baseUrl}/${theProductId}`;
        return this.httpClient.get<Product>(productUrl);
    }

    // Method to fetch a list of products, with pagination, based on a category ID
    getProductListPaginate(thePage: number, thePageSize: number, theCategoryId: number): Observable<GetResponseProducts> {
        const searchUrl = ${ this.baseUrl }/search/findByCategoryId ? id = ${ theCategoryId }
        + & page=${ thePage }& size=${ thePageSize };
        return this.httpClient.get<GetResponseProducts>(searchUrl);
    }

    // Method to fetch a list of products based on a category ID
    getProductList(categoryId: number): Observable<Product[]> {
        const searchUrl = ${ this.baseUrl }/search/findByCategoryId ? id = ${ categoryId };
        return this.getProducts(searchUrl);
    }

    // Private helper method to fetch products based on a search URL
    private getProducts(searchUrl: string): Observable<Product[]> {
        return this.httpClient
            .get<GetResponseProducts>(searchUrl)
            .pipe(map((response) => response._embedded.products));
    }

    // Method to search for products by a keyword
    searchProducts(theKeyword: string): Observable<Product[]> {
        console.log("theKeyword= " + theKeyword);
        const searchUrl = ${ this.baseUrl }/search/findByNameContaining ? name = ${ theKeyword };
        return this.getProducts(searchUrl);
    }

    // Method to search for products by a keyword with pagination
    searchProductsPaginate(thePage: number, thePageSize: number, theKeyword: string): Observable<GetResponseProducts> {
        const searchUrl = ${ this.baseUrl }/search/findByNameContaining ? name = ${ theKeyword }
        + & page=${ thePage }& size=${ thePageSize };
        return this.httpClient.get<GetResponseProducts>(searchUrl);
    }

    // Method to fetch product categories
    getProductCategories(): Observable<ProductCategory[]> {
        return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
            map((response: GetResponseProductCategory) => response._embedded.productCategory)
        );
    }
}

// Interface to model the response structure for products from the API
interface GetResponseProducts {
    _embedded: {
        products: Product[];
    },
    page: {
        size: number,
        totalElements: number,
        totalPages: number,
        number: number
    }
}

// Interface to model the response structure for product categories from the API
interface GetResponseProductCategory {
    _embedded: {
        productCategory: ProductCategory[];
    }
}
