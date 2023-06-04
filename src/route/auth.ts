import { Router } from "express";
import { login } from "../controller/auth/login";
import { register } from "../controller/auth/register";

const router = Router();

router.post('/login', login);
router.post('/register', register);

export default router;
