import { SendDataEncoder } from "../../AmpCommand.js";
import { reverseTimecode, toHex, zeroPad } from "../../encodeUtils.js";

export const InPresetEncoder: SendDataEncoder<{
    clipName: string;
    type?: string;
    timecode?: string;
}> = {
    encode: (
        data: { clipName: string; type?: string; timecode?: string },
        codes: { byteCount?: string }
    ) => {
        let actualbytes = 2;
        switch (codes.byteCount) {
        case "A":
            actualbytes = actualbytes + data.clipName.length;
            return `${toHex(actualbytes, 4)}${zeroPad(
                data.clipName.length,
                4
            )}${toHex(data.clipName)}`;
        case "E":
            actualbytes = actualbytes + data.clipName.length + 1;
            if (data.type === "A") {
                return `${toHex(actualbytes, 4)}0A${zeroPad(
                    data.clipName.length,
                    4
                )}${toHex(data.clipName)}`;
            } else if (data.type === "E") {
                return `${toHex(actualbytes, 4)}0E${zeroPad(
                    data.clipName.length,
                    4
                )}${reverseTimecode(data.timecode || "00:00:00:00")}${toHex(
                    data.clipName
                )}`;
            }
        }
        return "";
    }
};
