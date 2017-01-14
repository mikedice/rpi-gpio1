var i2c = require('i2c');

var i2cAddress = 0x70;
var wire = new i2c(i2cAddress, {device: '/dev/i2c-1'});

var smiley = [
    parseInt('00111100', 2)
]

wire.writeBytes(0x21, function(err){
    if (err) throw err;
    wire.writeBytes(0x81, function(err){
        if (err) throw err;

    });
});