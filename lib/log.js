"use strict";

var winston = require("winston");       // Winston logging module
var config = require("../config");      // Application configuration

var log = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            "level": config.serverLogConsoleLevel,
            "timestamp": config.serverLogConsoleTimestampEnable,
            "colorize": config.serverLogConsoleColorEnable
        }),
        new (winston.transports.DailyRotateFile)({
            "filename": config.serverLogFile,
            "timestamp": config.serverLogFileTimestampEnable
        })
    ]
});

log.expressLog = new (winston.Logger)({
    transports: [
        new (winston.transports.DailyRotateFile)({
            "filename": config.expressLogFile,
            "json": false
        })
    ]
});

log.expressLogStream = {"write": function (msg) {
    log.expressLog.info(msg.replace("\n", ""));
}};

log.expressServerLogStream = {"write": function (msg) {
    log.debug("Express: " + msg.replace("\n", ""));
}};


log.expressLogMorgan = {"format": config.expressLogExpressFormat, "stream": log.expressLogStream};
log.serverLogMorgan = {"format": config.serverLogExpressFormat, "stream": log.expressServerLogStream};
module.exports = log;