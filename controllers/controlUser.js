// Models for mongoose schema
const User = require('../models/user');
const ResetPassword = require('../models/resetPassword');

// Use bcrypt to hash password and token before saving to database
const bcrypt = require('bcryptjs');

// Used to generate random token
const crypto = require('crypto');

// Used to send reset password email
const nodemailer = require('nodemailer');

// use dotenv for environment variables
const dotenv = require('dotenv');
dotenv.config();

exports.getAllUsers = (req, res, next) => {
    User.find({}, (err, users)=>{
        if (err) return res.status(500).send("Can not fetch users");
        res.status(200).send({users});
    });
}

exports.addUser = (req, res, next) => {
    // Hash the password before adding to the database
    const newUser = req.body.studentEnroll;
    if (!newUser.role) return res.status(500).send("Must provide a role");
    
    const hashedPassword = bcrypt.hashSync(newUser.password, 8);
    if (newUser.role === 'student'){
        User.create({
            email: newUser.email,
            password: hashedPassword,
            role: newUser.role,
            isLockedOut: false,
            name: {
                first: newUser.name.first,
                last: newUser.name.last
            }
        },(err, user)=>{
            if (err) {
                console.log(err);
                return res.status(500).send("Error: Can not register user.");
            }
    
            if (typeof req.studentEnroll !== 'undefined') {
                if (req.studentEnroll.isEnrollInProcess) {
                    req.studentEnroll.id = user._id;   
                    return next()
                }
            } else {
                res.status(201).json({
                    message : "User successfully registered",
                    id: user._id
                });
            }
        })
    }
    if (newUser.role === 'admin'){
        User.create({
            email: newUser.email,
            password: hashedPassword,
            role: newUser.role,
            isLockedOut: false,
            name: {
                first: newUser.name.first,
                last: newUser.name.last
            },
            faculty: {
                office: {
                    building: newUser.faculty.office.building,
                    number: newUser.faculty.office.number
                }
            }
        },(err, user)=>{
            if (err) {
                console.log(err);
                return res.status(500).send("Error: Can not register user.");
            }
    
            if (typeof req.studentEnroll !== 'undefined') {
                if (req.studentEnroll.isEnrollInProcess) {
                    req.studentEnroll.id = user._id;   
                    return next()
                }
            } else {
                res.status(201).json({
                    message : "User successfully registered",
                    id: user._id
                });
            }
        })
    }
}



exports.updateUser = (req, res, next) => {

    let updateInfo = req.body.updateUserInfo;

    User.findById(req.body._id, (err, userInDB) => {
        if (err) return next(err);

        let updatedUser;
        if (updateInfo.hasOwnProperty('email')) {
            updatedUser = {
                ...updatedUser,
                email: updateInfo.email
            }
        }
        if (updateInfo.hasOwnProperty('isLockedOut')) {
            updatedUser = {
                ...updatedUser,
                isLockedOut: updateInfo.isLockedOut
            }
        }     
        if (updateInfo.hasOwnProperty('name')) {
            updatedUser = {
                ...updatedUser,
                name: {
                    first: updateInfo.name.first,
                    last: updateInfo.name.last
                }
            }
        }
        if (updateInfo.hasOwnProperty('address')) {
            updatedUser = {
                ...updatedUser,
                address: {
                    street: updateInfo.address.street,
                    city: updateInfo.address.city,
                    state: updateInfo.address.state,
                    zipcode: updateInfo.address.zipcode
                }
            }
        } 
        if (updateInfo.hasOwnProperty('phone')) {
            updatedUser = {
                ...updatedUser,
                phone: {
                    home: updateInfo.phone.home,
                    work: updateInfo.phone.work,
                    mobile: updateInfo.phone.mobile
                }
            }             
        }
        if (updateInfo.hasOwnProperty('leave')) {
            updatedUser = {
                ...updatedUser,
                leave: updateInfo.leave
            }
        }

        userInDB.updateOne(updateInfo, {upsert: true},(err, result)=>{
            if (err) return res.status(500).send("Error: Can not update user.");
            if (result.nModified > 0 ) {
                // Successfully updated
                return res.status(200).json({
                    isSuccess: true,
                    message: "User successfully updated"
                });
            } else {
                if (result.n > 0) {
                    return res.status(200).json({
                        isSuccess: true,
                        message: "User found, but no info was updated"
                    });
                }
                return res.status(500).json({
                    isSuccess: false,
                    message: "Something went wrong, please try again"
                });
            }
        });
    });

}

exports.resetPassword = (req, res, next) => {
    User.findOne({email: req.body.email}, (err, user)=> {
        if (!user) {
            return res.status(500).json({ message: 'user does not exist' });
        }
        ResetPassword.findOne({email: req.body.email}, (err, record)=> {
            if (record) {
                ResetPassword.deleteOne({email: req.body.email}, (err)=>{
                    if (err) return res.status(500).json({ message: 'Server Error resetting password'});
                });
            }

            let token = crypto.randomBytes(32).toString('hex');
            bcrypt.hash(token, 8, (err, hash)=>{
                ResetPassword.create({
                    email: user.email,
                    token: hash,
                    expire: new Date(Date.now()) // TODO add an amount of time for expire
                }).then(resetPasswordRecord => {
                    if (!resetPasswordRecord) {
                        return res.status(500).json({ message: 'Server Error resetting password'});
                    }
                    
                    // Send reset password email to user
                    // Using mailtrap settings for dev purposes
                    let transporter = nodemailer.createTransport({
                        host: process.env.MAIL_HOST,
                        port: process.env.MAIL_HOST_PORT,
                        auth: {
                            user: process.env.MAIL_HOST_AUTH_USER,
                            pass: process.env.MAIL_HOST_AUTH_PASS
                        }
                    });

                    // Send email to user with token in a link
                    transporter.sendMail({
                        from: '"Admin" <Admin@school.com>', // sender address
                        to: user.email, // list of receivers
                        subject: "Reset school portal password", // Subject line
                        html: `<p>To reset your password, complete this form:</p>
                        <a href="${process.env.SERVER_URL}/reset/${user._id}/${token}">${process.env.SERVER_URL}/reset/${user._id}/${token}</a>` // html body
                    });

                    return res.status(200).json({message: 'Reset password email sent to user'});
                });
            });
        });
    });
    
}