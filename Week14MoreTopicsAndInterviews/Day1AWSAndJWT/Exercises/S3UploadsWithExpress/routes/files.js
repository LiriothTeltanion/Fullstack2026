import { Router } from "express";
import { deleteFile, getFileUrl, listFiles, uploadFile } from "../controllers/filesController.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.get("/", listFiles);
router.get("/url", getFileUrl);
router.post("/", upload.single("file"), uploadFile);
router.delete("/", deleteFile);

export default router;
