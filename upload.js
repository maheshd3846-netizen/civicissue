const express = require('express');
const path = require('path');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Serve uploaded files
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

module.exports = router;