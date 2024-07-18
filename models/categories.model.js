const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    imageUrl: {
        type:String
    }
});

module.exports = mongoose.model('Category', categorySchema);