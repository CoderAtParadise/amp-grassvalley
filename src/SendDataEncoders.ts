import { SendDataEncoder } from "./AmpCommand";
import { zeroPad } from "./encodeUtils";

export const OptionalTimecodeEncoder: SendDataEncoder<{timecode:string}> = { 
    encode: (data:{timecode:string},byteCount?:string) => {
        if (byteCount === "4") {
            let str = data.timecode.replace(":","");
            str = str.split("").reverse().join("");
            return str;
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

export const InPresetEncoder: SendDataEncoder<{clipname?:string,timecode?:string}> = {
    encode: (data:{clipname?:string,timecode?:string},byteCount?:string) => {

        return "";
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