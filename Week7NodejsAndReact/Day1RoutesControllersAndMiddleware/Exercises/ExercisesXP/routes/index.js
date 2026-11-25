// Exercise 1: a basic router with two pages.
import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("<h1>Homepage</h1><p>Welcome to my Express routes practice.</p>");
});

router.get("/about", (req, res) => {
  res.send("<h1>About Us</h1><p>A small app built with express.Router().</p>");
});

export default router;
