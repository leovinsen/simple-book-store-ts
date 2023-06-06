import { Request, Response, NextFunction } from 'express';
import Container from 'typedi';
import { OrderService } from '../../service/orderService';

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
    const orderService = Container.get(OrderService);
    try {
        const books = await orderService.getOrderHistory(req.jwtPayload.sub);

        return res.status(200).json({
            "data": books,
        })
    } catch (e) {
        return next(e);
    }
}
