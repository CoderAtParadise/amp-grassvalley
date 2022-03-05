
export function zeroPad(str: number | string, places: number): string {
    if(typeof str === "string")
    {
        return (str as string).padStart(places,"0");
    }
    else {
        return String(Math.floor(str as number)).padStart(places, "0");
    }
}

export function toHex(str:string | number,places: number = 2) : string {
    if(typeof str === "string")
    {
        let hex:string = '';
        for(let i = 0; i < str.length; i++) {
            hex =  hex + zeroPad(str.charCodeAt(i).toString(16),2);
        }
        return hex;
    }
    else {
            return zeroPad((str as number).toString(16),places);
    }
}

export function reverseTimecode(timecode:string) : string {
    let  str = timecode.replace(":","");
    str = str.split("").reverse().join("");
    return str;
}