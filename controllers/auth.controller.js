const User = require("../models/User.model");
const bcrypt = require("bcrypt");

require('dotenv').config(); // Tải các biến môi trường từ tệp .env
const jwt = require("jsonwebtoken"); // Dùng JWT để tạo token xác thực

// Đăng nhập người dùng
exports.user_login = function (req, res, next) {
  const { userName, passWord } = req.body; // Lấy userName và passWord từ body của request

  // Kiểm tra xem người dùng có tồn tại trong cơ sở dữ liệu không
  User.findOne({ userName: userName }, function (err, user) {
    if (err) {
      console.clear();
      return next(err);
    }

    // Nếu không tìm thấy người dùng
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Kiểm tra mật khẩu người dùng có đúng không
    bcrypt.compare(passWord, user.passWord, function (err, isMatch) {
      if (err) {
        console.clear();
        return next(err);
      }

      // Nếu mật khẩu không đúng
      if (!isMatch) {
        return res.status(400).json({
          message: "Incorrect password",
        });
      }

      // Tạo JWT token nếu mật khẩu đúng
      const access_token = jwt.sign(
        { userId: user._id, userName: user.userName }, // Payload chứa thông tin cần thiết
        process.env.JWT_SECRET, // Secret key (nên lưu trong môi trường, không hardcode trong mã nguồn)
        { expiresIn: process.env.REFRESH_TIME } // Token hết hạn sau 
      );

      // Trả về token cùng với thông tin người dùng
      res.status(200).json({
        access_token: access_token, // Trả về token cho người dùng
      });
    });
  });
};
