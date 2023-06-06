import { Router } from 'express';
import auth from './auth';
import books from './books';
import orders from './orders';
import { verifyJwt } from '../middleware/verifyJwt';

const router = Router();
router.use('/auth', auth);
router.use('/books', books);
router.use('/orders', verifyJwt, orders);

export default router;
