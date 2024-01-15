//entity with some properties
export class OrderHistory {
    constructor(public id:string,
                public orderTrackingNumber:string,
                public totalPrice:number,
                public totalQuantity:number,
                public dateCreated:Date){
                    this.id = id;
                    this.orderTrackingNumber = orderTrackingNumber;
                    this.totalPrice = totalPrice;
                    this.totalQuantity = totalQuantity;
                    this.dateCreated = dateCreated;
                }
}
