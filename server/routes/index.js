const router = require('express').Router();

const auth = require('./auth');
const { ensureAuthenticated } = require('../auth/middleware');
const petOwners = require('./petOwners');
const leaves = require('./leaves');
const caretakers = require('./caretakers');
const reviews = require('./reviews');

router.use('/', auth);

// Routes

router.use('/pet-owners', ensureAuthenticated, petOwners);
router.use('/leaves', ensureAuthenticated, leaves);
router.use('/caretakers', ensureAuthenticated, caretakers);
router.use('/reviews', ensureAuthenticated, reviews);
router.use('/pet-owners', ensureAuthenticated, petOwners);

// Catch-all route (used for error handling)

router.get('/', (req, res) => {
  res.status(401).json({ error: 'Not logged in' }); // TODO: not needed here
});

module.exports = router;
