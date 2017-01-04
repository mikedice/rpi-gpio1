var express = require('express');
var bodyParser = require('body-parser');
var gpio = require('rpi-gpio');
var Promise = require('bluebird');

// setup express
var app = express();
app.use(bodyParser.json());

// hardware to be used
var greenLED = {
    channel: 16,
    name: "greenLED"
};

// Helper function to setup hardware
function setupOutputLED(ledInfo){
    return new Promise(function(resolve, rejejct){
        gpio.setup(ledInfo.channel, gpio.DIR_OUT, function(err){
            if(err) reject(err);
            resolve(ledInfo);
        });
    });
}

function startWebServer(){
    console.log("starting web server");

    app.post('/value', function(req, res){
        ledState = req.body;
        if (ledState.state === "on"){
            if (ledState.channel === greenLED.name){
                gpio.write(greenLED.channel, true, function(err){
                    if (err){ console.log("error turning on greenLED"); }
                });
            }
        }
        else if (ledState.state === "off"){
            if (ledState.channel === greenLED.name){
                gpio.write(greenLED.channel, false, function(err){
                    if (err){ console.log("error turning off greenLED"); }
                });
            }
        }
    });
    app.listen(3000);
}

Promise.join(setupOutputLED(greenLED))
.then(function(success){
    startWebServer();
}, function(error){
    console.log("failed to set up hardware. App will terminate");
    process.exit();
});

