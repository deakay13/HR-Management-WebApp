import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'HinhAnh') {
      cb(null, 'uploads/avatars/');
    } else if (file.fieldname === 'HinhAnhHopDong') {
      cb(null, 'uploads/hopdong/');
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const prefix = file.fieldname === 'HinhAnh' ? 'avatar' : 'hopdong';
    
    // Không dùng req.body nữa để tránh "unknown"
    cb(null, `${prefix}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'HinhAnh') {
    if (['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ được upload ảnh jpg/png cho avatar!'), false);
    }
  } else if (file.fieldname === 'HinhAnhHopDong') {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Chỉ được upload file PDF cho hợp đồng!'), false);
    }
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Giới hạn 5MB
});

export default upload;