import { AmpChannel } from "./AmpChannel.js";
import { AmpCommand } from "./AmpCommand.js";
import { CommandReturn, returnCodeMatches } from "./AmpReturn.js";
import * as Command from "./command/index.js";
import * as Return from "./return/index.js";

export { AmpChannel, Command, Return, returnCodeMatches };

export type { AmpCommand, CommandReturn };
