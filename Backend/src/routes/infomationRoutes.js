import express from 'express';
import { getAllDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment  } from '../controllers/Information/departmentsControllers.js';
import { getAllEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee } from '../controllers/Information/employeeControllers.js';
import { getAllContracts, getContractById, createContract, updateContract, deleteContract } from '../controllers/Information/contractControllers.js';
import upload from '../middlewares/multerConfig.js';

const router = express.Router();

// Routes for Phongban
router.get('/departments', getAllDepartments);
router.get('/departments/:id', getDepartmentById);
router.post('/departments', createDepartment);
router.put('/departments/:id', updateDepartment);
router.delete('/departments/:id', deleteDepartment);

// Routes for NhanVien
router.get('/employees', getAllEmployees);
router.get('/employees/:id', getEmployeeById);
router.post('/employees', upload.single('HinhAnh'), createEmployee);      
router.put('/employees/:id', upload.single('HinhAnh'), updateEmployee);  
router.delete('/employees/:id', deleteEmployee);

// Routes for HopDong 
router.get('/contracts', getAllContracts);
router.get('/contracts/:id', getContractById);
router.post('/contracts', upload.single('HinhAnhHopDong'), createContract);
router.put('/contracts/:id', upload.single('HinhAnhHopDong'), updateContract);
router.delete('/contracts/:id', deleteContract);

export default router;