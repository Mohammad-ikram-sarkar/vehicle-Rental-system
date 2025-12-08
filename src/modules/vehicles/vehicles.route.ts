import { Router } from "express";
import { vahiclesController } from "./vehicles.controller";
import Admin from "../../middleware/Admin";
import { Roles } from "../../config/rote";

const router = Router();

router.post("/", Admin(Roles.admin), vahiclesController.vahiclesPost);
router.get("/", vahiclesController.allvehicles);
router.get("/:id", vahiclesController.onevehicles);
router.put("/:id", Admin(Roles.admin), vahiclesController.updatevehicles);
router.delete("/:id", Admin(Roles.admin), vahiclesController.deletevehicles);

export const vehicles = router;
