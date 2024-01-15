import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

// The @Injectable decorator marks this class as one that can be injected with dependencies
@Injectable({
    providedIn: 'root' // Provided in the root, making it available across the entire app
})
export class CartService {
    // Array to store items in the cart
    cartItems: CartItem[] = [];

    // Observables for the total price and quantity of the cart
    totalPrice: Subject<number> = new BehaviorSubject<number>(0);
    totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

    // Using local storage to persist cart items
    storage: Storage = localStorage;

    constructor() {
        // On initialization, load cart items from local storage
        let data = JSON.parse(this.storage.getItem('cartItems')!);
        if (data != null) {
            this.cartItems = data;
            // Recalculate totals based on the items loaded from storage
            this.computeCartTotals();
        }
    }

    // Method to add an item to the cart
    addToCart(theCartItem: CartItem) {
        let alreadyExistsInCart: boolean = false;
        let existingCartItem: CartItem = undefined!;

        // Check if the item already exists in the cart
        if (this.cartItems.length > 0) {
            existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id)!;
            alreadyExistsInCart = (existingCartItem != undefined);
        }

        // If exists, increment quantity; if not, add to cart
        if (alreadyExistsInCart) {
            existingCartItem.quantity++;
        }
        else {
            this.cartItems.push(theCartItem);
        }

        // Recalculate cart totals
        this.computeCartTotals();
    }

    // Method to compute the total price and quantity of the cart
    computeCartTotals() {
        let totalPriceValue: number = 0;
        let totalQuantityValue: number = 0;
        // Iterate over each item in the cart to calculate total price and quantity
        for (let currentCartItem of this.cartItems) {
            totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
            totalQuantityValue += currentCartItem.quantity;
        }

        // Update the observables with the new total values
        this.totalPrice.next(totalPriceValue);
        this.totalQuantity.next(totalQuantityValue);

        // Log cart data for debugging and persist the cart items
        this.logCartData(totalPriceValue, totalQuantityValue);
        this.persistCartItems();
    }

    // Method to save the cart items to local storage
    persistCartItems() {
        this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
    }

    // Utility method for logging cart data
    logCartData(totalPriceValue: number, totalQuantityValue: number) {
        console.log('Contents of the cart');
        for (let tempCartItem of this.cartItems) {
            const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
            console.log(name: ${ tempCartItem.name }, quantity = ${ tempCartItem.quantity }, unitPrice = ${ tempCartItem.unitPrice }, subTotalPrice = ${ subTotalPrice });
        }
        console.log(totalPrice: ${ totalPriceValue.toFixed(2) }, totalQuantity = ${ totalQuantityValue });
        console.log('----');
    }

    // Method to decrement the quantity of a cart item
    decrementQuantity(theCartItem: CartItem) {
        theCartItem.quantity--;
        if (theCartItem.quantity === 0) {
            this.remove(theCartItem);
        }
        else {
            this.computeCartTotals();
        }
    }

    // Method to remove a cart item
    remove(theCartItem: CartItem) {
        const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);
        if (itemIndex > -1) {
            this.cartItems.splice(itemIndex, 1);
            this.computeCartTotals();
        }
    }
}
