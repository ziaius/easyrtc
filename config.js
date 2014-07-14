"use strict";

var config = module.exports;

config.httpPort = 80;
config.httpPublicRootFolder = __dirname + "/static/";


config.socketIoLogLevel = 1;
config.socketIoClientMinify = true;
config.socketIoClientEtag = true;
config.socketIoClientGzip = true;

config.processTitle = "node/EasyRTC/De";

config.easyrtcAppIceServers = [
    {url: "stun:stun.sipgate.net"},
    {url: "stun:217.10.68.152"},
    {url: "stun:stun.sipgate.net:10000"},
    {url: "stun:217.10.68.152:10000"},
    {url: "turn:192.155.84.88", "username": "easyRTC", "credential": "easyRTC@pass"},
    {url: "turn:192.155.84.88?transport=tcp", "username": "easyRTC", "credential": "easyRTC@pass"},
    {url: "turn:192.155.86.24:443", "credential": "easyRTC@pass", username: "easyRTC"},
    {url: "turn:192.155.86.24:443?transport=tcp", "credential": "easyRTC@pass", username: "easyRTC"}
];

// Logging options
config.expressLogFile = "express.log";
config.expressLogExpressFormat = "default";

config.serverLogConsoleLevel = "debug";
config.serverLogConsoleTimestampEnable = true;
config.serverLogConsoleColorEnable = true;
config.serverLogExpressEnable = true;
config.serverLogExpressLevel = "debug";
config.serverLogExpressFormat = "dev";

config.serverLogFile = "server.log";
config.serverLogFileLevel = "debug";
config.serverLogFileTimestampEnable = true;

// Override options
//noinspection JSLint
if (require("fs").existsSync("./config_override.js")) {
    var configOverride = require("./" + "config_override.js");
    for (var key in configOverride) {
        if(configOverride.hasOwnProperty(key)){
            config[key] = configOverride[key];
            console.log("Config Override for ["+key+"]: ", configOverride[key]);
        }
    }
}