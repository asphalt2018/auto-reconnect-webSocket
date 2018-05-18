# introduction
  auto-reconnect-webSocket is a tiny and fast plugin capable of reconnecting webSocket automatically,only 9kb when zipped.


# usage
```javascript
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

