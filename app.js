const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config(); // Load biến môi trường từ file .env

const app = express();

// --- KẾT NỐI DATABASE ---
// Sử dụng MONGO_URI từ .env hoặc dùng mặc định nếu chưa có file .env
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/';

mongoose.connect(mongoURI)
  .then(() => console.log("✅ Đã kết nối Database thành công!"))
  .catch(err => console.error("❌ Lỗi kết nối Database:", err));

// --- CẤU HÌNH VIEW ENGINE ---
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// --- MIDDLEWARE ---
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// --- ĐĂNG KÝ ROUTES ---
app.use('/', require('./routes/index'));
// Đây là route quan trọng cho bài làm của bạn
app.use('/api/v1/users', require('./routes/users')); 

// --- XỬ LÝ LỖI ---
// Catch 404
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    status: "Error",
    message: err.message
  });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang thực sự chạy tại: http://localhost:${PORT}`);
});

module.exports = app;