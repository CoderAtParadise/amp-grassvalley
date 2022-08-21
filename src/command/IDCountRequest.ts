import { AmpCommand } from "../AmpCommand.js";
import { IDCount } from "../return/IDCount.js";

export const IDCountRequest: AmpCommand = {
    code: "A026",
    validReturns: [IDCount]
}