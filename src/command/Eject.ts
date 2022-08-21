import { AmpCommand } from "../AmpCommand.js";
import { ACK } from "../return/ACK.js";

export const Eject: AmpCommand = {
    code: "200F",
    validReturns: [ACK]
}