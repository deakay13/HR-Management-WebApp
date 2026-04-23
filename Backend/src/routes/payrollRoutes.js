import express from "express";
import { authorize } from "../middlewares/authorize.js";
import {
  createBaseSalary,
  getBaseSalaries,
  getBaseSalaryById,
  updateBaseSalary,
  deleteBaseSalary,
} from "../controllers/payroll/baseSalaryController.js";
import {
  createDeduction,
  getDeductions,
  getDeductionById,
  updateDeduction,
  deleteDeduction,
} from "../controllers/payroll/deductionController.js";
import {
  createAllowance,
  getAllowances,
  getAllowanceById,
  updateAllowance,
  deleteAllowance,
} from "../controllers/payroll/allowanceController.js";
import {
  createHour,
  getHours,
  getHourById,
  updateHour,
  deleteHour,
} from "../controllers/payroll/hoursController.js";
import {
  calculatePayroll,
  getPayrolls,
  getPayrollById,
  getPayrollByMonth,
  getPayrollByEmployee,
  deletePayroll,
  updatePayroll,
  exportPayrollToExcel,
  searchPayroll,
} from "../controllers/payroll/payRollController.js";
const router = express.Router();

/* Base Salary routes */
router.post("/basesalary", authorize(["Tạo"]), createBaseSalary);
router.get("/basesalary", authorize(["Đọc"]), getBaseSalaries);
router.get("/basesalary/:ID", authorize(["Đọc"]), getBaseSalaryById);
router.put("/basesalary/:ID", authorize(["Sửa"]), updateBaseSalary);
router.delete("/basesalary/:ID", authorize(["Xoá"]), deleteBaseSalary);
/* Deduction routes */
router.post("/deductions", authorize(["Tạo"]), createDeduction);
router.get("/deductions", authorize(["Đọc"]), getDeductions);
router.get("/deductions/:ID", authorize(["Đọc"]), getDeductionById);
router.put("/deductions/:ID", authorize(["Sửa"]), updateDeduction);
router.delete("/deductions/:ID", authorize(["Xoá"]), deleteDeduction);
/* Allowance routes will be added here */
router.post("/allowances", authorize(["Tạo"]), createAllowance);
router.get("/allowances", authorize(["Đọc"]), getAllowances);
router.get("/allowances/:ID", authorize(["Đọc"]), getAllowanceById);
router.put("/allowances/:ID", authorize(["Sửa"]), updateAllowance);
router.delete("/allowances/:ID", authorize(["Xoá"]), deleteAllowance);
/* Hour routes */
router.post("/hours", authorize(["Tạo"]), createHour);
router.get("/hours", authorize(["Đọc"]), getHours);
router.get("/hours/:ID", authorize(["Đọc"]), getHourById);
router.put("/hours/:ID", authorize(["Sửa"]), updateHour);
router.delete("/hours/:ID", authorize(["Xoá"]), deleteHour);
/* Payroll calculation routes */
router.post("/payrolls", authorize(["Tạo"]), calculatePayroll);
router.get("/payrolls", authorize(["Đọc"]), getPayrolls);
/* Specific string routes MUST come before param routes */
router.get("/payrolls/search", authorize(["Đọc"]), searchPayroll);
router.get("/payrolls/export", authorize(["Đọc"]), exportPayrollToExcel);
router.get("/payrolls/month/:month", authorize(["Đọc"]), getPayrollByMonth);
router.get("/payrolls/employee/:ID", authorize(["Đọc"]), getPayrollByEmployee);
/* Param route last */
router.get("/payrolls/:ID", authorize(["Đọc"]), getPayrollById);
router.put("/payrolls/:ID", authorize(["Sửa"]), updatePayroll);
router.delete("/payrolls/:ID", authorize(["Xoá"]), deletePayroll);

export default router;
