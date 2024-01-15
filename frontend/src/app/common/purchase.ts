import { Address } from "./address";
import { Customer } from "./customer";
import { Order } from "./order";
import { OrderItem } from "./order-item";
//entity with some properties
export class Purchase {
    customer!: Customer ;
    shippingAddress!: Address ;
    billingAddress!: Address ;
    order!: Order;
    orderItems!: OrderItem[];
}
