const jwt = require('jsonwebtoken');
const db = require('../models/db');

const requireRoute = (req, res, next) => {
    const token = req.cookies.SSID;

    //check json web token exits & is verified
    if(token) {
        jwt.verify(token, 'secret key', (err, decodedToken) => {
            if(err) {
                res.redirect('/login');
            } else {
                console.log(decodedToken);
                next();
            }
        })
    } else {
        res.redirect('/login');
    }
}

const checkUser = (req, res, next) => {
    const token = req.cookies.SSID;

    if(token) {
        jwt.verify(token, 'secret key', async (err, decodedToken) => {
            if (err) {
                res.locals.currentUser = null;
                next();
            } else {
                let currentUser = await db.User.findByPk(decodedToken.id);
                res.locals.currentUser = currentUser;
                next();
            }
        })
    } else {
        res.locals.currentUser = null;
        next();
    }
}

module.exports = {requireRoute, checkUser};
