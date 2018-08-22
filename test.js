var Twit = require('twit');
var config = require('./config');
var _ = require('underscore');
var fs = require('fs');

var T = new Twit({
    consumer_key: config.twitter.consumerKey,
    consumer_secret: config.twitter.consumerSecret,
    access_token: "12244282-bt3hDEExZBnbTONcuGajskPFnnksZFUKiguDkUhfa",
    access_token_secret: "FQIDFCyNEvXUDxWCs0MkxPg5VY9bpIpdAqvFrrFw0KsyM",
});

T.get('favorites/list', { count: 200, maxId : "1003381029804150784" }, function(err,data,response){

    var filter = _.filter(data, function(tweet){
        
        var ehOQueEuQuero = false;
        if(tweet.extended_entities){
            if(tweet.extended_entities.media){
                _.each(tweet.extended_entities.media, function(media,key, list){
                        if(media.type == "video" || media.type == "animated_gif")
                            ehOQueEuQuero = true;
                });
            }
        }
        if(ehOQueEuQuero)
            return tweet;
    });
    
    var tweets = []
    _.each(filter, function(tweet,key,list){
        if(tweet.extended_entities){
            _.each(tweet.extended_entities.media, function(media,key, list){
                if(media.type == "video"){
                    var mediaImageUrl = media.media_url;
                    var id = media.id_str;
                    if(media.video_info){
                        if(media.video_info.variants){
                            media.video_info.variants.every((variant, index) => {
                                if(variant.content_type == 'video/mp4'){
                                    tweets.push({
                                        id_str: id,
                                        media_image_url: mediaImageUrl,
                                        media_download_url: variant.url
                                    });
                                    return false; // I WANT TO BREAK FREE
                                }
                            });
                        }
                    }
                }
            });
        }
    });
    fs.writeFile('examples/tweets.json',JSON.stringify(tweets), error => console.log(error));
});

