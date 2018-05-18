export function msgToUint(json: object): ArrayLike<number> | ArrayBuffer {
  try {
    let string = btoa(encodeURIComponent(JSON.stringify(json))),
      charList = string.split(""),
      uintArray = [];
    for (let item of charList) {
      uintArray.push(item.charCodeAt(0));
    }
    return new Uint8Array(uintArray);
  } catch (err) {
    console.log(`msgToUint err${err}`);
    return new Uint8Array([]);
  }
}

export function uintToMsg(uintArray: ArrayLike<number> | ArrayBuffer): any {
  try {
    let encodedString = String.fromCharCode.apply(null, new Uint8Array(uintArray));
    let decodedString = decodeURIComponent(atob(encodedString));
    return JSON.parse(decodedString);
  } catch (err) {
    console.log(`uintToMsg err${err}`);
    return {};
  }
}

export function generateEvent(eventName: string, args?: any): CustomEvent {
  const event = document.createEvent("CustomEvent");
  event.initCustomEvent(eventName, false, false, args);
  return event;
}