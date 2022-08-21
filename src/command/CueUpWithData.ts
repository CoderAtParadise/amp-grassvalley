import { AmpCommand, SendDataEncoder } from "../AmpCommand.js";
import { reverseTimecode } from "../encodeUtils.js";
import { ACK } from "../return/ACK.js";

export const CueUpWithDataEncoder: SendDataEncoder<{
    timecode?: string;
    clipName?: string;
}> = {
    encode: (
        data: { timecode?: string; clipName?: string },
        codes: { byteCount?: string }
    ) => {
        if (codes.byteCount === "4")
            return `${reverseTimecode(data.timecode || "00:00:00:00")}`;
        else if (codes.byteCount === "8") return `${data.clipName || ""}`;
        else if (codes.byteCount === "C")
            return `${reverseTimecode(data.timecode || "00:00:00:00")}${
                data.clipName || ""
            }`;
        else return "";
    }
};

export const CueUpWithData: AmpCommand = {
    code: "2x31",
    byteCount: ["0", "4", "8", "C"],
    sendData: CueUpWithDataEncoder,
    validReturns: [ACK]
};
