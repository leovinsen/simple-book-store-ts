
import { faker } from "@faker-js/faker";
import 'mocha';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon, { SinonStubbedInstance } from "sinon";
import User from "../model/user";
import Book from "../model/book";
import { SortDirection } from "../model/sortDirection";
import UserRepository from "../repository/userRepository";
import { BookQty, BooksNotFoundError, OrderService, UserNotFoundError } from "./orderService";
import OrderRepository, { CreateOrder } from "../repository/orderRepository";
import BookRepository from "../repository/bookRepository";
import { Order, OrderDetail } from "../model/order";

let expect = chai.expect;
chai.use(sinonChai);

describe('OrderService', () => {
    let orderService: OrderService;
    let userRepository: SinonStubbedInstance<UserRepository>;
    let bookRepository: SinonStubbedInstance<BookRepository>;
    let orderRepository: SinonStubbedInstance<OrderRepository>;

    const fakeUser = new User(
        0,
        faker.internet.email(),
        "password",
        new Date(),
    );
    const fakeBook1 = new Book(
        0,
        "lorem ipsum",
        "lorem ipsum dolor",
        "John Doe",
        10,
        new Date(),
    )
    const fakeBook2 = new Book(
        1,
        "lorem ipsum",
        "lorem ipsum dolor",
        "John Doe",
        10,
        new Date(),
    )
    const fakeOrder1 = new Order(
        0,
        0,
        10,
        new Date(),
        [
            new OrderDetail(fakeBook1.id, fakeBook1.price, 1, fakeBook1.price)
        ],
    );
    const fakeOrder2 = new Order(
        1,
        0,
        100,
        new Date(),
        [
            new OrderDetail(fakeBook1.id, fakeBook1.price, 10, fakeBook1.price * 10)
        ],
    );
    const fakeOrders = [fakeOrder1, fakeOrder2];

    beforeEach(() => {
        userRepository = sinon.createStubInstance(UserRepository);
        orderRepository = sinon.createStubInstance(OrderRepository);
        bookRepository = sinon.createStubInstance(BookRepository);
        orderService = new OrderService(orderRepository, bookRepository, userRepository);
    })

    describe('getOrderHistory', () => {
        it('should return a list of orders that belong to a given user sorted b from most recent', async () => {
            userRepository.findUserByID.returns(new Promise((resolve, reject) => {
                resolve(fakeUser);
            }));
            orderRepository.findOrders.returns(new Promise((resolve, reject) => {
                resolve(fakeOrders)
            }));

            const orders = await orderService.getOrderHistory(fakeUser.id);

            expect(userRepository.findUserByID).calledWith(fakeUser.id);
            expect(orderRepository.findOrders).calledWith({ userId: fakeUser.id }, { createdAt: SortDirection.descending })
            expect(orders.length).equal(fakeOrders.length);
        })

        it('should throw UserNotFoundError if no user with given user ID is found', async () => {
            userRepository.findUserByID.returns(new Promise((resolve, reject) => {
                resolve(null);
            }));

            let error: unknown | null = null;
            try {
                await orderService.getOrderHistory(fakeUser.id);
            } catch (e) {
                error = e;
            }

            expect(error).not.null;
            expect(error).instanceOf(UserNotFoundError);
        })
    })

    describe('createOrder', () => {
        const fakeBookQtys: BookQty[] = [
            {
                id: fakeBook1.id,
                qty: 1,
            }
        ]

        it('should create a new order for given user', async () => {
            userRepository.findUserByID.returns(new Promise((resolve, reject) => {
                resolve(fakeUser);
            }));
            bookRepository.getBooks.returns(new Promise((resolve, reject) => {
                resolve([fakeBook1]);
            }));
            orderRepository.createOrder.returns(new Promise((resolve, reject) => {
                resolve(fakeOrder1)
            }));

            const order = await orderService.createOrder(fakeUser.id, fakeBookQtys);
            expect(userRepository.findUserByID).calledWith(fakeUser.id);

            // verify that a filter of bookIDs is provided to BookRepository.getBooks
            expect(bookRepository.getBooks).calledWith([fakeBook1.id]);

            // should map fields to CreateOrder type and provide it to OrderRepository.createOrder
            const createOrder: CreateOrder = {
                userId: fakeUser.id,
                grandTotal: fakeBookQtys[0].qty * fakeBook1.price,
                details: [
                    {
                        bookId: fakeBook1.id,
                        sellingPrice: fakeBook1.price,
                        qty: fakeBookQtys[0].qty,
                        subtotal: fakeBookQtys[0].qty * fakeBook1.price,
                    }
                ]
            }
            expect(orderRepository.createOrder).calledWith(createOrder);

            // should return whatever returned by orderRepository.createOrder
            expect(order).equal(fakeOrder1);
        });

        it('should throw UserNotFoundError if no user with given user ID is found', async () => {
            userRepository.findUserByID.returns(new Promise((resolve, reject) => {
                resolve(null);
            }));

            let error: unknown | null = null;
            try {
                await orderService.createOrder(fakeUser.id, fakeBookQtys);
            } catch (e) {
                error = e;
            }

            expect(error).not.null;
            expect(error).instanceOf(UserNotFoundError);
        })

        it('should throw BooksNotFoundError if no books with given book IDs are found', async () => {
            userRepository.findUserByID.returns(new Promise((resolve, reject) => {
                resolve(fakeUser);
            }));
            bookRepository.getBooks.returns(new Promise((resolve, reject) => {
                // returns an empty array
                resolve([]);
            }));

            let error: unknown | null = null;
            try {
                await orderService.createOrder(fakeUser.id, fakeBookQtys);
            } catch (e) {
                error = e;
            }

            expect(error).not.null;
            expect(error).instanceOf(BooksNotFoundError);
        })

        it('should throw BooksNotFoundError if some books are found but the rest is missing', async () => {
            const fakeBookQtys: BookQty[] = [
                {
                    id: fakeBook1.id,
                    qty: 1,
                },
                {
                    id: fakeBook2.id,
                    qty: 2,
                },
            ]
            userRepository.findUserByID.returns(new Promise((resolve, reject) => {
                resolve(fakeUser);
            }));
            bookRepository.getBooks.returns(new Promise((resolve, reject) => {
                // returns only one book out of two requested book``
                resolve([fakeBook1]);
            }));

            let error: unknown | null = null;
            try {
                await orderService.createOrder(fakeUser.id, fakeBookQtys);
            } catch (e) {
                error = e;
            }

            expect(error).not.null;
            expect(error).instanceOf(BooksNotFoundError);
        })
    })

});
