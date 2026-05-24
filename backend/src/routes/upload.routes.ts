import { Router } from "express";
import { UploadController } from "../controllers/upload.controller";
import multer from "multer";
import os from "os";

const router = Router();
const upload = multer({ dest: os.tmpdir() });

router.post("/", upload.single("file"), UploadController.uploadFile);

export default router;