// Load required modules
var https   = require("https");     // https server core module
var http   = require("http");     // https server core module
var fs      = require("fs");        // file system core module
var express = require("express");   // web framework external module

var session = require('express-session');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');

var io      = require("socket.io"); // web socket external module
var easyrtc = require("easyrtc");   // EasyRTC external module

var path    = require("path");
// Add request module to call XirSys servers
var request = require("request");

var validator = require('validator');
//var allowedCharacters = [ 'a' ,'b' ,'c' ,'d' ,'e' ,'f' ,'g' ,'h' ,'i' ,'j' ,'k' ,'l' ,'m' ,'n' ,'o' ,'p' ,'q' ,'r' ,'s' ,'t' ,'u' ,'v' ,'w' ,'x' ,'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0' ];



var crypto = require('crypto');

// Setup and configure Express http server. Expect a subfolder called "static" to be the web root.

var app = express();
app.use(express.static(__dirname + "/production"));


app.use(session({
    genid: function(req) {
        return randomValueBase64(18)
    },
    secret: 'thisishighlyconcealedmessage',
    resave: false,
    saveUninitialized: true})
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


// no more dirty global objects
// var roomObject = {};
// roomObject.room = "";
// var userObject = {};
// userObject.username = "";


app.get('/favicon.ico',function(req,res,next){     console.log("got it! favicon.ico");   });

app.get('/room_name',function(req, res){

	if (undefined != (req.session.roomObject)) {
	    console.log("req.session.roomObject",req.session.roomObject);
	    res.json(req.session.roomObject);
	} else {
		req.session.roomObject = {}
        req.session.roomObject.room = 'public';//+randomValueBase64(4);
        res.json(req.session.roomObject);
	}
    // var data = {
    //     "fruit": {
    //         "apple": req.params.fruitName,
    //         "color": req.params.fruitColor
    //     }
    // };
});

app.get('/my_name',function(req, res){
	if (undefined != (req.session.userObject)) {
	    console.log("req.session.userObject",req.session.userObject);
	    res.json(req.session.userObject);
	} else {
		req.session.userObject = {};
		req.session.userObject.username = 'user'+randomValueBase64(6);
		res.json(req.session.userObject);
	}
});

app.get('/av',function(req,res){
    res.sendFile('multiparty.html', {root: path.join(__dirname+"/production") });
});

app.get('/msg',function(req,res){
    res.sendFile('data_channel_messaging.html', {root: path.join(__dirname+"/production") });
});


app.get('/fs',function(req,res){
    res.sendFile('data_channel_filesharing.html', {root: path.join(__dirname+"/production") });
});

// app.get('/:room',function(req,res,next){ 

//     if ( isValidName(req.params.room) ) {
//         roomObject.room = req.params.room;
//         res.sendFile('home.html', {root: path.join(__dirname+"/production") });
//     } else {
//         roomObject.room = "kambarelis";
//         res.sendFile('index.html', {root: path.join(__dirname+"/production") });
//     }
// });

app.get('/SD/:room/:username', function(req, res) {
   
	 
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
            req.session.roomObject = {};
            req.session.roomObject.room = req.params.room;
            req.session.userObject = {};
            req.session.userObject.username = req.params.username;
            res.sendFile('home.html', {root: path.join(__dirname+"/production") });
	    
	    fs.appendFile('../conn_info.txt', conn_info, function (err) {
		console.log('error loging connection info:\n',err); 
	    });
        } else {
            console.log ("Tratata - this never happpens", req.session.sid)
            req.session.roomObject = {}
            req.session.roomObject.room = 'public'+randomValueBase64(4);
            req.session.userObject = {}
            req.session.userObject.username = randomValueBase64(10);
            res.sendFile('index.html', {root: path.join(__dirname+"/production") });
        }    
});



// Start Express https server on port 8443
// var webServer = https.createServer(
// {
//     key:  fs.readFileSync(__dirname + "/ssl/77094568-ec2-54-213-239-107.us-west-2.compute.amazonaws.com.key"),
//     cert: fs.readFileSync(__dirname + "/ssl/77094568-ec2-54-213-239-107.us-west-2.compute.amazonaws.com.cert")
// },
// app).listen(8443);
var webServer = http.createServer(app).listen(8080);

// Start Socket.io so it attaches itself to Express server
var socketServer = io.listen(webServer, {"log level":1});


//easyrtc.setOption("demosEnable", false);
//easyrtc.setOption("roomDefaultName", "SoftDent_room")

// easyrtc.on("getIceConfig", function(connectionObj, callback) {
  
//     // This object will take in an array of XirSys STUN and TURN servers
//     var iceConfig = [];

//     request.post('https://api.xirsys.com/getIceServers', {
//         form: {
//             ident: "ziai",
//             secret: "d8d43a90-4300-47fc-89b7-17ffe30bfc74",
//             //domain: "127.0.0.1",
//             domain: "ec2-54-213-239-107.us-west-2.compute.amazonaws.com",
//             application: "multiparty", //only for multiparty application
//             room: "default", //only with this room 
//             secure: 1
//         },
//         json: true
//     },
//     function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//             // body.d.iceServers is where the array of ICE servers lives
//             iceConfig = body.d.iceServers;  
//             console.log(iceConfig);
//             callback(null, iceConfig);
//         }
//         else {
//             console.log("error >");
//             console.log(error);
//             console.log("error <");
//         }
//     });
// });


// Start EasyRTC server
var rtc = easyrtc.listen(app, socketServer,
        {logLevel:"debug", logDateEnable:false} 
        ,
        function(err, rtc) {


        	// After the server has started, we can still change the default room name
            rtc.setOption("roomDefaultName", "softdent-room");


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


var randomValueBase64 = function(len) {
    return crypto.randomBytes(Math.ceil(len * 3 / 4))
        .toString('base64')   // convert to base64 format
        .slice(0, len)        // return required number of characters
        .replace(/\+/g, '0')  // replace '+' with '0'
        .replace(/\//g, '0'); // replace '/' with '0'
};