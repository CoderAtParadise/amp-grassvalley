import { AmpReturn, ReturnDataDecoder } from "../AmpReturn.js";
import { hexToString } from "../decodeUtils.js";

const IDDecoder: ReturnDataDecoder<{name:string}> = {
    decode:(data:string,codes:{byteCount?:string}) => {
        if(codes.byteCount === "2") {
            const charCount = parseInt(data.slice(4,8),16);
            const chars = data.slice(8,8 + charCount * 2);
            return {name:hexToString(chars)}
        }
        return {name:"no clip loaded"};
    }
}

export const IDLoaded: AmpReturn = {code:"8x16",byteCount:["0","2"],returnData:IDDecoder}