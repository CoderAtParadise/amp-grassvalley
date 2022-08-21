import { SendDataEncoder } from "../../AmpCommand.js";
import { reverseTimecode } from "../../encodeUtils.js";

export const OptionalTimecodeEncoder: SendDataEncoder<{ timecode: string }> = {
    encode: (data: { timecode: string }, codes:{byteCount?: string}) => {
        if (codes.byteCount === "4") {
            return reverseTimecode(data.timecode);
        }
        return "";
    }
};
