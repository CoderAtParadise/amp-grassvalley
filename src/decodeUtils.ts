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

const frameMap: { framerate: number; isWholeFrame: boolean }[] = [
    { framerate: 23.976, isWholeFrame: false },
    { framerate: 24, isWholeFrame: true },
    { framerate: 25, isWholeFrame: true },
    { framerate: 29.97, isWholeFrame: false },
    { framerate: 30, isWholeFrame: true },
    { framerate: 48, isWholeFrame: true },
    { framerate: 50, isWholeFrame: true },
    { framerate: 59.94, isWholeFrame: false },
    { framerate: 60, isWholeFrame: true }
];

function calcFramerate(inframe: number, totalminutes: number) {
    let framerate = 0;
    for (const frame of frameMap) {
        const fdr = frame.framerate * 60 * totalminutes;
        if (inframe >= fdr && inframe < fdr + frame.framerate) {
            framerate = frame.framerate;
            if (frame.isWholeFrame) break;
        }
    }
    return framerate;
}

export function decodeTimecode(
    timecode: string,
    internal: boolean = false
): string {
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

    /*
        PVS when it sends the frames does - framerate * device rate * total minutes + frames 
        It's stupid so we only handle a max of 60fps which equals roughly a 7 digit frame value based on the math of 23hr * 60min * 60dr * 60fps
    */
    const longTimecode = (timecode: string) => {
        const str = timecode.split("").reverse().join("").slice(2); //remove checksum
        const hours = str.slice(0, 2).split("").reverse().join("");
        const minutes = str.slice(2, 4).split("").reverse().join("");
        const seconds = str.slice(4, 6).split("").reverse().join("");
        const fdr = parseInt(str.slice(6).split("").reverse().join(""));
        const fr = calcFramerate(fdr, parseInt(minutes) + parseInt(hours) * 60); // calculate frame rate
        const frames = fdr % fr; // mod the frame data sent by pvs by the frame rate
        return `${zeroPad(hours, 2)}:${zeroPad(minutes, 2)}:${zeroPad(
            seconds,
            2
        )}:${zeroPad(isNaN(frames) ? 0 : frames, 2)}`;
    };
    //Handle those that follow the spec :)
    if (timecode.length <= 10 && timecode.length >= 8)
        return shortTimecode(timecode);
    //Handle pvs doing stupid things
    else if (timecode.length >= 12 && timecode.length <= 17) {
        return longTimecode(timecode);
    } else {
        // Try brute force as this sometimes happens
        if (!internal) {
            const str = timecode.split("7404");
            return decodeTimecode(str[0], true);
        }
        // Return an invalid timecode as decoding becomes impossible
        return "--:--:--:--";
    }
}
