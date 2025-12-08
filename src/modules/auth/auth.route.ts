import { Router } from "express";
import { authController } from "./auth.controller";
import login from "../../middleware/login";

const router = Router();

router.post("/signup", authController.createUser);
router.post("/signin", login(), authController.loginUser);

export const authRouter = router;
