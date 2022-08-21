import { AmpCommand, SendDataEncoder } from "../AmpCommand.js";
import { toHex } from "../encodeUtils.js";
import { IDListing } from "../return/IDListing.js";

const ListNextIDEncoder: SendDataEncoder<{ count: number }> = {
    encode: (data: { count: number }) => {
        return toHex(data.count, 2);
    }
};

export const ListNextID: AmpCommand = {
    code: "Ax15",
    byteCount:  ["0","1"],
    sendData: ListNextIDEncoder,
    validReturns: [IDListing]
}