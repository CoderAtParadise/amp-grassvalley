import { AmpCommand, SendDataEncoder } from "../AmpCommand.js";
import { toHex } from "../encodeUtils.js";
import { IDDuration } from "../return/IDDuration.js";

const IDDurationEncoder: SendDataEncoder<{ clipName: string }> = {
    encode: (data: { clipName: string }) => {
        const actualbytes = 2 + data.clipName.length;
        return `${toHex(actualbytes, 4)}${toHex(
            data.clipName.length,
            4
        )}${toHex(data.clipName)}`;
    }
};

export const IDDurationRequest: AmpCommand = {
    code: "A217",
    sendData: IDDurationEncoder,
    validReturns: [IDDuration]
};
