const express = require('express');
const {
    register,
    login,
    getMe,
    forgotPassword,
    verifyOtp,
    resetPassword,
    updatePassword,
    updateFcmToken
} = require('../Controllers/AuthController');

const router = express.Router();

const { protect } = require('../Middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPassword);
router.post('/verifyotp', verifyOtp);
router.put('/resetpassword', resetPassword);
router.put('/updatepassword', protect, updatePassword);
router.put('/fcm-token', protect, updateFcmToken);

module.exports = router;
