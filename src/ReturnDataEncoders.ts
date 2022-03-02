import { ReturnDataDecoder } from "./AmpReturn";
import { zeroPad } from "./encodeUtils";

export const TimeUserBitsDecoder : ReturnDataDecoder<{timecode:string,userBits?:string}> = {
    decode:(data:string,byteCount:string,commandCode:string) : {timecode:string,userBits?:string} => {
        if(commandCode === "D") return {timecode:"--:--:--:--"};
        const frames = data.slice(0,2);
        const seconds = data.slice(2,4);
        const minutes = data.slice(4,6);
        const hours = data.slice(6,8);
        return {timecode:`${zeroPad(hours,2)}:${zeroPad(minutes,2)}:${zeroPad(seconds,2)};${zeroPad(frames,2)}`};
    }
}