import express from "express";
import { currentAccount } from "../controllers/Users/CurrentAccount";

const router = express.Router();

router.get("/currentA", currentAccount);

export default router;