const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const favouriteStopSchema = new Schema({
    _id: {
        type: String,
        required: true
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    stop: {
        type: String,
        ref: 'Stop'
    },

    stopRoutes: [
        {
            type: String,
            ref: 'StopRoute'
        }
    ]
});

module.exports = mongoose.model('FavouriteStop', favouriteStopSchema);