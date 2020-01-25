const mongoose = require('mongoose');

const CircularSchema = new mongoose.Schema({
    date: {type: String, required: true},
    title: {type: String, required: true},
    author: {type: String, required: true},
    paragraph: [{type: String}],
    imgUrl: {type: String},
    isActive: {type: Boolean}
});


CircularSchema.index({ 'date': 1, 'title': 1}, {unique: true});

CircularSchema.set('autoIndex', true);

module.exports = mongoose.model('Circular', CircularSchema, 'circulars');
