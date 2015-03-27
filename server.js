// Load required modules
var https   = require("https");     // https server core module
var http   = require("http");     // https server core module
var fs      = require("fs");        // file system core module
var express = require("express");   // web framework external module
var io      = require("socket.io"); // web socket external module
var easyrtc = require("easyrtc");   // EasyRTC external module

var path    = require("path");

var validator = require('validator');
var allowedCharacters = [ 'a' ,'b' ,'c' ,'d' ,'e' ,'f' ,'g' ,'h' ,'i' ,'j' ,'k' ,'l' ,'m' ,'n' ,'o' ,'p' ,'q' ,'r' ,'s' ,'t' ,'u' ,'v' ,'w' ,'x' ,'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0' ];
// Setup and configure Express http server. Expect a subfolder called "static" to be the web root.
var httpApp = express();
httpApp.use(express.static(__dirname + "/production"));




var roomObject = {};
roomObject.room = "kambarelis";
var userObject = {};
userObject.username = "";


httpApp.get('/favicon.ico',function(req,res,next){    
    console.log("got it! favicon.ico");
});

httpApp.get('/room_name',function(req, res){
    console.log(roomObject);
    res.json(roomObject);
     // var data = {
    //     "fruit": {
    //         "apple": req.params.fruitName,
    //         "color": req.params.fruitColor
    //     }
    // }; 

});

httpApp.get('/my_name',function(req, res){
    console.log(userObject);
    res.json(userObject);
});

httpApp.get('/av',function(req,res){
    res.sendFile('multiparty.html', {root: path.join(__dirname+"/production") });
});

httpApp.get('/msg',function(req,res){
    res.sendFile('data_channel_messaging.html', {root: path.join(__dirname+"/production") });
});


httpApp.get('/fs',function(req,res){
    res.sendFile('data_channel_filesharing.html', {root: path.join(__dirname+"/production") });
});

// httpApp.get('/:room',function(req,res,next){ 

//     if ( isValidName(req.params.room) ) {
//         roomObject.room = req.params.room;
//         res.sendFile('home.html', {root: path.join(__dirname+"/production") });
//     } else {
//         roomObject.room = "kambarelis";
//         res.sendFile('index.html', {root: path.join(__dirname+"/production") });
//     }
// });


httpApp.get('/SD/:room/:username', function(req, res) {
   
	 
        if ( isValidName(req.params.room) && isValidName(req.params.username) ) {
	   var currentdate = new Date(); 
	   var datetime =   currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();

	    var conn_info = datetime
	    	+ ' ' + req.connection.remoteAddress // || req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.connection.socket.remoteAddress
		+ ' ' + req.params.room
		+ ' ' + req.params.username
		+ '\n';
            roomObject.room = req.params.room;
            userObject.username = req.params.username;
            res.sendFile('home.html', {root: path.join(__dirname+"/production") });
	    
	    fs.appendFile('../conn_info.txt', conn_info, function (err) {
		console.log('error loging connection info:\n',err); 
	    });
        } else {
            roomObject.room = "kambarelis";
            userObject.username = "";
            res.sendFile('index.html', {root: path.join(__dirname+"/production") });
        }    
});



// Start Express https server on port 8443
// var webServer = https.createServer(
// {
//     key:  fs.readFileSync(__dirname + "/ssl/77094568-ec2-54-213-239-107.us-west-2.compute.amazonaws.com.key"),
//     cert: fs.readFileSync(__dirname + "/ssl/77094568-ec2-54-213-239-107.us-west-2.compute.amazonaws.com.cert")
// },
// httpApp).listen(8443);
var webServer = http.createServer(httpApp).listen(8080);

// Start Socket.io so it attaches itself to Express server
var socketServer = io.listen(webServer, {"log level":1});


//easyrtc.setOption("demosEnable", false);
//easyrtc.setOption("roomDefaultName", "SoftDent_room")

// Start EasyRTC server
var rtc = easyrtc.listen(httpApp, socketServer,
        {logLevel:"debug", logDateEnable:false} 
        ,
        function(err, rtc) {


        	// After the server has started, we can still change the default room name
            rtc.setOption("roomDefaultName", "SoftDent_room");


            // Creates a new application called MyApp with a default room named "SectorOne".
            rtc.createApp(
                "easyrtc.dataFileTransfer",
                myEasyrtcApp
            );
             rtc.createApp(
                "easyrtc.dataMessaging",
                myEasyrtcApp
            );
        }
);

// Setting option for specific application
var myEasyrtcApp = function(err, appObj) {
    // All newly created rooms get a field called roomColor.
    // Note this does not affect the room "SectorOne" as it was created already.
    appObj.setOption("roomDefaultFieldObj",
         {"roomColor":{fieldValue:"green", fieldOption:{isShared:true}}}
    );
};

var getRandomUsernama = function(){
    var suffix = (Math.random() * 20| 0) + 1;
    return "user_name"+suffix;
};

var isValidName = function(target){
    var onlyValidCharacters = validator.isAlphanumeric(validator.blacklist(target,'-._'));  //req.params.room.match(/[a-z0-9_.-]{4,32}/i);
    var hasValidLength = validator.isLength(target, 1,32);
    return ( onlyValidCharacters && hasValidLength);

    // return easyrtc.isNameValid(target);
};
