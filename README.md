

import reconnectWebSocket from 'auto-reconnect-webSocket'		
const socketInstance = new reconnectWebSocket({   // instance		
   onMessage () {
     // received messages
   },
   onClosed () {   // connection closed

   },
   onConnected () {    //socket connected

   },
   onError () {     // exception

   }
})
IM.connectWSServer(url, callback) //connect websocket
IM.request(cmd, params, callback) // others
    
```
* entry
	auto-reconnect-webSocket/dist/auto-reconnect-webSocket.js

