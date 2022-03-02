import { AmpReturn } from "./AmpReturn";
import { TimeUserBitsDecoder } from "./ReturnDataEncoders";

export const ACK: AmpReturn = {code: "1001"}
export const NAK: AmpReturn = {code: "1112"}
export const ERR: AmpReturn = {code: "2222"}
export const IDListing: AmpReturn = {code:"8x14",byteCount:["0","8","A"]};
export const IDStatus: AmpReturn = {code:"8118"}
export const TimeUserBits: AmpReturn = {code:"7x0y",byteCount:["4","8"],commandCode:["4","5","6","7","A","B","C","D"],returnData:TimeUserBitsDecoder}