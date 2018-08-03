const ruuvi = require('node-ruuvitag');
const PubNub = require('pubnub')
const seconds = 5;

var tags = {
  'dafa48397997': { name: 'Outdoor', lastLog: -1 },
  'd504aa854879': { name: 'Basement', lastLog: -1 },
  'fdd4babe263a': { name: 'Indoor', lastLog: -1 }
};

var pubnub = new PubNub({
  subscribeKey: "sub-c-dd166120-9434-11e8-8ad6-9a5d6aeb6012",
  publishKey: "--INSERT PUBLISH--",
  ssl: true
});


function postIt(tag, data) {
  var ruuviData = querystring.stringify({
    'tagID': tag.id,
    'temperature': data.temperature,
    'humidity': data.humidity,
    'pressure': data.pressure,
    'accelX': data.accelerationX,
    'accelY': data.accelearationY,
    'accelZ': data.acceleartionZ,
    'battery': data.battery,
    'rssi': data.rssi,
    'dateTime': new Date().toISOString()
  });

  pubnub.publish({
    channel: 'temperature-ruuvi',
    message: ruuviData,
  });
}

function secondsSince(time1, time2) {
  var fin = 9001;
  var millsBetween = time2 - time1;
  fin = Math.floor(millsBetween / 1000);
  return fin;
}

module.exports = {
  checkTags: function () {
    ruuvi.on('found', tag => {
      console.log('Found RuuviTag, id: ' + tag.id);
      tag.on('updated', data => {
        d = new Date();
        if (
          (tag.id in tags) && ((tags[tag.id]['lastLog'] === -1) || (secondsSince(tags[tag.id]['lastLog'], d) > seconds))) {
          tags[tag.id]['lastLog'] = d;
          data['tagName'] = tags[tag.id]['name'];
          console.log('Got data from RuuviTag ' + tag.id + ':\n' + JSON.stringify(data, null, '\t'));
          postIt(tag, data);
        }
        else {
        }
      });
    });
  }
}