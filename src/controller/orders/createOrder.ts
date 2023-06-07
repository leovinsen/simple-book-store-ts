import { Request, Response, NextFunction } from 'express';
import Container from 'typedi';
import { BookQty, BooksNotFoundError, OrderService, UserNotFoundError } from '../../service/orderService';
import { CustomError } from '../../error/customError';
import { UnauthorizedError } from '../../error/unauthorizedError';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    const { books } = req.body;

    const bookRequests = books as BookRequest[];

    const bookQtysOrError = validateBookRequests(bookRequests);
    if (bookQtysOrError instanceof Error) {
        return next(bookQtysOrError);
    }

    // let bookQtys: BookQty[] = [];
    // for (const br of bookRequests) {
    //     for (const bq of bookQtys) {
    //         if (bq.id == br.id) {
    //             return next(new CustomError(400, `Found duplicate entry for book with id: ${br.id}`))
    //         }
    //     }
    //     if (br.id === undefined) {
    //         return next(new CustomError(400, `Book id is missing`))
    //     }
    //     if (br.qty === undefined) {
    //         return next(new CustomError(400, `Qty is missing`))
    //     }
    //     if (br.id < 0) {
    //         return next(new CustomError(400, `Found an invalid book id: ${br.id}`))
    //     }
    //     if (br.qty < 0) {
    //         return next(new CustomError(400, `Found an invalid qty: ${br.qty} for book with id of: ${br.id}`))
    //     }

    //     bookQtys.push({
    //         id: br.id,
    //         qty: br.qty,
    //     })
    // }

    const orderService = Container.get(OrderService);
    try {
        const books = await orderService.createOrder(req.jwtPayload.sub, bookQtysOrError);

        return res.status(200).json({
            "data": books,
        })
    } catch (e) {
        let err: any;
        if (e instanceof UserNotFoundError) {
            err = new UnauthorizedError();
        } else if (e instanceof BooksNotFoundError) {
            err = new CustomError(400, e.message)
        } else {
            err = e;
        }

        return next(err);
    }
}

const validateBookRequests = (books: BookRequest[]): BookQty[] | Error => {
    if (books.length == 0) {
        return new CustomError(400, `No books were selected in the order`);
    }

    let bookQtys: BookQty[] = [];
    for (const br of books) {
        for (const bq of bookQtys) {
            if (bq.id == br.id) {
                return new CustomError(400, `Found duplicate entry for book with id: ${br.id}`)
            }
        }
        if (br.id === undefined) {
            return new CustomError(400, `Book id is missing`)
        }
        if (br.qty === undefined) {
            return new CustomError(400, `Qty is missing`)
        }
        if (br.id < 0) {
            return new CustomError(400, `Found an invalid book id: ${br.id}`)
        }
        if (br.qty < 0) {
            return new CustomError(400, `Found an invalid qty: ${br.qty} for book with id of: ${br.id}`)
        }

        bookQtys.push({
            id: br.id,
            qty: br.qty,
        })
    }

    return bookQtys;
}

type BookRequest = {
    id?: number;
    qty?: number;
}
