import { Router } from "express";
import { userController } from "./user.controller";
import Admin from "../../middleware/Admin";
import { Roles } from "../../config/rote";

const router = Router();

router.get("/", Admin(Roles.admin), userController.alluser);
router.put("/:id", Admin(Roles.admin), userController.OneUpdate);
router.delete("/:id", Admin(Roles.admin), userController.DeleteUser);

export const userRouter = router;
