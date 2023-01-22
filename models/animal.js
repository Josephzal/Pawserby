const mongoose = require('mongoose');
const Comment = require('./comment');
const Schema = mongoose.Schema;

const AnimalSchema = new Schema({
    species: String,
    image: String,
    name: String,
    description: String,
    location: String,
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]  
});

AnimalSchema.post('findOneAndDelete', async function (doc) {
    // if animal data exists, remove all comments on deletion
    if(doc){
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        })
    }
});

module.exports = mongoose.model('Animal', AnimalSchema);