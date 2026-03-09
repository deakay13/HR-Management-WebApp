import express from "express";

import {createBaseSalary, getBaseSalaries, getBaseSalaryById, updateBaseSalary, deleteBaseSalary } from "../controllers/Payroll/baseSalaryController.js";
import {createDeduction, getDeductions, getDeductionById, updateDeduction, deleteDeduction } from "../controllers/Payroll/deductionController.js";
import { createAllowance, getAllowances, getAllowanceById, updateAllowance, deleteAllowance } from "../controllers/Payroll/allowanceController.js";
import { createHour, getHours, getHourById, updateHour, deleteHour } from "../controllers/Payroll/hoursController.js";
import { calculatePayroll, getPayrolls, getPayrollById,getPayrollByMonth,getPayrollByEmployee, deletePayroll } from "../controllers/Payroll/payRollController.js";
const router = express.Router();
// Base Salary routes
router.post("/basesalary", createBaseSalary);
router.get("/basesalary", getBaseSalaries);
router.get("/basesalary/:MaLCB", getBaseSalaryById);
router.put("/basesalary/:MaLCB", updateBaseSalary);
router.delete("/basesalary/:MaLCB", deleteBaseSalary);
// Deduction routes
router.post("/deductions", createDeduction);
router.get("/deductions", getDeductions);
router.get("/deductions/:MaKT", getDeductionById);
router.put("/deductions/:MaKT", updateDeduction);
router.delete("/deductions/:MaKT", deleteDeduction);
// Allowance routes will be added here in the future
router.post("/allowances", createAllowance);
router.get("/allowances", getAllowances);
router.get("/allowances/:MaPC", getAllowanceById);
router.put("/allowances/:MaPC", updateAllowance);
router.delete("/allowances/:MaPC", deleteAllowance);
// Hour routes
router.post("/hours", createHour);
router.get("/hours", getHours);
router.get("/hours/:MaGL", getHourById);
router.put("/hours/:MaGL", updateHour);
router.delete("/hours/:MaGL", deleteHour);
// Payroll calculation routes
router.post("/payrolls", calculatePayroll);
router.get("/payrolls", getPayrolls);
router.get("/payrolls/:MaBL", getPayrollById);
router.delete("/payrolls/:MaBL", deletePayroll);
router.get("/payrolls/month/:month", getPayrollByMonth);
router.get("/payrolls/employee/:MaNV", getPayrollByEmployee);

export default router;