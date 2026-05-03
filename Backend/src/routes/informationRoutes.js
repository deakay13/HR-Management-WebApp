import express from "express";
import { authorize } from "../middlewares/authorize.js";
import cacheMiddleware from "../middlewares/cacheMiddleware.js";
import {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  searchDepartments,
  exportDepartmentsToExcel,
} from "../controllers/information/departmentsControllers.js";
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  searchEmployees,
  exportEmployeesToExcel,
} from "../controllers/information/employeeControllers.js";
import {
  getAllContracts,
  getContractById,
  createContract,
  updateContract,
  deleteContract,
  searchContracts,
  exportContractsToExcel,
} from "../controllers/information/contractControllers.js";
import upload from "../config/multerConfig.js";

const router = express.Router();

/* Routes for PhongBan */
router.get("/departments/search", authorize(["Đọc"]), searchDepartments);
router.get("/departments/export", authorize(["Đọc"]), exportDepartmentsToExcel);
router.get("/departments", authorize(["Đọc"]), cacheMiddleware(3600), getAllDepartments);
router.get("/departments/:id", authorize(["Đọc"]), getDepartmentById);
router.post("/departments", authorize(["Tạo"]), createDepartment);
router.put("/departments/:id", authorize(["Sửa"]), updateDepartment);
router.delete("/departments/:id", authorize(["Xoá"]), deleteDepartment);

/* Routes for NhanVien */
router.get("/employees/search", authorize(["Đọc"]), searchEmployees);
router.get("/employees/export", authorize(["Đọc"]), exportEmployeesToExcel);
router.get("/employees", authorize(["Đọc"]), cacheMiddleware(3600), getAllEmployees);
router.get("/employees/:id", authorize(["Đọc"]), getEmployeeById);
router.post(
  "/employees",
  authorize(["Tạo"]),
  upload.single("HinhAnh"),
  createEmployee,
);
router.put(
  "/employees/:id",
  authorize(["Sửa"]),
  upload.single("HinhAnh"),
  updateEmployee,
);
router.delete("/employees/:id", authorize(["Xoá"]), deleteEmployee);

/* Routes for HopDong */
router.get("/contracts/search", authorize(["Đọc"]), searchContracts);
router.get("/contracts/export", authorize(["Đọc"]), exportContractsToExcel);
router.get("/contracts", authorize(["Đọc"]), cacheMiddleware(3600), getAllContracts);

router.get("/contracts/:id", authorize(["Đọc"]), getContractById);
router.post(
  "/contracts",
  authorize(["Tạo"]),
  upload.single("HinhAnhHopDong"),
  createContract,
);
router.put(
  "/contracts/:id",
  authorize(["Sửa"]),
  upload.single("HinhAnhHopDong"),
  updateContract,
);
router.delete("/contracts/:id", authorize(["Xoá"]), deleteContract);

export default router;
