// User model for mongoose schema
const Enroll = require('../models/enroll');

exports.getNonRegistered = (req, res, next) => {
    Enroll.find({isRegistered: false},{email: 1}, (err, nonRegisteredUsers)=>{
        if (err) {
            return res.status(500).send("Can not fetch users");
        }
        res.status(200).json(nonRegisteredUsers);
    });
}

exports.addEnroll = (req, res, next) => {
    Enroll.create({
        email: req.body.email,
        isRegistered: false
    },(err, enrollUser)=>{
        if (err) {
            console.log(err);
            return res.status(500).send("Error: Can not add user enrollment.");
        }
        res.status(201).json({
            message: "User successfully added to enrollment list.",
            id: enrollUser._id
        });
    })
}
