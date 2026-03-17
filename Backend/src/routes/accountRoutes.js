import express from "express";
import {
    createAccount,
    deleteAccount,
    readAllAccount,
    readAccountById,
    updateAccountById,
} from "../controllers/Users/accountControllers.js";

const router = express.Router();

router.post("/Accounts", createAccount);
router.get("/Accounts", readAllAccount);
router.get("/Accounts/:ID", readAccountById);
router.put("/Accounts/:ID", updateAccountById)
router.delete("/Accounts/:ID", deleteAccount);


export default router;