export function zeroPad(str: number | string, places: number): string {
    if (typeof str === "string") {
        return str.padStart(places, "0");
    } else {
        return String(Math.floor(str)).padStart(places, "0");
    }
}

export function toHex(str: string | number, places: number = 2): string {
    if (typeof str === "string") {
        let hex = "";
        for (let i = 0; i < str.length; i++) {
            hex = hex + zeroPad(str.charCodeAt(i).toString(16), 2);
        }
        return hex;
    } else {
        return zeroPad(str.toString(16), places);
    }
}

export function reverseTimecode(timecode: string): string {
    return timecode.split(":").reverse().join("");
}
