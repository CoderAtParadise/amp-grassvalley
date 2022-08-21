import { AmpReturn, ReturnDataDecoder } from "../AmpReturn.js";
import { hexToNumber } from "../decodeUtils.js";

const IDCountDecoder: ReturnDataDecoder<{ count: number }> = {
    decode: (data: string) => {
        const actualbytes = hexToNumber(data.slice(0, 4));
        const count = hexToNumber(data.slice(4, 4 + 2 * actualbytes));
        return { count: count };
    }
};

export const IDCount: AmpReturn = { code: "8226", returnData: IDCountDecoder };
