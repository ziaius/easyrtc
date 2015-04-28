requirejs.config({

 paths: {
     jquery: "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min",
     callstats: "https://api.callstats.io/static/callstats.min",
     socketio: "https://cdn.socket.io/socket.io-1.2.0",
     sha: "https://cdnjs.cloudflare.com/ajax/libs/jsSHA/1.5.0/sha",

     easy_jq: "/js/prettify/jquery-1.9.1.min",
     easyrtc: "/js/easyrtc",
     io: "/socket.io/socket.io.js",
     multiparty: "/js/multiparty"
 },

 shim: {
     'jquery': {
         exports: '$'
     },
     'socketio': {
         exports: 'io'
     },
     'sha': {
         exports: 'jsSHA'
     },

     'easy_jq': {
     	exports: 'easy_jq'
     },
     'io': {
     	exports: 'io'
     },

     'callstats': {
         deps: ['jquery','socketio','sha','easyrtc'],
         exports: 'callstats',
     },

     'easyrtc': {
         deps: ['io',],
     },
     
     'multiparty': {
         deps: ['easy_jq','callstats'],
     },
 }
});

require(['multiparty', 'callstats'], function(multiparty,callstats){
    var AppID;    
    var AppSecret; 

    $.getJSON('/js/callstats.json', function(jd) {
        if (jd.enabled == true){
            AppID = jd.AppID;
            AppSecret = jd.AppSecret;
            var UserID = "public-av";
            //var callStats = new callstats($,io,jsSHA);
            function initCallback (err, msg) {
              console.log("Initializing Status: err="+err+" msg="+msg);
            }
            //userID is generated or given by the origin server
            callstats.initialize(AppID, AppSecret, UserID, initCallback);
            window.callStats = callstats;
        }
    appInit()
    });
   
});