// Models for mongoose schema
const User = require('../models/user');
const ResetPassword = require('../models/resetPassword');

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

exports.resetPassword = (req, res, next) => {
    const email = req.body.email ? req.body.email : null;
    const token = req.body.token ? req.body.token : null;
    const newPassword = req.body.newPassword ? req.body.newPassword : null;

    ResetPassword.findOne({email: email}, (err, record) => {
        if (err) return res.status(500).json({ message: 'Server error resetting password' });
        if (!record) {
            return res.status(401).json({ message: 'Invalid email address provided' });
        }
        const tokenIsValid = bcrypt.compareSync(token, record.token);
        if (!tokenIsValid) {
            return res.status(401).json({ message: 'Invalid reset token provided' });
        }
        // TODO validate token is not expired

        User.findOne({email: email}, (err, user) => {
            if (err) return res.status(500).json({ message: 'Server error retrieving user to reset password' });
            if (!user) return res.status(500).json({ message: 'User not found to reset password!' });
            const hashedPassword = bcrypt.hashSync(newPassword, 8);
            user.updateOne({password: hashedPassword}, (err, result) => {
                if (err) return res.status(500).json({ message: 'Server error updating password' });
                ResetPassword.deleteOne({email: email}, (err)=>{
                    if (err) console.log('Error trying to delete reset password token from DB');
                });
                res.status(200).json({ message: 'Password has been reset'});
            });
        });
    });

    
}