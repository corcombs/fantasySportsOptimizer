// server.js

// set up ======================================================================
// get all the tools we need

var today =new Date();
var yesterdayString = new Date(today.getMonth+','+today.getDate+','+today.getFullYear+', 04:00:00 GMT-0400');
var yesterday = new Date(today);
yesterday.setHours(today.getHours() - 5);

// configuration ===============================================================
console.log(yesterday.toUTCString());
console.log(today);
setTimer(1000);
function setTimer(timeoutTime){
    setTimeout(function(){
        console.log(timeoutTime);
        timeoutTime=timeoutTime+1000;
        setTimer(timeoutTime);
    },timeoutTime);
};
