import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { PaymentInfo } from 'src/app/common/payment-info';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { DropFormService } from 'src/app/services/drop-form.service';
import { FormValidators } from 'src/app/validators/form-validators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  // Component properties.
  checkoutFormGroup: FormGroup | undefined; // FormGroup for the checkout form.
  totalPrice: number = 0; // Total price of the items in the cart.
  totalQuantity: number = 0; // Total quantity of items in the cart.
  creditCardYears: number[] = []; // Array for credit card expiration years.
  creditCardMonths: number[] = []; // Array for credit card expiration months.
  countries: Country[] | undefined; // Array of countries for dropdown.
  shippingAddressStates: State[] | undefined; // States for the shipping address dropdown.
  billingAddressStates: State[] | undefined; // States for the billing address dropdown.
  storage: Storage = sessionStorage; // Session storage for persistence.
  stripe = Stripe(environment.StripePublicKey); // Stripe payment gateway integration.
  paymentInfo: PaymentInfo = new PaymentInfo(); // Payment information structure.
  cardElement: any; // Element for the Stripe card input.
  displayError: any = ""; // To display payment errors.
  isDisabled: Boolean = false; // To disable the submit button after submission.
  constructor(private formBuilder: FormBuilder, private dropFormservice: DropFormService, private cartService: CartService, private checkoutService: CheckoutService, private router: Router) { }

  ngOnInit(): void {
    // this.stripe = Stripe(environment.StripePublicKey);
    this.setupStripePaymentForm();
    this.reviewCartDetails();
    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), FormValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), FormValidators.notOnlyWhitespace]),
        email: new FormControl(theEmail, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), FormValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), FormValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), FormValidators.notOnlyWhitespace]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), FormValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), FormValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), FormValidators.notOnlyWhitespace]),
      }),
      creditCard: this.formBuilder.group({
        // cardType : new FormControl('',[Validators.required]),
        // nameOnCard : new FormControl('',[Validators.required,Validators.minLength(2),FormValidators.notOnlyWhitespace]),
        // cardNumber : new FormControl('',[Validators.required,Validators.pattern('[0-9]{16}')]),
        // securityCode : new FormControl('',[Validators.required,Validators.pattern('[0-9]{3}')]),
        // expirationMonth : [''],
        // expirationYear : ['']
      }),
    });
    // const startMonth: number = new Date().getMonth() + 1;
    // console.log("startMonth: " + startMonth);
    // this.dropFormservice.getCreditCardMonths(startMonth).subscribe(
    //   data => {
    //     console.log("Retrieved credit card months: " + JSON.stringify(data));
    //     this.creditCardMonths = data;
    //   }
    // );
    // this.dropFormservice.getCreditCardYears().subscribe(
    //   data => {
    //     console.log("Retrieved credit card years: " + JSON.stringify(data));
    //     this.creditCardYears = data;
    //   }
    // );

    this.dropFormservice.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );
  }
  setupStripePaymentForm() {
    var elements = this.stripe.elements();
    this.cardElement = elements.create('card', { hidePostalCode: true });
    this.cardElement.mount('#card-element');
    // add event binding for the 'change' event on the card element
    this.cardElement.on('change', (event: any) => {
      //get a handle to card-errors element
      this.displayError = document.getElementById('card-errors');
      if (event.complete) {
        this.displayError!.textContent = '';
      } else if (event.error) {
        //show validation to the user
        this.displayError!.textContent = event.error.message;
      }
    });
  }
  reviewCartDetails() {
    //subscribe to cartService.totalQuantity
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );
    //subscribe to cartService.totalPrice
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );
  }

  // getters for shipping form
  get firstName() {
    return this.checkoutFormGroup?.get('customer.firstName');
  }
  get lastName() {
    return this.checkoutFormGroup?.get('customer.lastName');
  }
  get email() {
    return this.checkoutFormGroup?.get('customer.email');
  }
  get shippingAddressStreet() {
    return this.checkoutFormGroup?.get('shippingAddress.street');
  }
  get shippingAddressCity() {
    return this.checkoutFormGroup?.get('shippingAddress.city');
  }
  get shippingAddressState() {
    return this.checkoutFormGroup?.get('shippingAddress.state');
  }
  get shippingAddressCountry() {
    return this.checkoutFormGroup?.get('shippingAddress.country');
  }
  get shippingAddressZipCode() {
    return this.checkoutFormGroup?.get('shippingAddress.zipCode');
  }


  // getters for billing address form
  get billingAddressStreet() {
    return this.checkoutFormGroup?.get('billingAddress.street');
  }
  get billingAddressCity() {
    return this.checkoutFormGroup?.get('billingAddress.city');
  }
  get billingAddressState() {
    return this.checkoutFormGroup?.get('billingAddress.state');
  }
  get billingAddressCountry() {
    return this.checkoutFormGroup?.get('billingAddress.country');
  }
  get billingAddressZipCode() {
    return this.checkoutFormGroup?.get('billingAddress.zipCode');
  }

  // getters for credit card form
  get creditCardType() {
    return this.checkoutFormGroup?.get('creditCard.cardType');
  }
  get creditCardNameOnCard() {
    return this.checkoutFormGroup?.get('creditCard.nameOnCard');
  }
  get creditCardNumber() {
    return this.checkoutFormGroup?.get('creditCard.cardNumber');
  }
  get creditCardSecurityCode() {
    return this.checkoutFormGroup?.get('creditCard.securityCode');
  }

  copyShippingAddressToBillingAddress(event: any) {
    if (event.target.checked) {
      this.checkoutFormGroup?.controls['billingAddress']
        .setValue(this.checkoutFormGroup?.controls['shippingAddress'].value);
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup?.controls['billingAddress'].reset();
      this.billingAddressStates = [];
    }
  }
  /**
   * Handles the form submission for the checkout process.
   * If the form is valid, it sets up the order, creates the purchase object,
   * calls the REST API to create a payment intent, confirms the card payment,
   * and places the order.
   * If there are any errors during the process, it displays an alert message.
   */
  onSubmit() {
    if (this.checkoutFormGroup?.invalid) {
      this.checkoutFormGroup?.markAllAsTouched();
      return;
    }
    //set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;
    //get cart items
    const cartItems = this.cartService.cartItems;
    //create orderItems from cartItems
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));
    //set up purchase
    let purchase = new Purchase();
    //populate purchase - customer
    purchase.customer = this.checkoutFormGroup?.controls['customer'].value;
    //populate purchase - shipping address  
    purchase.shippingAddress = this.checkoutFormGroup?.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress?.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress?.country));
    purchase.shippingAddress.state = shippingState.name!;
    purchase.shippingAddress.country = shippingCountry.name!;
    //populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup?.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress?.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress?.country));
    purchase.billingAddress.state = billingState.name!;
    purchase.billingAddress.country = billingCountry.name!;
    //populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;
    //call REST API via the CheckoutService
    this.paymentInfo.amount = Math.round(this.totalPrice*100);
    this.paymentInfo.currency = "USD";
    this.paymentInfo.receiptEmail = purchase.customer.email;
    console.log(`paymentInfo:  + ${this.paymentInfo.amount}`);
    //if valid form then call stripe to get token
    if (!this.checkoutFormGroup?.invalid && this.displayError.textContent === '') {
      this.isDisabled = true;
      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse: any) => {
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret, {
            payment_method: {
              card: this.cardElement,
              billing_details: {
                email: purchase.customer.email,
                name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                address:{
                  line1: purchase.billingAddress.street,
                  city: purchase.billingAddress.city,
                  state: purchase.billingAddress.state,
                  postal_code: purchase.billingAddress.zipCode,
                  country: this.billingAddressCountry?.value.code 
                }
              }
            }
          }, { handleActions: false })
            .then((result: any) => {
              if (result.error) {
                alert('There was an error: ${result.error.message}');
                this.isDisabled = false;
              } else {
                this.checkoutService.placeOrder(purchase).subscribe({
                  next: (response: any) => {
                    alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);
                    this.resetCart();
                    this.isDisabled = false;
                  },
                  error: (err: any) => {
                    alert(`There was an error: ${err.message}`);
                    this.isDisabled = false;
                  },
                });
              }
            });
        }
      );
    } else {
      this.checkoutFormGroup?.markAllAsTouched;
      return;
    }
  }
  resetCart() {
    //reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItems();
    //reset the form
    this.checkoutFormGroup?.reset();
    //navigate back to the products page
    this.router.navigateByUrl("/products");

  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup?.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);
    let startMonth: number;
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }
    this.dropFormservice.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }
  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup?.get(formGroupName);
    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;
    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);
    this.dropFormservice.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }
        formGroup?.get('state')?.setValue(data[0]);
      }
    );
  }
}
