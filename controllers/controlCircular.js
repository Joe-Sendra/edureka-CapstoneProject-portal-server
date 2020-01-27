// Models for mongoose schema
const Circular = require('../models/circular');

exports.getCirculars = (req, res, next) => {
    Circular.find((err, circulars) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error: Can not retrieve circulars.");
        }
        res.status(200).json(circulars);
    });
}

exports.addCircular = (req, res, next) => {
    const circularDate = req.body.circular.date && req.body.circular.date !== '' ? req.body.circular.date : null;
    const circularTitle = req.body.circular.title && req.body.circular.title !== '' ? req.body.circular.title : null;
    const circularAuthor = req.body.circular.author && req.body.circular.author !== '' ? req.body.circular.author : null;
    const circularParagraphs = req.body.circular.paragraphs && req.body.circular.paragraphs !== '' ? req.body.circular.paragraphs : null;
    const circularImgUrl = req.body.circular.imgUrl && req.body.circular.imgUrl !== '' ? req.body.circular.imgUrl : null;
    

    if (
        !circularDate ||
        !circularTitle ||
        !circularAuthor ||
        !circularParagraphs ||
        !circularImgUrl
        ) {
        return res.status(500).send("Error: Invalid exam data provided");
    }

    const newCircular = {
        date: circularDate,
        title: circularTitle,
        author: circularAuthor,
        paragraphs: circularParagraphs,
        imgUrl: circularImgUrl,
        isActive: true
    }

    Circular.create( newCircular , (err, circular) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error: Can not create circular.");
        }
        res.status(201).json({
            message : "Circular successfully added",
            circular: circular
        });
    });
}

exports.getCircular = (req, res, next) => {
    Circular.findOne({_id: req.params.circularID},(err, circular) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error: Can not retrieve circular.");
        }
        res.status(200).json(circular);
    });
}