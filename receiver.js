var PubNub = require('pubnub')
var pubnub = new PubNub({
    subscribeKey: "sub-c-dd166120-9434-11e8-8ad6-9a5d6aeb6012",
    ssl: true
})

pubnub.addListener({
    status: function(statusEvent) {
        console.log(statusEvent);
    },
    message: function(msg) {
        console.log(msg.message.temperature);
    },
    presence: function(presenceEvent) {
        console.log(presenceEvent);
    }
});

pubnub.history(
    {
        channel: 'temperature-ruuvi',
        count: 100, // how many items to fetch
        stringifiedTimeToken: true, // false is the default
    },
    function (status, response) {
        console.log(response.messages);
    }
);

console.log("Subscribing..");
pubnub.subscribe({
    channels: ['temperature-ruuvi'] 
});