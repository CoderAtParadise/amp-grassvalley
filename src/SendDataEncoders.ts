import { count } from "console";
import { SendDataEncoder } from "./AmpCommand.js";
import { hexToNumber } from "./decodeUtils.js";
import { reverseTimecode, toHex, zeroPad } from "./encodeUtils.js";

export const OptionalTimecodeEncoder: SendDataEncoder<{timecode:string}> = { 
    encode: (data:{timecode:string},byteCount?:string) => {
        if (byteCount === "4") {
            return reverseTimecode(data.timecode);
        }
        return "";
    }
}

interface CurrentTimeSenseData {
    VITCTimeFromSource?: boolean;
    LTCTimeFromSource?: boolean;
    VITCUserBits?: boolean;
    LTCUserBits?: boolean;
    WindowsTime?: boolean;
    Timer1?: boolean;
    VITCTimeFromTimecodeTrack?: boolean;
    LTCTimeFromTimecodeTrack?: boolean;
}

export const InPresetEncoder: SendDataEncoder<{clipName:string,type?:string,timecode?:string}> = {
    encode: (data:{clipName:string,type?:string,timecode?:string},byteCount?:string) => {
        let actualbytes = 2;
        switch(byteCount) {
            case "A":
                actualbytes = actualbytes + data.clipName.length;
                return `${toHex(actualbytes,4)}${zeroPad(data.clipName.length,4)}${toHex(data.clipName)}`;
            case "E":
                actualbytes = actualbytes + data.clipName.length + 1;
                if(data.type === "A") {
                    return `${toHex(actualbytes,4)}0A${zeroPad(data.clipName.length,4)}${toHex(data.clipName)}`;
                }
                else if (data.type === "E") {
                    return `${toHex(actualbytes,4)}0E${zeroPad(data.clipName.length,4)}${reverseTimecode(data.timecode!)}${toHex(data.clipName)}`;
                }
        }
        return "";
    }
}

export const ListFirstIDEncoder: SendDataEncoder<{}> = {
    encode: (data:{},byteCount?:string) => {
        if(byteCount === "2")
            return "0000";
        return "";
    }
}

export const ListNextIDEncoder: SendDataEncoder<{count:number}> = {
    encode: (data:{count:number}) => {
        return toHex(data.count,2);
    }
}

export const IDStatusEncoder: SendDataEncoder<{clipName:string}> = {
    encode: (data:{clipName:string},byteCount?:string) => {
       if(byteCount === "A") {
           const actualbytes = 2 + data.clipName;
            return `${toHex(data.clipName.length,4)}${toHex(data.clipName)}`;
       }
        return `${toHex(data.clipName)}`;
    }
}

export const CurrentTimeSenseSendData: SendDataEncoder<CurrentTimeSenseData> = {
    encode: (data:CurrentTimeSenseData = {LTCTimeFromTimecodeTrack:true}) => {
        let sum = data?.LTCTimeFromTimecodeTrack ? 1: 0;
        sum = sum + (data?.VITCTimeFromTimecodeTrack ? 2 : 0);
        sum = sum + (data?.Timer1 ? 4: 0);
        sum = sum + (data?.WindowsTime ? 8: 0);
        sum = sum + (data?.LTCUserBits ? 16: 0);
        sum = sum + (data?.VITCUserBits ? 32: 0);
        sum = sum + (data?.LTCTimeFromSource ? 64: 0);
        sum = sum + (data?.VITCTimeFromSource ? 128: 0);
        return zeroPad(sum.toString(16),2);
    }
}

export const IDDurationEncoder: SendDataEncoder<{clipName:string}> = {
    encode: (data:{clipName:string}) => {
        const actualbytes = 2 + data.clipName.length;
        return `${toHex(actualbytes,4)}${toHex(data.clipName.length,4)}${toHex(data.clipName)}`;
    }
}

export const StatusSenseSendData: SendDataEncoder<{byte: string}> = {
    encode: (data:{byte:string}) => {
        return `${zeroPad(data.byte,2)}`;
    }
}

export const ClipDataRequestEncoder: SendDataEncoder<{type:string,clipName:string}> = {
    encode: (data:{type:string, clipName:string}) => {
        if(data.type === "C") {
            const actualbytes = 3 + data.clipName.length;
            return `${toHex(actualbytes,4)}0C${toHex(data.clipName.length,4)}${toHex(data.clipName)}`;
        }
        return "";
    }
}

export const CueUpWithDataEncoder: SendDataEncoder<{timecode?:string,clipName?:string}> = {
    encode: (data:{timecode?:string,clipName?:string},byteCount?:string) => {
        if(byteCount === "4")
            return `${reverseTimecode(data!.timecode as string)}`;
        else if(byteCount === "8")
            return `${data.clipName}`;
        else if(byteCount === "C")
            return `${reverseTimecode(data!.timecode as string)}${data.clipName}`;
        else
            return ""
    }
}