var i2c = require('i2c');
var address = 0x18; // TODO: address
var device = '/dev/i2c-1';
var wire = new i2c(address, device);

write.scan(function(err, data){
    console.log('scan callback');
});