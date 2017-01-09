var i2c = require('i2c');
var sleep = require('sleep');
var address = 0x20;

var wire = new i2c(address, {device: '/dev/i2c-1'});
var data = [
	0xE1,0xE2,0xE4,0xE8, // row 1
	0xD1,0xD2,0xD4,0xD8, // row 2
	0xB1,0xB2,0xB4,0xB8, // row 3
	0x71,0x72,0x74,0x78  // row 4
];
console.log('wire created');


function toggleLights(idx){
    wire.writeBytes(0x14, [data[idx]], function(){
	sleep.usleep(50000);
	if (idx < data.length){
	toggleLights(idx+1);
	}
	else
	{
	  idx = 0;
	  toggleLights(idx);
	}
    });
}

wire.writeBytes(0x00, [0x00], function(){
    console.log('wrote first bytes');
    toggleLights(0);
});

