const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  editUserProfile,
  logUserFollowerData,
  getUserFollowerData,
} = require('../controllers/userController.js');

router.route('/').post(registerUser);
router.post('/login', loginUser);
router.put('/edit', editUserProfile);
router.post('/followers', logUserFollowerData);
router.get('/followers/:user_id', getUserFollowerData);

module.exports = router;
