import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';

/**
 * Component decorator to define selector, template, and styles for the OrderHistoryComponent.
 * This component is responsible for displaying the order history of a user.
 */
@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  // Uncomment the following line if you have specific styles for the order history component.
  // styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList: OrderHistory[] = []; // Array to store user's order history
  storage: Storage = sessionStorage; // Reference to the sessionStorage for retrieving user data

  /**
   * Constructor to inject OrderHistoryService.
   * @param orderHistoryService - Service to fetch order history data.
   */
  constructor(private orderHistoryService: OrderHistoryService) { }

  /**
   * Lifecycle hook for initialization.
   * Calls the method to handle fetching of order history upon component initialization.
   */
  ngOnInit(): void {
    this.handleOrderHistory();
  }

  /**
   * Fetches and processes the order history for the user.
   * Retrieves order history based on the user's email stored in sessionStorage.
   */
  handleOrderHistory() {
    // Retrieve the user's email from sessionStorage
    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);
    // Fetch order history from the OrderHistoryService
    this.orderHistoryService.getOrderHistory(theEmail).subscribe(
      data => {
        this.orderHistoryList = data._embedded.orders; // Assign the fetched data to 'orderHistoryList'
      }
    )
  }
}
