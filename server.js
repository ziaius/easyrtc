// Load required modules
var https   = require("https");     // https server core module
var http   = require("http");     // https server core module
var fs      = require("fs");        // file system core module
var express = require("express");   // web framework external module
var io      = require("socket.io"); // web socket external module
var easyrtc = require("easyrtc");   // EasyRTC external module

// Setup and configure Express http server. Expect a subfolder called "static" to be the web root.
var httpApp = express();
httpApp.use(express.static(__dirname + "/production"));
// httpApp.use(express.static(__dirname + "/static/"));


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


        //     Creates a new application called MyApp with a default room named "SectorOne".
        //     rtc.createApp(
        //         "easyrtc.instantMessaging",
        //         {"roomDefaultName":"SectorOne"},
        //         myEasyrtcApp
        //     );
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