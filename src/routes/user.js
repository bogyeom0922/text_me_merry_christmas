const express = require('express');
const {renderSignupPage, handleSignup, renderLoginPage} = require('../controllers/userController');
const upload = require('../middlewares/upload');
const router = express.Router();

router.get('/signup', renderSignupPage);
router.post('/signup', upload.single('profileImage'), handleSignup);

router.get('/login', renderLoginPage);

module.exports = router;