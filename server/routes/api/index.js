const express = require('express');
const router = express.Router();
const userRouter = require('./user');
const homeRouter = require('./home');

router.use('/user', userRouter);
router.use('/home', homeRouter);

module.exports = router;