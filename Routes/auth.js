const express = require('express');
const {
    register,
    login,
    getMe,
    forgotPassword,
    resetPassword
} = require('../Controllers/AuthController');

const router = express.Router();

const { protect } = require('../Middleware/auth');
const upload = require('../Middleware/upload');
const { processImage } = require('../Middleware/imageProcessor');

router.post('/register', upload.single('license'), processImage, register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;
