import { AmpCommand } from "./AmpCommand.js";
import { ACK, ClipData, IDCount, IDDuration, IDListing, IDLoaded, IDStatus, ReturnStatusSense, TimeUserBits } from "./Returns.js";
import { ClipDataRequestEncoder, CueUpWithDataEncoder, CurrentTimeSenseSendData, IDDurationEncoder, IDStatusEncoder, InPresetEncoder, ListFirstIDEncoder, ListNextIDEncoder, OptionalTimecodeEncoder, StatusSenseSendData } from "./SendDataEncoders.js";

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

export const PreviewInPreset: AmpCommand = {
    code: "Ax04",
    byteCount: ["0","2","4","8","C","A","E"],
    sendData: InPresetEncoder,
    validReturns:[ACK]
}

export const Eject: AmpCommand = {
    code: "200F",
    validReturns: [ACK]
}

export const IDCountRequest: AmpCommand = {
    code: "A026",
    validReturns: [IDCount]
}

export const ListFirstID: AmpCommand = {
    code: "Ax14",
    byteCount: ["0","2"],
    sendData: ListFirstIDEncoder,
    validReturns: [IDListing]
}

export const ListNextID: AmpCommand = {
    code: "Ax15",
    byteCount:  ["0","1"],
    sendData: ListNextIDEncoder,
    validReturns: [IDListing]
}

export const IDStatusRequest: AmpCommand = {
    code: "Ax18",
    byteCount:["8","A"],
    sendData: IDStatusEncoder,
    validReturns: [IDStatus]
}

export const CurrentTimeSense: AmpCommand = {
    code: "610C",
    sendData: CurrentTimeSenseSendData,
    validReturns: [TimeUserBits]
}

export const StatusSense: AmpCommand = {
    code: "6120",
    sendData: StatusSenseSendData,
    validReturns: [ReturnStatusSense]
}

export const IDLoadedRequest: AmpCommand = {
    code:"A016",
    validReturns: [IDLoaded]
}

export const IDDurationRequest: AmpCommand = {
    code:"A217",
    sendData: IDDurationEncoder,
    validReturns: [IDDuration]
}

export const ClipDataRequest: AmpCommand = {
    code: "AA13",
    sendData: ClipDataRequestEncoder,
    validReturns: [ClipData]
}

export const CueUpWithData: AmpCommand = {
    code: "2x31",
    byteCount: ["0","4","8","C"],
    sendData: CueUpWithDataEncoder,
    validReturns: [ACK]
}