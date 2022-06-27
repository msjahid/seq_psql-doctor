const express = require('express');
const router = express.Router();
const { requireRoute, checkUser } = require('../middleware/authMiddleware');


router.get('*', checkUser);
router.get('/', (req,res) => {
    res.render('home')
});

router.get('/doctors', requireRoute, ( req, res) => {
    res.render('./pages/doctors')
});

module.exports = router
