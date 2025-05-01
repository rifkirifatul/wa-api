// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.post('/send', messageController.sendTextMessage);

module.exports = router;
