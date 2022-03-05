import { zeroPad } from "./encodeUtils";

export function hexToString(hex:string) : string {
    let str = "";
    let count = 0;
    if(hex.length % 2 === 0) {
        while(count < hex.length) {
            str = str + String.fromCharCode(parseInt(hex.slice(count,count + 2),16));
            count += 2;
        }
        return str;
    }
    return "failed to parse clip name";
}

export function hexToBits(hex:string) : number {
    let sum = 0;
    let count = 0;
    if(hex.length % 2 === 0) {
        while(count < hex.length) {
            sum = sum + parseInt(hex.slice(count,count + 2),16);
            count += 2;
        }
    }
    return sum;
}

export function decodeTimecode(timecode:string): string {
    console.log(timecode);
    const frames = timecode.slice(0,2);
    const seconds = timecode.slice(2,4);
    const minutes = timecode.slice(4,6);
    const hours = timecode.slice(6,8);
    return `${zeroPad(hours,2)}:${zeroPad(minutes,2)}:${zeroPad(seconds,2)}:${zeroPad(frames,2)}`;
}