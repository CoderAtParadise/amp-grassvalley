import { AmpCommand, SendDataEncoder } from "../AmpCommand.js";
import { IDListing } from "../return/IDListing.js";

export const ListFirstIDEncoder: SendDataEncoder<unknown> = {
    encode: (_: unknown, codes: { byteCount?: string }) => {
        if (codes.byteCount === "2") return "0000";
        return "";
    }
};

export const ListFirstID: AmpCommand = {
    code: "Ax14",
    byteCount: ["0", "2"],
    sendData: ListFirstIDEncoder,
    validReturns: [IDListing]
};
