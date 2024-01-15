import { Product } from "./product";
//entity with some properties
export class CartItem {
    id:string;
    name:string;
    imageUrl:string;
    unitPrice:number;
    quantity:number;
    constructor(product: Product){
        this.id = product.id;
        this.name = product.name;
        this.imageUrl = product.imageUrl;
        this.unitPrice = product.unitPrice;
        this.quantity = 1;
    }
}
