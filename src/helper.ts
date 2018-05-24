/**
 *
 * @param {object} json
 * @returns {ArrayLike<number> | ArrayBuffer}
 */
export function msgToUint(json: object): any {
  try {
    const data = btoa(encodeURIComponent(JSON.stringify(json)));
    const charList = data.split('');
    const uintArray = [];
    for (const item of charList) {
      uintArray.push(item.charCodeAt(0));
    }
    return new Uint8Array(uintArray);
  } catch (err) {
    console.log(`msgToUint err${err}`);
    return new Uint8Array([]);
  }
}

/**
 *
 * @param {ArrayLike<number> | ArrayBuffer} uintArray
 * @returns {any}
 */
export function uintToMsg(uintArray: ArrayLike<number> | ArrayBuffer): any {
  try {
    const encodedString = String.fromCharCode.apply(null, new Uint8Array(uintArray));
    const decodedString = decodeURIComponent(atob(encodedString));
    return JSON.parse(decodedString);
  } catch (err) {
    console.log(`uintToMsg err${err}`);
    return {};
  }
}

/**
 *
 * @param {string} eventName
 * @param args
 * @returns {CustomEvent}
 */
export function generateEvent(eventName: string, args?: any): CustomEvent {
  const event = document.createEvent('CustomEvent');
  event.initCustomEvent(eventName, false, false, args);
  return event;
}
