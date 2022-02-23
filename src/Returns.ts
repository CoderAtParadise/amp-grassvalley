import { AmpReturn } from "./AmpReturn";

export const ACK: AmpReturn = {code: "1001"}
export const NAK: AmpReturn = {code: "1112",returnData:[{bytes:1,decode:(data:string) => {return data}}]}
export const ERR: AmpReturn = {code: "2222"}