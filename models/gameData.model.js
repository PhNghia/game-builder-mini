const { model, Schema } = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var gameDataSchema = new Schema({
    title: String,
    template: {
        type: String,
        enum: ["quiz", "matching", "group-sort"],
        required: true
    },
    data: {
        type: Schema.Types.Mixed,
        required: true
    }
}, {
    timestamps: true,
    collection: 'GameDatas'
});

//Export the model
module.exports = model('GameData', gameDataSchema);