var i2c = require('i2c');
var sleep = require('sleep');

var i2cAddress = 0x70;
var wire = new i2c(i2cAddress, {device: '/dev/i2c-1'});

// I2C addresses of each row in the left bank of pixels
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

// I2C addresses of each row in the right bank of pixels
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

// Buffers to store screen pixel values of each row
// Initialized to all pizels off
var screenLeft = [0,0,0,0,0,0,0,0];
var screenRight = [0,0,0,0,0,0,0,0];
var maxRows = 8;
var maxCols = 16;

// clear all the pixels
function clear(){
    screenLeft = [0,0,0,0,0,0,0,0];
    screenRight = [0,0,0,0,0,0,0,0];
    for (var i = 0; i<maxRows; i++){
        wire.writeBytes(addressLeft[i], [0], function(err){});
        wire.writeBytes(addressRight[i], [0], function(err){});
    }
}

// turn on or off a pixel. Value of row has to be
// less than maxRows. Value has to be less than maxCols
function setBit(row, col, on){
   var mask = Math.pow(2, col<8 ? col : col-8);
   var bank = col < 8 ? screenLeft : screenRight;
   if (!on) {
        mask = ~mask;
	bank[row] = bank[row] & mask;
   }
   else{
       bank[row] = bank[row] | mask;
   }

   wire.writeBytes(col < 8 ? addressLeft[row] : addressRight[row],
		    [bank[row]],
		    function(err){});
}


function begin(){
    clear();

    var row = 0;
    var col = 0; 
    var prevRow = 0;
    var prevCol = 0;
    var reverse = false;
    
    var printBlock = function(){
        setBit(row, col, !reverse);	
        prevRow = row;
	prevCol = col;

	if (!reverse) col++;
	else col--;
        if (col > 15) reverse = true;
	else if (col < 0) reverse = false;
	setTimeout(printBlock, 15);
       
    }
    setTimeout(printBlock, 1000);   
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
    begin();
});

