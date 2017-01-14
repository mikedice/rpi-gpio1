var i2c = require('i2c');
var sleep = require('sleep');

var i2cAddress = 0x70;
var wire = new i2c(i2cAddress, {device: '/dev/i2c-1'});

var address = [
    0x00,
    0x02,
    0x04,
    0x06,
    0x08,
    0x0A,
    0x0C,
    0x0E
];

var smiley = [
    parseInt('00111100', 2),
    parseInt('01000010', 2),
    parseInt('10100101', 2),
    parseInt('10000001', 2),
    parseInt('10100101', 2),
    parseInt('10011001', 2),
    parseInt('00111100', 2),
];

function writeSmiley(){
    for (var i = 0; i<address.length; i++)
    {
        wire.WriteBytes(address[i], [smiley[i]], function(err){
            if (err) throw err;
        });
    }
}

function turnOn(callback){
    wire.writeBytes(0x21, function(err){
        if (err) throw err;
        wire.writeBytes(0x81, function(err){
            if (err) throw err;
            callback();
        });
    });
}

turnOn();
while (true){
    sleep.sleep(1);
}