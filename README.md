EasyRTC Demo Site 
=================

The demo_site branch is a quick example of creating a web server which uses EasyRTC.

Currently it is set to use EasyRTC as a module. This is a new feature present only in the Alpha branch.

**Note:** The demo examples are tied to the EasyRTC version being used.


Running the Demo Site
---------------------

1. Install Node.JS
2. Download all files from this `demo_site` branch into a folder of your choice
3. From the command line, navigate to the folder.
4. Run `npm install` to install required node modules (including EasyRTC).
5. Run `node server` to start the server.
6. In your web browser, navigate to the site. It may be at http://localhost/


Modules Used
------------

While EasyRTC requires Socket.io and Express, we've also found other modules which are useful.

**Required:**
 - **Express** - Framework for http hosting. We require it for hosting demo files and the client API, but you can use it for hosting a full site if desired.
 - **Socket.IO** - A robust client and server websocket library with fallbacks in cases where websockets are unavailable (which should be rare as all current WebRTC browsers also support websockets).

**Optional:**
 - **Grace** - Allows a graceful shutdown routine, by trapping Ctrl-c key or SIGINT. We use it to give all clients a hangup command.

