import express from "express";
import { CreateAccount } from "../controllers/Users/accountControllers.js";

const router = express.Router();

router.post("/Create", CreateAccount);

export default router;