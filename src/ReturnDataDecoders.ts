import { ReturnDataDecoder } from "./AmpReturn.js";
import { decodeTimecode, hexToBits, hexToString } from "./decodeUtils.js";

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
        console.log(data);
        // switch(hexToBits(data)) {
        //     case 1:
        //         return {IdInStorage:true};
        //     case 2:
        //         return {IDLoaded:true};
        // }
        return {};
    }
}

enum CompressionType {
    MPEG1 = 0,
    MPEG2 = 1,
    D10 = 2,
    DV25 = 3,
    DV50 = 4,
    DVCAM = 5,
    MPEG2HD = 6,
    DV100 = 7,
    AVCI = 8
}

enum VideoFormat {
    V_NTSC_525 = 0,
    V_PAL_625 = 1,
    V_720_59_94 = 2,
}

interface IClipData {
    creation?:Date;
    modified?:Date;
    duration?:string;
    compression?:CompressionType;
    format?:VideoFormat;
    vTracks?: number;
    aTracks?:number;
    adTracks?: number;
    tTracks?:number;
}

export const ClipDataDecoder: ReturnDataDecoder<IClipData> = {
    decode:(data:string,byteCount:string,commandCode:string) => {
        console.log(data);
        return {};
    }
}