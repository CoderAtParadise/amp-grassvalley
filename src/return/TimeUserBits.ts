import { AmpReturn, ReturnDataDecoder } from "../AmpReturn.js";
import { decodeTimecode } from "../decodeUtils.js";

export const TimeUserBitsDecoder: ReturnDataDecoder<{
    timecode: string;
    userBits?: string;
}> = {
    decode: (
        data: string,
        codes: { commandCode?: string }
    ): { timecode: string; userBits?: string } => {
        if (codes.commandCode === "D") return { timecode: "--:--:--:--" };
        return { timecode: decodeTimecode(data) };
    }
};

export const TimeUserBits: AmpReturn = {
    code: "7x0y",
    byteCount: ["4", "8"],
    commandCode: ["4", "5", "6", "7", "A", "B", "C", "D"],
    returnData: TimeUserBitsDecoder
};
