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
        isRegistered: false,
        isEnrollInProcess: false
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

exports.enrollStudent = (req, res, next) => {

    const studentEnroll = req.body.studentEnroll;
    Enroll.findOne({email: studentEnroll.email}, (err, nonRegisteredUser)=>{
        if (err) {
            return res.status(500).send("Can not fetch student");
        }

        // Student is not enrolled, does not have a registration number
        if (!nonRegisteredUser) {
            return res.status(500).json({message: "Student does not have a registration number"});
        }

        // Student is already registered
        if (nonRegisteredUser.isRegistered) {
            return res.status(500).json({message: "Student is already enrolled"});
        }

        // Verify email matches registration number
        if (nonRegisteredUser._id.toString() !== studentEnroll.registrationNumber) {
            return res.status(500).json({message: "Invalid registration number"});
        }

        // If starting enroll process 
        if (typeof req.studentEnroll === 'undefined') {
            // Update isEnrollInProcess to true
            const enroll = new Enroll({
                _id: nonRegisteredUser._id,
                email: nonRegisteredUser.email,
                isRegistered: false,
                isEnrollInProcess: true
            });
            Enroll.updateOne({_id: nonRegisteredUser._id}, enroll).then(result => {
                if (result.n > 0 ) {
                    // Successfully updated
                    return next() // next to add student to users collection
                } else {
                    return res.status(500).json({message: "Something went wrong, please try again"});
                }
            });
        } else {
        
            // Student has been added as a user, update enroll process
            if (req.studentEnroll.isRegistered) {
                const enroll = new Enroll({
                    _id: nonRegisteredUser._id,
                    email: nonRegisteredUser.email,
                    isRegistered: true,
                    isEnrollInProcess: false
                });
                Enroll.updateOne({_id: nonRegisteredUser._id}, enroll).then(result => {
                    if (result.n > 0 ) {
                        // Successfully updated
                        // Student has been added as a user and is now enrolled
                        return res.status(200).json(
                            { message: "Student successfully enrolled.",
                                data: {
                                    id: req.studentEnroll.id,
                                    email: nonRegisteredUser.email
                                }
                            }
                        );
                    } else {
                        return res.status(500).json({message: "Something went wrong, please try again"});
                    }
                });
            }
        }
    });

}
