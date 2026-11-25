import { Router } from "express";
import {
  showAll,
  showSearch,
  searchByTitle,
  searchByCategory,
} from "../controllers/feedController.js";

const router = Router();

router.get("/", showAll);
router.get("/search", showSearch);
router.post("/search/title", searchByTitle);
router.post("/search/category", searchByCategory);

export default router;
