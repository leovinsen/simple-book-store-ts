import 'mocha';
import chai from 'chai';
import { Teardown, createTestDB } from '../database';
import { Database } from "better-sqlite3"
import { v4 as uuidv4 } from 'uuid';
import OrderRepository, { CreateOrder, CreateOrderDetail } from './orderRepository';
import UserRepository from './userRepository';
import { faker } from '@faker-js/faker';
import { Order } from '../model/order';
import { seedTableBooks } from '../test/seedBooks';
import BookRepository from './bookRepository';
import Book from '../model/book';

let assert = chai.assert;

describe('OrderRepository', () => {
    let db: Database;
    let teardown: Teardown;

    let orderRepository: OrderRepository;
    let bookRepository: BookRepository;
    let userRepository: UserRepository;

    before(async () => {
        const database = await createTestDB(uuidv4());
        db = database.db;
        teardown = database.teardown;

        seedTableBooks(db);

        orderRepository = new OrderRepository(db);
        bookRepository = new BookRepository(db);
        userRepository = new UserRepository(db);
    });

    after(() => {
        teardown();
    });

    describe('findOrders', () => {
        it('should find all records for a given user', async () => {
            const testUser = await userRepository.createUser(faker.internet.email(), "password");
            if (testUser == null) {
                throw new Error("Create test user failed");
            }

            const books = await bookRepository.getBooks();

            const testOrder1 = await orderRepository.createOrder(getTestCreateOrder(testUser.id, books));
            const testOrder2 = await orderRepository.createOrder(getTestCreateOrder(testUser.id, books));

            const findOrders = await orderRepository.findOrders({ userId: testUser.id })
            if (findOrders == null) {
                throw Error("Expected result of findOrders to be non null");
            }

            assert.equal(findOrders!.length, 2);

            const testFn = (foundOrder: Order, testOrder: Order) => {
                assert.equal(foundOrder.id, testOrder.id);
                assert.equal(foundOrder.grandTotal, testOrder.grandTotal);
                assert.equal(foundOrder.userId, testUser.id);
                assert.equal(foundOrder.userId, testOrder.userId);

                for (let i = 0; i < foundOrder.details.length; i++) {
                    const d1 = foundOrder.details[i];
                    const d2 = testOrder.details[i];

                    assert.equal(d1.bookId, d2.bookId);
                    assert.equal(d1.sellingPrice, d2.sellingPrice);
                    assert.equal(d1.qty, d2.qty);
                    assert.equal(d1.subtotal, d2.subtotal);
                }
            }

            testFn(findOrders[0], testOrder1);
            testFn(findOrders[1], testOrder2);

        });
    });

    describe('createOrder', () => {
        it('should insert a new record into table orders successfully', async () => {
            const testUser = await userRepository.createUser(faker.internet.email(), "password");
            if (testUser == null) {
                throw new Error("Create test user failed");
            }

            const books = await bookRepository.getBooks();

            const testData = getTestCreateOrder(testUser.id, books);
            const createdOrder = await orderRepository.createOrder(testData);

            assert.equal(createdOrder.grandTotal, testData.grandTotal);
            assert.equal(createdOrder.userId, testData.userId);

            for (let i = 0; i < createdOrder.details.length; i++) {
                const coDetails = createdOrder.details[i];
                const tdDetails = testData.details[i];

                assert.equal(coDetails.bookId, tdDetails.bookId);
                assert.equal(coDetails.sellingPrice, tdDetails.sellingPrice);
                assert.equal(coDetails.qty, tdDetails.qty);
                assert.equal(coDetails.subtotal, tdDetails.subtotal);
            }
        });
    });

    // Helper function to get a randomized CreateOrder for testing purposes
    const getTestCreateOrder = (userId: number, books: Book[]): CreateOrder => {
        let details: CreateOrderDetail[] = [];
        let grandTotal = 0;

        for (const book of books) {
            const qty = Math.floor(Math.random() * 5) + 1;
            const sellingPrice = book.price;
            const subtotal = qty * book.price;

            details.push({
                bookId: book.id,
                sellingPrice: sellingPrice,
                qty: qty,
                subtotal: subtotal,
            });
            grandTotal += subtotal;
        }

        return {
            userId: userId,
            grandTotal: grandTotal,
            details: details,
        }
    }
});
