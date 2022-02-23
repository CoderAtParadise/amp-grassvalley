import { AmpChannel } from "./AmpChannel";
import { AmpCommand } from "./AmpCommand";
import { ACK } from "./Returns";

export const Play: AmpCommand = {
    code: "2x01",
    byteCount: ["0","4"],
    validReturns: [ACK]
}