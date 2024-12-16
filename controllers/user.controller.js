const User = require("../models/User.model");
const bcrypt = require("bcrypt");

//Simple version, without validation or sanitation
exports.test = function (req, res) {
  res.send("Greetings from the Test controller!");
  console.log("test controller");
};

exports.user_create = function (req, res, next) {
  // Kiểm tra xem userName, phone hoặc name đã tồn tại trong cơ sở dữ liệu chưa
  User.findOne(
    { 
      $or: [
        { userName: req.body.userName }, 
        { phone: req.body.phone }, 
        { name: req.body.name }
      ] 
    },
    function (err, existingUser) {
      if (err) {
        return next(err);
      }
      // Nếu đã tồn tại userName, phone, hoặc name
      if (existingUser) {
        return res.status(400).json({
          message: "User with this username, phone, or name already exists.",
        });
      }
      // Tạo id tự động là số thứ tự (có thể thay đổi logic này tùy theo yêu cầu)
      User.findOne()
        .sort({ id: -1 })
        .exec(function (err, lastUser) {
          if (err) return next(err);
          // Tạo id tiếp theo là id lớn nhất hiện tại + 1
          const newId = lastUser ? lastUser.id + 1 : 1;
          // Mã hóa mật khẩu trước khi lưu
          bcrypt.hash(req.body.passWord, 10, function (err, hashedPassword) {
            if (err) {
              return next(err);
            }
            // Tạo người dùng mới với id và mật khẩu đã mã hóa
            let user = new User({
              name: req.body.name,
              userName: req.body.userName,
              passWord: hashedPassword, // Lưu mật khẩu đã mã hóa
              id: newId,
              role: req.body.role,
              position: req.body.position,
              address: req.body.address,
              phone: req.body.phone,
            });
            // Lưu người dùng mới vào cơ sở dữ liệu
            user.save(function (err, savedUser) {
              if (err) {
                console.clear();
                return next(err);
              }
              res.status(201).json({
                message: "User Created successfully",
                user: savedUser, // Trả về đối tượng user đã lưu
              });
            });
          });
        });
    }
  );
};


exports.user_getAll = function (req, res, next) {
  User.find() // Truy vấn tất cả dữ liệu trong bảng User
    .then((users) => {
      res.status(200).json({
        message: "Lấy dữ liệu thành công",
        data: users,
      });
    })
    .catch((error) => {
      console.clear();
      res.status(500).json({
        message: "Đã xảy ra lỗi khi truy vấn dữ liệu",
        error: error.message,
      });
      next(error); // Chuyển lỗi sang middleware tiếp theo nếu có
    });
};

exports.user_getById = function (req, res, next) {
  const userId = req.params.id; // Lấy id từ tham số URL
  User.findOne({ _id: userId }) // Truy vấn người dùng theo ID
    .then((user) => {
      if (!user) {
        console.clear();
        return res.status(404).json({
          message: "Người dùng không tồn tại",
        });
      }
      res.status(200).json({
        message: "Lấy dữ liệu thành công",
        data: user,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Đã xảy ra lỗi khi truy vấn dữ liệu",
        error: error.message,
      });
      next(error); // Chuyển lỗi sang middleware tiếp theo nếu có
    });
};

exports.user_update = function (req, res, next) {
  User.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    function (err, user) {
      if (err) {
        console.clear();
        return next(err);
      }
      res.send("User udpated.");
    }
  );
};

exports.user_delete = function (req, res, next) {
  User.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      console.clear();
      return next(err);
    }
    res.send("Deleted successfully!");
  });
};
