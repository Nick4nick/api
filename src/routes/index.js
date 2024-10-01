const express = require('express');
const router = express.Router();
const professionalsRoutes = require('./professionalsRoutes');

router.use(express.json());
router.use('/professionals', professionalsRoutes);

module.exports = router;