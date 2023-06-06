export class Order {
    readonly id: number;
    readonly userId: number;
    readonly grandTotal: number;
    readonly createdAt: Date;
    readonly details: OrderDetail[];

    constructor(
        id: number,
        userId: number,
        grandTotal: number,
        createdAt: Date,
        details: OrderDetail[],
    ) {
        this.id = id;
        this.userId = userId;
        this.grandTotal = grandTotal;
        this.createdAt = createdAt;
        this.details = details;
    }
}

export class OrderDetail {
    readonly bookId: number;
    readonly sellingPrice: number;
    readonly qty: number;
    readonly subtotal: number;

    constructor(
        bookId: number,
        sellingPrice: number,
        qty: number,
        subtotal: number,
    ) {
        this.bookId = bookId;
        this.sellingPrice = sellingPrice;
        this.qty = qty;
        this.subtotal = subtotal;
    }
}
