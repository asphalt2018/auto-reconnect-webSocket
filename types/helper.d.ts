/**
 *
 * @param {object} json
 * @returns {ArrayLike<number> | ArrayBuffer}
 */
export declare function msgToUint(json: object): any;
/**
 *
 * @param {ArrayLike<number> | ArrayBuffer} uintArray
 * @returns {any}
 */
export declare function uintToMsg(uintArray: ArrayLike<number> | ArrayBuffer): any;
/**
 *
 * @param {string} eventName
 * @param args
 * @returns {CustomEvent}
 */
export declare function generateEvent(eventName: string, args?: any): CustomEvent;
