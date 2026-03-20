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
router.get("/basesalary/:ID", getBaseSalaryById);
router.put("/basesalary/:ID", updateBaseSalary);
router.delete("/basesalary/:ID", deleteBaseSalary);
// Deduction routes
router.post("/deductions", createDeduction);
router.get("/deductions", getDeductions);
router.get("/deductions/:ID", getDeductionById);
router.put("/deductions/:ID", updateDeduction);
router.delete("/deductions/:ID", deleteDeduction);
// Allowance routes will be added here in the future
router.post("/allowances", createAllowance);
router.get("/allowances", getAllowances);
router.get("/allowances/:ID", getAllowanceById);
router.put("/allowances/:ID", updateAllowance);
router.delete("/allowances/:ID", deleteAllowance);
// Hour routes 
router.post("/hours", createHour);
router.get("/hours", getHours);
router.get("/hours/:ID", getHourById);
router.put("/hours/:ID", updateHour);
router.delete("/hours/:ID", deleteHour);
// Payroll calculation routes
router.post("/payrolls", calculatePayroll);
router.get("/payrolls", getPayrolls);
router.get("/payrolls/:ID", getPayrollById);
router.delete("/payrolls/:ID", deletePayroll);
router.get("/payrolls/month/:month", getPayrollByMonth);
router.get("/payrolls/employee/:ID", getPayrollByEmployee);

export default router;