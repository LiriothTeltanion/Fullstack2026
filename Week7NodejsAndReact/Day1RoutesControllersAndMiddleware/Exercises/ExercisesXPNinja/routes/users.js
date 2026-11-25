import { Router } from "express";
import { loadUser, listUsers, getUser } from "../controllers/usersController.js";

const router = Router();

// Exercise 3: runs once for every route that has an :id, before the handler.
router.param("id", loadUser);

router.get("/", listUsers); // Exercise 2: ?city=Haifa&page=1&limit=2
router.get("/:id", getUser);

export default router;
