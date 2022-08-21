import { AmpReturn, ReturnDataDecoder } from "../AmpReturn.js";
import { hexToNumber, hexToString } from "../decodeUtils.js";

export const IDListingDecoder: ReturnDataDecoder<{clipNames:string[]}> = {
    decode:(data:string,codes:{byteCount?:string}) => {
        const clipNames: string[] = [];
        const actualbytes = hexToNumber(data.slice(0,4));
        let byteOffset = 2;
        if(codes.byteCount === "A" || codes.byteCount === "a") {
            let clipNameLength = hexToNumber(data.slice(4,4 + byteOffset * 2))
            while(actualbytes >= byteOffset + clipNameLength) {
                clipNames.push(hexToString(data.slice(4 + byteOffset * 2,4 + byteOffset * 2 + clipNameLength * 2)));
                byteOffset += clipNameLength;
                clipNameLength = hexToNumber(data.slice(4 + byteOffset * 2,4 + (byteOffset + 2) * 2));
                byteOffset += 2;
            }
        }
        else if(codes.byteCount === "8") {
            // Untested
            while(actualbytes >= byteOffset + 8) {
                clipNames.push(hexToString(data.slice(4 + byteOffset * 2,4 + byteOffset * 2 + 16)));
                byteOffset += 8;
            }
        }
        return {clipNames:clipNames}
    }
}

export const IDListing: AmpReturn = {code:"8x14",byteCount:["0","8","A"],returnData: IDListingDecoder};