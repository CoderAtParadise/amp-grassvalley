import { AmpCommand } from "./AmpCommand";
import { ACK, IDListing, TimeUserBits } from "./Returns";
import { CurrentTimeSenseSendData, InPresetEncoder, OptionalTimecodeEncoder } from "./SendDataEncoders";

export const Play: AmpCommand = {
    code: "2x01",
    byteCount: ["0","4"],
    sendData: OptionalTimecodeEncoder,
    validReturns: [ACK]
}


export const Stop: AmpCommand = {
    code: "2x00",
    byteCount: ["0","4"],
    sendData: OptionalTimecodeEncoder,
    validReturns: [ACK]
}

export const InPreset: AmpCommand = {
    code: "4x14",
    byteCount: ["0","2","4","8","C","A","E"],

    sendData: InPresetEncoder,
    validReturns:[ACK]
}

export const Eject: AmpCommand = {
    code: "200F",
     validReturns: [ACK]
}

export const ListFirstID: AmpCommand = {
    code: "Ax14",
    byteCount: ["0","2"],
    validReturns: [IDListing]
}

export const ListNextID: AmpCommand = {
    code: "Ax15",
    byteCount:  ["0","1"],
    validReturns: [IDListing]
}

// export const IDStatusRequest: AmpCommand = {
//     code: "Ax18",
//     byteCount:["8","A"],
//     validReturns:
// }

export const CurrentTimeSense: AmpCommand = {
    code: "610C",
    sendData: CurrentTimeSenseSendData,
    validReturns: [TimeUserBits]
}