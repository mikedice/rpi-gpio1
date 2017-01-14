var i2c = require('i2c');
var sleep = require('sleep');

var i2cAddress = 0x70;
var wire = new i2c(i2cAddress, {device: '/dev/i2c-1'});

var addressLeft = [
    0x00,
    0x02,
    0x04,
    0x06,
    0x08,
    0x0A,
    0x0C,
    0x0E
];

var addressRight = [
    0x01,
    0x03,
    0x05,
    0x07,
    0x09,
    0x0B,
    0x0D,
    0x0F
];

var smiley = [
    parseInt('00111100', 2),
    parseInt('01000010', 2),
    parseInt('10100101', 2),
    parseInt('10000001', 2),
    parseInt('10100101', 2),
    parseInt('10011001', 2),
    parseInt('01000010', 2),
    parseInt('00111100', 2),
];

function writeSmileyLef(){
    console.log('writing smiley on left');
    for (var i = 0; i<addressLeft.length; i++)
    {
        wire.writeBytes(addressLeft[i], [smiley[i]], function(err){
            if (err) throw err;
            console.log('wrote smiley byte');
        });
    }

    for (var i = 0; i<addressRight.length; i++)
    {
        wire.writeBytes(addressRight[i], [0], function(err){
            if (err) throw err;
            console.log('wrote smiley byte');
        });
    }
}

function turnOn(callback){
    console.log('turning on');
    wire.writeByte(0x21, function(err){
        if (err) throw err;
        console.log('started oscillator');

        wire.writeByte(0x81, function(err){
            if (err) throw err;
            console.log('turned on display');
            callback();
        });
    });
}

turnOn(function(){
    writeSmileyLeft();
});

