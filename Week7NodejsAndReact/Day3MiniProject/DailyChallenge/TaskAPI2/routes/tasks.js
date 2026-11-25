import { Router } from "express";
import validateTask from "../middleware/validateTask.js";
import * as tasks from "../controllers/tasksController.js";

const router = Router();

router.get("/", tasks.listTasks); // ?completed=false&priority=high&sort=dueDate&page=1&limit=10
router.get("/stats", tasks.getStats); // must come before /:id
router.get("/:id", tasks.getTask);
router.post("/", validateTask(), tasks.createTask);
router.put("/:id", validateTask(true), tasks.updateTask);
router.patch("/:id/toggle", tasks.toggleTask);
router.delete("/:id", tasks.deleteTask);

export default router;
