var express = require('express');
var router = express.Router();
const User = require('../schemas/User'); // Import model User

// --- 1) VIẾT HÀM C R UD (GET ALL, GET BY ID) VÀ XOÁ MỀM ---

// A. Lấy tất cả user (Chỉ lấy những người chưa bị xoá mềm)
router.get('/', async (req, res) => {
    try {
        const users = await User.find({ isDeleted: false }).populate('role');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// B. Lấy user theo ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id, isDeleted: false }).populate('role');
        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// C. Xoá mềm (UD - Update field isDeleted thành true)
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id, 
            { isDeleted: true }, 
            { new: true }
        );
        res.status(200).json({ message: "Đã xoá mềm thành công", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// --- 2) VIẾT HÀM POST /enable ---
// Truyền lên email và username, nếu đúng thì chuyển status về true
router.post('/enable', async (req, res) => {
    try {
        const { email, username } = req.body;
        const user = await User.findOneAndUpdate(
            { email: email, username: username, isDeleted: false },
            { status: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "Thông tin email hoặc username không đúng" });
        }
        res.status(200).json({ message: "Kích hoạt (Enable) thành công", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async function (req, res, next) {
  try {
    let newUser = new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      status: req.body.status,
      role: req.body.roleId,
      loginCount: req.body.loginCount
    });
    await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// --- 3) VIẾT HÀM POST /disable ---
// Truyền lên email và username, nếu đúng thì chuyển status về false
router.post('/disable', async (req, res) => {
    try {
        const { email, username } = req.body;
        const user = await User.findOneAndUpdate(
            { email: email, username: username, isDeleted: false },
            { status: false },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "Thông tin email hoặc username không đúng" });
        }
        res.status(200).json({ message: "Vô hiệu hoá (Disable) thành công", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;