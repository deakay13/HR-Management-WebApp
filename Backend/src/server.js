import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import accountRoutes from './routes/accountRoutes.js';
import authRoute from './routes/authRoute.js';
import {protectedRoute} from './middlewares/middlewareJson.js';
dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
//middlewares
app.use(express.json());
app.use(cookieParser());

//puclic Route
app.use('/api/auth', authRoute);
//private Route
app.use(protectedRoute);
app.use('/api/account', accountRoutes);
app.listen(PORT, () => { console.log(`🚀 Server chạy ở cổng ${PORT}`);});