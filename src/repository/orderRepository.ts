import { Database } from "better-sqlite3";
import { Order, OrderDetail } from "../model/order";
import { Inject, Service } from "typedi";
import { SortDirection, sortDirectionToSql } from "../model/sortDirection";
import diConfig from "../config/di";

// Defines possible filters for findOrder
type FindOrderFilter = {
    id?: number | bigint;
    userId?: number | bigint;
}

type FindOrderSortOptions = {
    createdAt?: SortDirection;
}

export class MissingFindOrderFilter extends Error {
    constructor() {
        super("Missing filter for findOrder method");
    }
}

@Service()
export default class OrderRepository {
    private db: Database;

    constructor(
        @Inject(diConfig.database)
        db: Database
    ) {
        this.db = db;
    }

    /**
     * Finds records in table `orders` and `orders_details` that match provided filter. They will
     * be returned as instances of Order.
     * 
     * Returns an empty array if no records were found.
     * 
     * @param filter filters for the result set. Only one filter need to be set, and if both are set, only order.id will e used.
     * @param sortOpts (optional) sorting options for the records. Only sortable by created_at.
     * @returns an array containing orders that match the filter
     */
    public async findOrders(filter: FindOrderFilter, sortOpts?: FindOrderSortOptions): Promise<Order[]> {
        let whereFilter: string = '';
        let args: Array<any> = [];

        if (filter.id) {
            whereFilter = 'WHERE o.id = ?';
            args.push(filter.id);
        } else if (filter.userId) {
            whereFilter = 'WHERE o.user_id = ?';
            args.push(filter.userId);
        }

        if (sortOpts) {
            if (sortOpts.createdAt) {
                const orderBy: string = sortDirectionToSql(sortOpts.createdAt!);
                whereFilter = `${whereFilter} ORDER BY o.created_at ${orderBy}`;
            }
        }

        const query = `
        SELECT 
            o.id,
            o.user_id,
            o.grand_total,
            o.created_at,
            od.book_id,
            od.selling_price,
            od.qty,
            od.subtotal
        FROM 
            orders o
        LEFT JOIN 
            orders_details od 
            ON od.order_id = o.id
        ${whereFilter}
        `

        const rows: unknown[] = this.db.prepare(query).all(args);
        if (rows.length == 0) {
            return [];
        }

        const castRows = rows as [{ [key: string]: any }];
        let orders: Order[] = [];
        let orderDetails: OrderDetail[] = [];
        let lastOrderId: number = castRows[0].id;
        let lastGrandTotal = 0;
        let lastCreatedAt: Date = new Date();

        for (let i = 0; i < castRows.length; i++) {
            const row = castRows[i];

            // once a new order.id is found, push the Order object into orders
            // and clear orderDetails array for new Order object
            if (row.id != lastOrderId) {
                orders.push(new Order(
                    lastOrderId,
                    castRows[0].user_id,
                    lastGrandTotal,
                    lastCreatedAt,
                    orderDetails,
                ));

                // clear array
                orderDetails = [];
                lastGrandTotal = 0;
                lastOrderId = row.id;
            }

            const detail = new OrderDetail(
                row.book_id,
                row.selling_price / 100,
                row.qty,
                row.subtotal / 100,
            );
            lastGrandTotal = row.grand_total;
            lastCreatedAt = new Date(row.created_at);

            orderDetails.push(detail);
        }

        // push last order to the array
        orders.push(new Order(
            lastOrderId,
            castRows[0].user_id,
            lastGrandTotal,
            lastCreatedAt,
            orderDetails,
        ));

        return orders;
    }

    public async createOrder(order: CreateOrder): Promise<Order> {
        const orderId: number | bigint = this.db.transaction(() => {
            const insertOrderQuery = "INSERT INTO orders (user_id, grand_total) VALUES (?, ?)";
            const insertResult = this.db.prepare(insertOrderQuery).run(order.userId, order.grandTotal);

            const insertDetailQuery = "INSERT INTO orders_details (order_id, book_id, selling_price, qty, subtotal) VALUES (?, ?, ?, ?, ?)";
            for (const item of order.details) {
                this.db.prepare(insertDetailQuery).run(
                    insertResult.lastInsertRowid,
                    item.bookId,
                    item.sellingPrice * 100,
                    item.qty,
                    item.subtotal * 100
                );
            }
            return insertResult.lastInsertRowid;
        })();

        const orders = await this.findOrders({ id: orderId });
        // should never happen, but check anyways
        if (!orders) {
            throw new Error("Newly created order is not found.")
        }

        return orders![0];
    }
}

export type CreateOrder = {
    userId: number | bigint;
    grandTotal: number;
    details: CreateOrderDetail[];
}

export type CreateOrderDetail = {
    bookId: number;
    sellingPrice: number;
    qty: number;
    subtotal: number;
}
