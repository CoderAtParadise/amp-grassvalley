import { ReturnDataDecoder } from "./AmpReturn";
import { decodeTimecode, hexToBits, hexToString } from "./decodeUtils";
import { zeroPad } from "./encodeUtils";

export const TimeUserBitsDecoder : ReturnDataDecoder<{timecode:string,userBits?:string}> = {
    decode:(data:string,byteCount:string,commandCode:string) : {timecode:string,userBits?:string} => {
        if(commandCode === "D") return {timecode:"--:--:--:--"};
        return {timecode:decodeTimecode(data)};
    }
}

export const IDDecoder: ReturnDataDecoder<{name:string}> = {
    decode:(data:string,byteCount:string,commandCode:string) => {
        if(byteCount === "2") {
            const charCount = parseInt(data.slice(4,8),16);
            const chars = data.slice(8,8 + charCount * 2);
            return {name:hexToString(chars)}
        }
        return {name:"no clip loaded"};
    }
}

export const IDDurationDecoder: ReturnDataDecoder<{timecode:string}> = {
    decode:(data:string,byteCount:string,commandCode:string) => {
        if(byteCount === "4")
            return {timecode:decodeTimecode(data)};
        return  {timecode:"--:--:--:--"}
    }
}

export const IDStatusDecoder: ReturnDataDecoder<{IdInStorage?:boolean,IDLoaded?:boolean, ReadyForPlayback?:boolean,LoadedInAnotherChannel?:boolean}> = {
    decode:(data:string,byteCount:string,commandCode:string) =>
    {
        // NOOP
        
        // switch(hexToBits(data)) {
        //     case 1:
        //         return {IdInStorage:true};
        //     case 2:
        //         return {IDLoaded:true};
        // }
        return {};
    }
}