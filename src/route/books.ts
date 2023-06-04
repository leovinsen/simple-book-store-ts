import { Router } from "express";
import { getBooks } from "../controller/books/getBooks";

const router = Router();

router.get('/', getBooks);

export default router;
