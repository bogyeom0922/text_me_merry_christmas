const express = require('express');
const { renderSignupPage, handleSignup } = require('../controllers/userController');
const router = express.Router();

router.get('/signup', renderSignupPage);
router.post('/signup', handleSignup);

module.exports = router;