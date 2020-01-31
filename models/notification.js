const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    type: {type: String, required: true},
    header: {type: String, required: true},
    title: {type: String, required: true},
    message: {type: String, required: true},
    created: {type: String, required: true}
});


NotificationSchema.index({ 'created': 1, 'title': 1}, {unique: true});

NotificationSchema.set('autoIndex', true);

module.exports = mongoose.model('Notification', NotificationSchema, 'notifications');
