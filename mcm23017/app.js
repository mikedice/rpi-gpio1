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

var H = [0xE1,0xE8,0xD1,0xD2,0xD4,0xD8,0xB1,0xB8,0x71,0x78]
var h = [0xE1,0xD1,0xB1,0xB2,0xB4,0x71,0x74];
var a = [0xD1, 0xD2, 0xD4, 0xB1, 0xB4, 0x71, 0x72, 0x74,0x78];

console.log('wire created');


function displayChar(chr, idx, duration){
    wire.writeBytes(0x14, [chr[idx]], function(){
		sleep.usleep(1000);
		if (duration>0){
			duration--;
			if (idx < chr.length){
				displayChar(chr, idx+1, duration);
			}
			else
			{
				idx = 0;
				displayChar(chr, idx, duration);
			}
		}
    });
}

wire.writeBytes(0x00, [0x00], function(){
    console.log('wrote first bytes');
	var duration=5000;
    displayChar(h, 0, duration);
	displayChar(a, 0, duration);
});

