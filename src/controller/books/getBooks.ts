import { Request, Response, NextFunction } from 'express';
import Container from 'typedi';
import { BookService } from '../../service/bookService';

export const getBooks = async (req: Request, res: Response, next: NextFunction) => {
    const bookService = Container.get(BookService);
    try {
        const books = await bookService.getBooks();

        return res.status(200).json({
            "data": books,
        })
    } catch (e) {
        return next(e);
    }
}
