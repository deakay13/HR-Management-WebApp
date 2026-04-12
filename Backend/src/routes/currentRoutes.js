import express from "express";
import { currentAccount } from "../controllers/users/currentAccount.js";

const router = express.Router();

router.get("/currentA", currentAccount);

export default router;