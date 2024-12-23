const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateUserInfo, setUserActive, getAllUsers } = require('../controllers/usersController');

router.post('/register', registerUser);

router.get('/', getAllUsers);

router.post('/login', loginUser);

router.put('/:id', updateUserInfo);

router.put('/:id/active', setUserActive);

module.exports = router;
