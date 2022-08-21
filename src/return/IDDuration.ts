import { AmpReturn, ReturnDataDecoder } from "../AmpReturn.js";
import { decodeTimecode } from "../decodeUtils.js";

export const IDDurationDecoder: ReturnDataDecoder<{ timecode: string }> = {
    decode: (data: string, codes:{byteCount?: string}) => {
        if (codes.byteCount === "4") return { timecode: decodeTimecode(data) };
        return { timecode: "--:--:--:--" };
    }
};

export const IDDuration: AmpReturn = {
    code: "8x17",
    byteCount: ["0", "4"],
    returnData: IDDurationDecoder
};
