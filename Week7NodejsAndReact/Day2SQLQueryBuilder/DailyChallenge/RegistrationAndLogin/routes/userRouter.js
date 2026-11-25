import { Router } from "express";
import { register, login, listUsers, showUser, editUser } from "../controllers/userController.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", listUsers);
router.get("/users/:id", showUser);
router.put("/users/:id", editUser);

export default router;
