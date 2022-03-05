import { AmpReturn } from "./AmpReturn.js";

export interface SendDataEncoder<DataType> {encode:(data:DataType,byteCount?:string, commandCode?:string) => string;}

export interface AmpCommand {
    code:string;
    byteCount?: string[];
    commandCode?: string[];
    sendData?: SendDataEncoder<any>;
    validReturns: AmpReturn[];
}