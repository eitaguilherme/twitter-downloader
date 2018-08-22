const token = document.getElementById("hidToken").value;
const api_tweet_url = document.getElementById("hidUrlBase").value;

if(token != null){
    var app = new Vue({
        el: "#app",
        data : {
            tweets: [],
            limits: [],
            max_id: ''
        },
        mounted (){
            axios.get(api_tweet_url, 
            {
                headers : { 'x-access-token' : token }
            }).then(response => {
                this.tweets = JSON.parse(JSON.stringify(response.data.tweets));
                this.limits = JSON.parse(JSON.stringify(response.data.limits));
                this.max_id = JSON.parse(JSON.stringify(response.data.max_id));
            });
        },
        methods: {
            getOlderTweets : function(){
                
                axios
                    .get(api_tweet_url, 
                    { 
                        headers : { 'x-access-token' : token },
                        params : { 'maxId' : this.max_id }
                    })
                    .then(response => {
                        let responseTweets = JSON.parse(JSON.stringify(response.data.tweets)) 
                        if(responseTweets.length > 0)
                            this.tweets = this.tweets.concat(responseTweets);
                        else
                            this.getOlderTweets();
                        
                        this.limits = JSON.parse(JSON.stringify(response.data.limits));
                        this.max_id = JSON.parse(JSON.stringify(response.data.max_id));
                    }); 
            }
        }
    });
}