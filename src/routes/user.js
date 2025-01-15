const express = require('express');
const { renderSignupPage, handleSignup } = require('../controllers/userController');
const upload = require('../middlewares/upload');
const router = express.Router();

router.get('/signup', renderSignupPage);
router.post('/signup', upload.single('profileImage'), handleSignup);

module.exports = router;