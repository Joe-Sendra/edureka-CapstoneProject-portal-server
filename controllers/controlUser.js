// User model for mongoose schema
const User = require('../models/user');

// Use bcrypt to hash password before saving to database
const bcrypt = require('bcryptjs');

exports.getAllUsers = (req, res, next) => {
    User.find({}, (err, users)=>{
        if (err) return res.status(500).send("Can not fetch users");
        res.status(200).send({users});
    });
}

exports.addUser = (req, res, next) => {
    // Hash the password before adding to the database
    const newUser = req.body.studentEnroll;
    const hashedPassword = bcrypt.hashSync(newUser.password, 8);
    User.create({
        email: newUser.email,
        password: hashedPassword,
        role: newUser.role,
        isLockedOut: false,
        resetPassword: false,
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

exports.getAllStudents = (req, res, next) => {
    User.find({role: "student"},{password: 0, __v: 0}, (err, students)=>{
        if (err) return res.status(500).send("Can not fetch students");
        res.status(200).send({students});
    });
}

exports.getStudent = (req, res, next) => {
    User.findOne({_id: req.params.studentId}, {password: 0}, (err, student)=>{
        if (err) return res.status(500).send("Can not fetch student");
        return res.status(200).send(student);
    });
}

exports.updateUser = (req, res, next) => {

    let updateInfo = req.body.updateStudentInfo;

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
        if (updateInfo.hasOwnProperty('resetPassword')) {
            updatedUser = {
                ...updatedUser,
                resetPassword: updateInfo.resetPassword
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