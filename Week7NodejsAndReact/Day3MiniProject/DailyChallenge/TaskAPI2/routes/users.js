import { Router } from "express";
import { register, login, listUsers, getUser, updateUser } from "../controllers/usersController.js";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/users", listUsers);
router.get("/users/:id", getUser);
router.put("/users/:id", updateUser);
export default router;
