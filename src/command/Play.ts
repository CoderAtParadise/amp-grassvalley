import { AmpCommand } from "../AmpCommand.js";
import { ACK } from "../return/ACK.js";
import { OptionalTimecodeEncoder } from "./encoders/OptionalTimecodeEncoder.js";

export const Play: AmpCommand = {
    code: "2x01",
    byteCount: ["0","4"],
    sendData: OptionalTimecodeEncoder,
    validReturns: [ACK]
}