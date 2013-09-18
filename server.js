// Load required modules
var http        = require("http");          // Http server core module
var express     = require("express");       // Web framework module
var socketIo    = require("socket.io");     // Web socket module
var easyrtc     = require("easyrtc");       // EasyRTC module

var grace       = require("grace");         // Graceful shutdown module


// Set Process Name (visible in Linux; often truncated to 16 characters)
process.title = "node/EasyRTC/De";  

// Setup and configure Express http server. Expect a subfolder called "static" to be the web root.
var httpApp = express();
httpApp.configure(function() {
    httpApp.use(express.static(__dirname + "/static/"));
});

// Start Express http server on port 80
var webServer = http.createServer(httpApp).listen(80);


// Start Socket.io so it attaches itself to Express server
var socketServer = socketIo.listen(webServer, {"log level":1});

// Configure Socket.IO
socketServer.enable('browser client minification');  // send minified client
socketServer.enable('browser client etag');          // apply etag caching logic based on version number
socketServer.enable('browser client gzip');          // gzip the file (THIS MAY CAUSE ERRORS ON SOME SYSTEMS)

// Setting EasyRTC Options
easyrtc.setOption("logLevel", "info");
easyrtc.setOption("logColorEnable", false);

// Start EasyRTC server
var easyrtcServer = easyrtc.listen(httpApp, socketServer, null, function(err, easyrtcPub) {

    // Set up graceful shutdown code
    graceApp = grace.create ();
    graceApp.on ("start", function (){});
    graceApp.on ("shutdown", function (cb){
        try {
            easyrtcPub.util.logInfo('Initiating shutdown of EasyRTC Server');
        } catch(err) {}
        
        // Disallow new incoming connections
        try {
            if (io && io.server) {
                io.server.close();
            }
        }
        catch(err) {}

        // Run the EasyRTC Shutdown event which will safely disconnect users.
        easyrtcPub.eventHandler.emit("shutdown", cb);
    });
    graceApp.on ("exit", function (code){});
    graceApp.timeout (2000, function (cb){
        //The timeout is used if the shutdown task takes more time than expected
        cb ();
    });
    graceApp.start ();
    
});
