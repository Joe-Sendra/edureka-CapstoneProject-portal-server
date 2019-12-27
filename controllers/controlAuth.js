// User model for mongoose schema
const User = require('../models/user');

// Use token for authentication/authorization
const jwt = require('jsonwebtoken');

// Use bcrypt to verify hashed password in database
const bcrypt = require('bcryptjs');

// use dotenv for environment variables
const dotenv = require('dotenv');
dotenv.config();

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) return res.status(500).send('Server error fetching user');
        if(!user) {
            return res.status(401).send('Invalid authentication credentials!');
        }
        
        if(user.isLockedOut) {
            return res.status(401).send('User is blocked, see admin');
        }

        if(user.resetPassword) {
            return res.status(500).send('User must change password'); // TODO change password process
        }

        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send('Invalid authentication credentials!');
        } else {
            var token = jwt.sign({ email: req.body.email}, process.env.SECRET, {expiresIn: 600 });
            return res.status(200).json({_id: user._id, token: token, role: user.role});
        }
        
    })
}