import { AmpReturn } from "./AmpReturn.js";
import { ClipDataDecoder, IDCountDecoder, IDDecoder, IDDurationDecoder, IDListingDecoder, IDStatusDecoder, StatusSenseDecoder, TimeUserBitsDecoder } from "./ReturnDataDecoders.js";

export const ACK: AmpReturn = {code: "1001"};
export const NAK: AmpReturn = {code: "1112"};
export const ERR: AmpReturn = {code: "2222"};
export const IDCount: AmpReturn = {code: "8226",returnData:IDCountDecoder};
export const IDListing: AmpReturn = {code:"8x14",byteCount:["0","8","A"],returnData: IDListingDecoder};
export const IDStatus: AmpReturn = {code:"8118",returnData:IDStatusDecoder}
export const TimeUserBits: AmpReturn = {code:"7x0y",byteCount:["4","8"],commandCode:["4","5","6","7","A","B","C","D"],returnData:TimeUserBitsDecoder}
export const ReturnStatusSense: AmpReturn = {code: "7x20",byteCount:["1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"],returnData: StatusSenseDecoder}
export const IDLoaded: AmpReturn = {code:"8x16",byteCount:["0","2"],returnData:IDDecoder}
export const IDDuration: AmpReturn = {code:"8x17",byteCount:["0","4"],returnData: IDDurationDecoder}
export const ClipData: AmpReturn = {code:"8x13",byteCount:["0","A"],returnData: ClipDataDecoder}