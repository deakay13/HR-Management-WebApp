import express from 'express';
import dotenv from 'dotenv';
import sequelize from './dbconnect.js';
import User from './models/user.js';

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Sync DB (tạo bảng nếu chưa có)
sequelize.sync()
    .then(() => console.log('✅ Database synced, bảng Users đã tạo nếu chưa có'))
    .catch(err => console.error('❌ Error syncing database:', err));

// API test: lấy tất cả users
app.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// API test: tạo user mới
app.post('/users', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const user = await User.create({ username, password, email });
        res.json(user);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(PORT, () => console.log(`🚀 Server chạy ở cổng ${PORT}`));