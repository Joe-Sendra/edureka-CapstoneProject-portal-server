const User = require('../models/user');

exports.getFaculty = (req, res, next) => {
    User.find({role: "admin"},{password: 0, __v: 0}, (err, faculty)=>{
        if (err) return res.status(500).send("Can not fetch faculty");
        res.status(200).send({faculty});
    });
}

exports.getFacultyMember = (req, res, next) => {
    User.findOne({_id: req.params.facultyID}, {password: 0}, (err, faculty)=>{
        if (err) return res.status(500).send("Can not fetch faculty");
        if (!faculty) return res.status(500).send("Member not found");
        if (faculty.role !== "admin") return res.status(500).send("Member not found");

        return res.status(200).send(faculty);
    });
}