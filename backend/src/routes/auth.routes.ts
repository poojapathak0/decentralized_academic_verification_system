import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router();

router.post("/connect", AuthController.connectWallet);

export default router;