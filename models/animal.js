const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnimalSchema = new Schema({
    species: String,
    type: String,
    description: String,
    location: String  
});

module.exports = mongoose.model('Animal', AnimalSchema);