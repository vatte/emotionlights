var Twitter = require('twit');
var serial = require('serialport')

var words = require('./big6emotions.json');
var keys = require('./accesskeys.json');


var partywords = [
  'emotionhackday',
  'emotionhack',
  'ehd2016'
]

var busy = false;

var serialPort = new serial.SerialPort('/dev/ttyACM0',{
  parser: serial.parsers.readline("\n"),
  baudrate: 115200
});

serialPort.on("open", function() {
  console.log('serial open');
  serialPort.on('data', function(data) {
    //console.log('serial data received: ' + data);
  });
});

var writeColor = function(index, rgb) {
  var tmp = 'C ' + index + " " + rgb[0] + " " + rgb[1] + " " + rgb[2] + "K";

  serialPort.write(tmp, function(err) {
    //console.log(err);
  });
}

var party = function() {
  busy = true;
  var i=0;
  var step=0;
  var interval = setInterval(function() {
    switch(step) {
      case 0:
        writeColor(i, [255, 0, 0]);
        break;
      case 1:
        writeColor(i, [0, 255, 0]);
        break;
      case 2:
        writeColor(i, [0, 0, 255]);
        break;
      case 3:
        writeColor(i, [255, 255, 255]);
        break;
    }
    if(i>=50) {
      i=0;
      step++;
    }
    if(step>3) {
      clearInterval(interval);
      busy = false;
      led_index = 0;
    }
    i++;
  }, 40);
}

var client = new Twitter({
  consumer_key: keys.consumer_key,
  consumer_secret: keys.consumer_secret,
  access_token: keys.access_token,
  access_token_secret: keys.access_token_secret
});

var led_index = 0;
var tracked_words = [];
for(var word in words) tracked_words.push(encodeURI(word));
for(var i in partywords) tracked_words.push(encodeURI(partywords[i]));
var stream = client.stream('statuses/filter', { track: tracked_words });

stream.on('tweet', function (tweet) {
  var text = tweet.text.toLowerCase();
  var color = undefined;
  for (word in words) {
    if (text.indexOf(word) !== -1) {
      color = words[word];
      break;
    }
  }
  for (i in partywords) {
    if(text.indexOf(partywords[i]) !== -1) {
      party();
      console.log('******PARTY******');
      console.log(text);
    }
  }
  if(color && !busy) {
    writeColor(led_index, color);
    led_index = (led_index + 1) % 50;
  }
});
