import express from "express";
import {
    createAccount,
    deleteAccount,
    readAllAccount,
    readAccountById,
    updateAccountById,
} from "../controllers/Users/accountControllers.js";
import { authorize } from '../middlewares/middlewareAuthorize.js';
const router = express.Router();

router.post("/Accounts",authorize(["Tạo"]), createAccount);
router.get("/Accounts",authorize(["Đọc"]), readAllAccount);
router.get("/Accounts/:ID",authorize(["Đọc"]),  readAccountById);
router.put("/Accounts/:ID",authorize(["Sửa"]),  updateAccountById)
router.delete("/Accounts/:ID",authorize(["Xoá"]),  deleteAccount);


export default router;