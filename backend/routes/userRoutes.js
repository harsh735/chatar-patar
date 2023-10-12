const express = require('express');
const { registerUser, authUser, allUsers } = require('../controllers/userController');
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");


router.route("/").post(registerUser).get(protect,allUsers); //registerUser,authUser and allUsers are our controllers
router.post('/login',authUser);


module.exports = router;