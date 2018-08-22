var express = require('express');
var router = express.Router();

var _ = require("underscore");

var jwt = require('jsonwebtoken');
var config = require('../../config');

var Twit = require('twit');

var mongoose = require('mongoose');
var User = require('../../app/models/user');

router.get('/',function(req,res){
    var T = new Twit({
        consumer_key: config.twitter.consumerKey,
        consumer_secret: config.twitter.consumerSecret,
        access_token: req.decoded.token,
        access_token_secret: req.decoded.tokenSecret,
    });

    

    T.get('favorites/list', { count: 200, max_id: req.query.maxId  }, function(err,data,response){
    
        //TODO: pega os gifs/videos dos retweets
        var filter = _.filter(data, function(tweet){
            
            var ehVideo = false;
            if(tweet.extended_entities){
                if(tweet.extended_entities.media){
                    _.each(tweet.extended_entities.media, function(media,key, list){
                            if(media.type == "video")
                            ehVideo = true;
                    });
                }
            }
            if(ehVideo)
                return tweet;
        });
        
        var tweets = [];
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

        var limits = [];
        let max_id;
        let since_id;

        if(filter){
            max_id = data[data.length-1].id_str;
            sice_id = data[0].id_str;
        }

        console.log(tweets.length);
        if(req.query.maxId)
            tweets.shift();

        T.get('application/rate_limit_status', { count: 200 }, function(err,data,response){
            limits = data.resources.favorites['/favorites/list'];
            res.json({ tweets:tweets, max_id: max_id , since_id : since_id, limits: limits});
        });
        
    });
});

module.exports = router;