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

var H = [0xE1,          0xE8,
         0xD1,0xD2,0xD4,0xD8,
		 0xB1,          0xB8,
		 0x71,          0x78];

var A = [0xE1,0xE2,0xE4,0xE8,
         0xD1,          0xD8,
		 0xB1,0xB2,0xB4,0xB8,
		 0x71,          0x78];

var I = [0xE1,0xE2,0xE4,    
              0xD2,
			  0xB2,
	     0x71,0x72,0x74];

var L = [0xE1,
         0xD1,
		 0xB1,
		 0x71,0x72,0x73];

var E = [0xE1,0xE2,0xE4,
         0xD1,
		 0xB1,0xB2,
		 0x71,0x72,0x74];

var Y = [0xE1,         0xE8,
              0xD2,0xD4,
			  0xB2,
			  0x72];

var blank = [0xE0, 0xD0, 0xB0, 0x70];

console.log('wire created');


function displayChar(chr, idx, duration, callback){
    wire.writeBytes(0x14, [chr[idx]], function(){
		sleep.usleep(1000);
		if (duration>0){
			duration--;
			if (idx < chr.length){
				displayChar(chr, idx+1, duration, callback);
			}
			else
			{
				idx = 0;
				displayChar(chr, idx, duration, callback);
			}
		}
		else{
			callback();
		}
    });
}


function displayMessage(){
    console.log('wrote first bytes');
	var duration=750;
    displayChar(H, 0, duration, function(){
		displayChar(blank, 0, 1, function(){
			displayChar(A, 0, duration, function(){
				displayChar(blank, 0, 1, function(){
					displayChar(I, 0, duration, function(){
						displayChar(blank, 0, 1, function(){
							displayChar(L, 0, duration, function(){
								displayChar(blank, 0, 1, function(){
									displayChar(E, 0, duration, function(){
										displayChar(blank, 0, 1, function(){
											displayChar(Y, 0, duration, function(){
												displayChar(blank, 0, 1, function(){
												    displayMessage
												});
											});
										});
									});
								});
							});
						});
					});
				});
			});
		});	
	});
};
wire.writeBytes(0x00, [0x00], function(){
	displayMessage();
});

