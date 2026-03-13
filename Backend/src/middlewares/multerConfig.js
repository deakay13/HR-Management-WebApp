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
    const id = req.body.MaNV || req.body.MaHopDong || 'unknown';

    const now = new Date();
    const dateStr = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;

    const ext = path.extname(file.originalname).toLowerCase();

    cb(null, `${id}-${dateStr}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'HinhAnh') {
    if (['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Avatar phải là định dạng ảnh (jpg, png, jpeg)!'), false);
    }
  } else if (file.fieldname === 'HinhAnhHopDong') {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Hợp đồng bắt buộc phải là file định dạng PDF!'), false);
    }
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } 
});

export default upload;