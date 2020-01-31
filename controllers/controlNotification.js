// Models for mongoose schema
const Notification = require('../models/notification');

exports.getNotifications = (req, res, next) => {
    Notification.find((err, notifications) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error: Can not retrieve notifications.");
        }
        res.status(200).json(notifications);
    });
}

exports.addNotification = (req, res, next) => {
    const noteType = req.body.notification.type && req.body.notification.type !== '' ? req.body.notification.type : null;
    const noteHeader = req.body.notification.header && req.body.notification.header !== '' ? req.body.notification.header : null;
    const noteTitle = req.body.notification.title && req.body.notification.title !== '' ? req.body.notification.title : null;
    const noteMessage = req.body.notification.message && req.body.notification.message !== '' ? req.body.notification.message : null;
    const noteCreated = req.body.notification.created && req.body.notification.created !== '' ? req.body.notification.created : null;


    if (!noteType || !noteHeader || !noteTitle || !noteMessage || !noteCreated) {
        return res.status(500).send("Error: Invalid notification data provided");
    }

    const newNotification = {
        type: noteType,
        header: noteHeader,
        title: noteTitle,
        message: noteMessage,
        created: noteCreated
    }

    Notification.create( newNotification , (err, notification) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error: Can not create notification.");
        }
        res.status(201).json({
            message : "Notification successfully added",
            notification: notification
        });
    });
}

exports.getNotification = (req, res, next) => {
    Notification.findOne({_id: req.params.notificationID},(err, notification) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error: Can not retrieve notification.");
        }
        res.status(200).json(notification);
    });
}

exports.patchNotification = (req, res, next) => {
    const notificationID = req.params.notificationID;
    const noteType = req.body.notification.type && req.body.notification.type !== '' ? req.body.notification.type : null;
    const noteHeader = req.body.notification.header && req.body.notification.header !== '' ? req.body.notification.header : null;
    const noteTitle = req.body.notification.title && req.body.notification.title !== '' ? req.body.notification.title : null;
    const noteMessage = req.body.notification.message && req.body.notification.message !== '' ? req.body.notification.message : null;
    const noteCreated = req.body.notification.created && req.body.notification.created !== '' ? req.body.notification.created : null;

    if (!noteType || !noteHeader || !noteTitle || !noteMessage || !noteCreated) {
        return res.status(500).send("Error: Invalid notification data provided");
    }

    const newNotification = {
        type: noteType,
        header: noteHeader,
        title: noteTitle,
        message: noteMessage,
        created: noteCreated
    }
    
    Notification.findOne({_id: notificationID},(err, notification) => {
        if (err || !notification) {
            console.log(err);
            return res.status(500).send("Error: Can not retrieve notification.");
        }

        notification.type = newNotification.type;
        notification.header = newNotification.header;
        notification.title = newNotification.title;
        notification.message = newNotification.message;
        notification.created = newNotification.created;

        notification.save((err, result)=>{
            if (err) {
                console.log(err);
                return res.status(500).send("Server error can not update notification.");
            } 
            res.status(201).json({
                message : "Notification successfully updated"
            });
        });
    });
}

exports.deleteNotification = (req, res, next) => {
    const notificationID = req.params.notificationID;
    Notification.findOne({_id: notificationID},(err,notification) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Server error can not find notificationID in DB.");
        }
        
        notification.remove();

        notification.save((err, result)=>{
            if (err) {
                console.log(err);
                return res.status(500).send("Server error can not delete notification.");
            } 
            res.status(201).json({
                message : "Notification successfully deleted"
            });
        });
    });
}
