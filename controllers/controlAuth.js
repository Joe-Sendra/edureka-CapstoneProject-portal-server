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
    User.findOne({ _id: req.body.id }, (err, user) => {
        if (err) return res.status(500).send('Server error fetching user');
        if(!user) {
            return res.status(401).send('Invalid authentication credentials!');
        } else {
            const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if (!passwordIsValid) {
                return res.status(401).send('Invalid authentication credentials!');
            } else {
                var token = jwt.sign({ id: req.body.id}, process.env.SECRET, {expiresIn: 300 });
                res.status(200).json({token: token});
            }
        }
    })
}