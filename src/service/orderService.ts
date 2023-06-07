import { Service } from "typedi";
import { NotFoundError } from "../error/notFoundError";
import OrderRepository, { CreateOrder, CreateOrderDetail } from "../repository/orderRepository";
import BookRepository from "../repository/bookRepository";
import { UserRepository } from "../repository/userRepository";
import Book from "../model/book";
import { SortDirection } from "../model/sortDirection";
import { Order } from "../model/order";

class UserNotFoundError extends NotFoundError {
    constructor() {
        super("User");
    }
}

class BooksNotFoundError extends NotFoundError {
    constructor(bookIds: number[]) {
        super(`Books with id of [${bookIds.join(', ')}]`);
    }
}

@Service()
class OrderService {
    private readonly _orderRepository: OrderRepository;
    private readonly _bookRepository: BookRepository;
    private readonly _userRepository: UserRepository;

    constructor(
        orderRepository: OrderRepository,
        bookRepository: BookRepository,
        userRepository: UserRepository,
    ) {
        this._orderRepository = orderRepository;
        this._bookRepository = bookRepository;
        this._userRepository = userRepository;
    }

    /**
     * Retrieves an Array of Orders that belongs to a given user.
     * 
     * Throws a UserNotFoundError if no user with given ID is found.
     * 
     * @param userId unique identifier of the user
     * @returns Array of Orders, possibly empty if no orders exist for the user.
     */
    public async getOrderHistory(userId: number): Promise<Order[]> {
        const user = await this._userRepository.findUser({ id: userId });
        if (user == null) {
            throw new UserNotFoundError();
        }

        const filter = {
            userId: userId,
        };
        const sortOpts = {
            createdAt: SortDirection.descending,
        };
        return await this._orderRepository.findOrders(filter, sortOpts);
    }

    /**
     * Creates an Order for user identified by userId. 
     * 
     * Possible errors:
     * - UserNotFoundError when no User with id of userId is found
     * - BooksNotFoundError when *any* of the bookId in bookQtys is not found in the database.
     *  
     * @param userId unique identifier of the user
     * @param bookQtys an array of bookID along with purchased quantity.
     * @returns newly created Order object
     */
    public async createOrder(userId: number, bookQtys: BookQty[]): Promise<Order> {
        const user = await this._userRepository.findUser({ id: userId });
        if (user == null) {
            throw new UserNotFoundError();
        }

        // validate that the requested books exist in our db
        const bookIds: number[] = bookQtys.map((book) => book.id);
        const foundBooks: Book[] = await this._bookRepository.getBooks(bookIds);
        if (foundBooks.length == 0) {
            throw new BooksNotFoundError(bookIds)
        }
        if (foundBooks.length != bookIds.length) {
            const foundBookIds = foundBooks.map((el) => el.id);
            const missingIds = getDifference(bookIds, foundBookIds)

            throw new BooksNotFoundError(missingIds);
        }

        // start calculating grand total and subtotal
        let grandTotal = 0;
        let details: CreateOrderDetail[] = [];

        for (const bookQty of bookQtys) {
            const book: Book = foundBooks.filter((b) => b.id == bookQty.id)[0];
            const subtotal = bookQty.qty * book.price;

            grandTotal += subtotal
            details.push({
                bookId: book.id,
                sellingPrice: book.price,
                qty: bookQty.qty,
                subtotal: subtotal,
            })
        }

        const createOrder: CreateOrder = {
            userId: userId,
            grandTotal: grandTotal,
            details: details,
        }

        try {
            return await this._orderRepository.createOrder(createOrder);
        } catch (e) {
            throw Error(`Failed to create an order: ${String(e)}`);
        }
    }
}

type BookQty = {
    id: number;
    qty: number;
}

export { OrderService, BookQty, UserNotFoundError, BooksNotFoundError }

const getDifference = (a: number[], b: number[]) => {
    return a.filter(element => {
        return !b.includes(element);
    });
}
