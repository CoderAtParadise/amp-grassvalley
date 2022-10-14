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

export function decodeTimecode(timecode: string): string {
    if (timecode.length < 14) {
        const t = timecode
            .split("")
            .reverse()
            .join("")
            .slice(2, timecode.length);
        const hours = t.slice(0, 2).split("").reverse().join("");
        const minutes = t.slice(2, 4).split("").reverse().join("");
        const seconds = t.slice(4, 6).split("").reverse().join("");
        let frames = t.slice(6, t.length).split("").reverse().join("");
        if (frames.length > 2) frames = "00";
        return `${zeroPad(hours, 2)}:${zeroPad(minutes, 2)}:${zeroPad(
            seconds,
            2
        )}:${zeroPad(frames, 2)}`;
    } else {
        const frames = timecode.slice(0, 2);
        const seconds = timecode.slice(2, 4);
        const minutes = timecode.slice(4, 6);
        const hours = timecode.slice(6, 8);
        return `${zeroPad(hours, 2)}:${zeroPad(minutes, 2)}:${zeroPad(
            seconds,
            2
        )}:${zeroPad(frames, 2)}`;
    }
}
