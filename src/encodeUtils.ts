
export function zeroPad(str: number | string, places: number): string {
    if(typeof str === "string")
    {
        return (str as string).padStart(places,"0");
    }
    else {
        return String(Math.floor(str as number)).padStart(places, "0");
    }
}

export function encodeBytes() : string {
    return "";
}