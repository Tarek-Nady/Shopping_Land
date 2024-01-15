import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Import the 'HttpClient' class
import { Product } from '../common/product';
import { Observable, map } from 'rxjs'; // Import the 'Observable' class
import { ProductCategory } from '../common/product-category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  getProduct(theProductId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);
  }

  private baseUrl = environment.apiUrl+'/products';
  private categoryUrl = environment.apiUrl+'/product-category';

  constructor(private httpClient: HttpClient) {}

  getProductListPaginate(thePage:number,
    thePageSize:number,
    theCategoryId:number): Observable<GetResponseProducts> {
    // Build URL based on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                      +`&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }



  getProductList(categoryId:number): Observable<Product[]> {

    // Build URL based on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;

    return this.getProducts(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient
      .get<GetResponseProducts>(searchUrl)
      .pipe(map((response) => response._embedded.products));
  }


  searchProducts(theKeyword: string): Observable<Product[]> {
     console.log("theKeyword= "+theKeyword);
      // Build URL based on keyword
      const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
      return this.getProducts(searchUrl);
    }


    searchProductsPaginate(thePage:number,
      thePageSize:number,
      theKeyword:string): Observable<GetResponseProducts> {
      // Build URL based on category id
      const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
                        +`&page=${thePage}&size=${thePageSize}`;
  
      return this.httpClient.get<GetResponseProducts>(searchUrl);
    }

    
    

  getProductCategories(): Observable<ProductCategory[]>{
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map((response: GetResponseProductCategory) => response._embedded.productCategory)
    );
  }

}


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

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
