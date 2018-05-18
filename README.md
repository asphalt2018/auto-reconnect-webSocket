
# usage
```
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
socketInstance.connectWSServer(url, callback) //connect websocket
socketInstance.request(cmd, params, callback) // others
    
```
# entry
	auto-reconnect-webSocket/dist/auto-reconnect-webSocket.js

