import { AmpCommand } from "../AmpCommand.js";
import { ACK } from "../return/ACK.js";
import { OptionalTimecodeEncoder } from "./encoders/OptionalTimecodeEncoder.js";

export const Stop: AmpCommand = {
    code: "2x00",
    byteCount: ["0", "4"],
    sendData: OptionalTimecodeEncoder,
    validReturns: [ACK]
};
