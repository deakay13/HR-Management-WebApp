import express from "express";
import {
  createAccount,
  deleteAccount,
  readAllAccount,
  readAccountById,
  updateAccountById,
  exportAccountToExcel,
  searchAccount,
} from "../controllers/users/accountControllers.js";
import { authorize } from "../middlewares/authorize.js";
import cacheMiddleware from "../middlewares/cacheMiddleware.js";
const router = express.Router();

router.post("/Accounts", authorize(["Tạo"]), createAccount);
router.get("/Accounts/export", authorize(["Đọc"]), exportAccountToExcel);
router.get("/Accounts/search", authorize(["Đọc"]), searchAccount);
router.get("/Accounts", authorize(["Đọc"]), cacheMiddleware(300), readAllAccount);
router.get("/Accounts/:ID", authorize(["Đọc"]), readAccountById);
router.put("/Accounts/:ID", authorize(["Sửa"]), updateAccountById);
router.delete("/Accounts/:ID", authorize(["Xoá"]), deleteAccount);

export default router;
