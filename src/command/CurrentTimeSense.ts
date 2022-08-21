import { AmpCommand, SendDataEncoder } from "../AmpCommand.js";
import { zeroPad } from "../encodeUtils.js";
import { TimeUserBits } from "../return/TimeUserBits.js";

type CurrentTimeSenseData = {
    VITCTimeFromSource?: boolean;
    LTCTimeFromSource?: boolean;
    VITCUserBits?: boolean;
    LTCUserBits?: boolean;
    WindowsTime?: boolean;
    Timer1?: boolean;
    VITCTimeFromTimecodeTrack?: boolean;
    LTCTimeFromTimecodeTrack?: boolean;
}

const CurrentTimeSenseEncoder: SendDataEncoder<CurrentTimeSenseData> = {
    encode: (
        data: CurrentTimeSenseData = { LTCTimeFromTimecodeTrack: true }
    ) => {
        let sum = data?.LTCTimeFromTimecodeTrack ? 1 : 0;
        sum = sum + (data?.VITCTimeFromTimecodeTrack ? 2 : 0);
        sum = sum + (data?.Timer1 ? 4 : 0);
        sum = sum + (data?.WindowsTime ? 8 : 0);
        sum = sum + (data?.LTCUserBits ? 16 : 0);
        sum = sum + (data?.VITCUserBits ? 32 : 0);
        sum = sum + (data?.LTCTimeFromSource ? 64 : 0);
        sum = sum + (data?.VITCTimeFromSource ? 128 : 0);
        return zeroPad(sum.toString(16), 2);
    }
};

export const CurrentTimeSense: AmpCommand = {
    code: "610C",
    sendData: CurrentTimeSenseEncoder,
    validReturns: [TimeUserBits]
};
