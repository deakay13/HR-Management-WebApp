import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from "cors";
import './jobs/sessionCleanup.js';

//import router
import accountRoutes from './routes/accountRoutes.js';
import authRoutes from './routes/authRoutes.js';
import permissionRoutes from './routes/permissionsRoutes.js';
import payRollRoutes from './routes/payrollRoutes.js';
import informationRoutes from './routes/infomationRoutes.js';

//import middlewares
import { protectedRoute } from './middlewares/middlewareVerifyJWT.js';

//config
dotenv.config();
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;
//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: process.env.CLIENT_URL, credentials:true}))

//puclic Route
app.use('/api/auth', authRoutes);

//private Route
app.use(protectedRoute);
app.use('/api/account', accountRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/payroll', payRollRoutes);
app.use('/api/information', informationRoutes);



app.listen(PORT, () => { console.log(`🚀 Server chạy ở cổng ${PORT}`);});