const express = require('express');
const router = express.Router();
const User = require('../schemas/User');

// 1. C R UD (Get all, Get by ID)
router.get('/', async (req, res) => {
    const users = await User.find({ isDeleted: false }).populate('role');
    res.json(users);
});

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).populate('role');
    res.json(user);
});

// Xoá mềm (Update isDeleted = true)
router.delete('/:id', async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.json({ message: "Đã xoá mềm thành công" });
});

// 2. API /enable
router.post('/enable', async (req, res) => {
    const { email, username } = req.body;
    const user = await User.findOneAndUpdate(
        { email, username },
        { status: true },
        { new: true }
    );
    if (user) res.json({ message: "Đã kích hoạt", user });
    else res.status(404).json({ message: "Thông tin không đúng" });
});

// 3. API /disable
router.post('/disable', async (req, res) => {
    const { email, username } = req.body;
    const user = await User.findOneAndUpdate(
        { email, username },
        { status: false },
        { new: true }
    );
    if (user) res.json({ message: "Đã vô hiệu hoá", user });
    else res.status(404).json({ message: "Thông tin không đúng" });
});

module.exports = router;