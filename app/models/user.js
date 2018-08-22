// user.js

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    token: String,
    tokenSecret: String,
    screenName: String,
    profilePhoto: String,
    lastId: String,
    favorites : [
        {
            "id_str": String,
            "created_at": String,
            "text": String,
            video: {
                "id_str": String,
                "media_image_url": String,
                "media_download_url": String
            }
        }
    ]
});

var User = mongoose.model('User', userSchema);
module.exports = User;