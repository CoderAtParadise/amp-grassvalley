import { time } from "console";
import { zeroPad } from "./encodeUtils.js";

export function hexToString(hex: string): string {
    let str = "";
    let count = 0;
    if (hex.length % 2 === 0) {
        while (count < hex.length) {
            str =
                str +
                String.fromCharCode(parseInt(hex.slice(count, count + 2), 16));
            count += 2;
        }
        return str;
    }
    return "failed to parse clip name";
}

export function hexToBits(hex: string): number {
    let sum = 0;
    let count = 0;
    if (hex.length % 2 === 0) {
        while (count < hex.length) {
            sum = sum + parseInt(hex.slice(count, count + 2), 16);
            count += 2;
        }
    }
    return sum;
}

export function hexToNumber(hex: string): number {
    return parseInt(hex, 16);
}

export function getBit(byte: number, bit: number) {
    return (byte >> bit) % 2;
}

function getPosition(string: string, subString: string, index: number) {
    // let i: number;
    // for (i = 0; index > 0 && i !== -1; index -= 1) {
    //     i = string.indexOf(subString, i ? i + 1 : i);
    // }
    return string.split(subString, index).join(subString).length;
}

export function decodeTimecode(timecode: string): string {
    const shortTimecode = (timecode: string) => {
        const frames = timecode.slice(0, 2);
        const seconds = timecode.slice(2, 4);
        const minutes = timecode.slice(4, 6);
        const hours = timecode.slice(6, 8);
        return `${zeroPad(hours, 2)}:${zeroPad(minutes, 2)}:${zeroPad(
            seconds,
            2
        )}:${zeroPad(frames, 2)}`;
    };

    const longTimecode = (timecode: string) => {
        const seconds = timecode.slice(4, 6);
        const minutes = timecode.slice(6, 8);
        const hours = timecode.slice(8, 10);
        return `${zeroPad(hours, 2)}:${zeroPad(minutes, 2)}:${zeroPad(
            seconds,
            2
        )}:00`;
    };

    if (timecode.length <= 10) return shortTimecode(timecode);
    else if (timecode.length <= 12) return longTimecode(timecode);
    else {
        const t = timecode.slice(0, 10);
        if (getPosition(timecode, t, 2) === 14) return shortTimecode(timecode);
        else if (getPosition(timecode, t, 2) === 16)
            return longTimecode(timecode);
        else return shortTimecode(timecode);
    }
}
