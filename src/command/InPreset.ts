import { AmpCommand } from "../AmpCommand.js";
import { ACK } from "../return/ACK.js";
import { InPresetEncoder } from "./encoders/InPresetEncoder.js";



export const InPreset: AmpCommand = {
    code: "4x14",
    byteCount: ["0","2","4","8","C","A","E"],
    sendData: InPresetEncoder,
    validReturns:[ACK]
}