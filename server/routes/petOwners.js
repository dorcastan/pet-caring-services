const express = require('express');
const petOwners = require('../controllers/petOwners');

const router = express.Router();

router.get('/', petOwners.index);
router.get('/:email', petOwners.view);

module.exports = router;