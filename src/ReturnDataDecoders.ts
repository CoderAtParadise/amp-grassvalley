// import { ReturnDataDecoder } from "./AmpReturn.js";
// import { decodeTimecode, getBit, hexToBits, hexToNumber, hexToString } from "./decodeUtils.js";

// export const TimeUserBitsDecoder : ReturnDataDecoder<{timecode:string,userBits?:string}> = {
//     decode:(data:string,byteCount:string,commandCode:string) : {timecode:string,userBits?:string} => {
//         if(commandCode === "D") return {timecode:"--:--:--:--"};
//         return {timecode:decodeTimecode(data)};
//     }
// }

// export const IDDecoder: ReturnDataDecoder<{name:string}> = {
//     decode:(data:string,byteCount:string) => {
//         if(byteCount === "2") {
//             const charCount = parseInt(data.slice(4,8),16);
//             const chars = data.slice(8,8 + charCount * 2);
//             return {name:hexToString(chars)}
//         }
//         return {name:"no clip loaded"};
//     }
// }

// export const IDDurationDecoder: ReturnDataDecoder<{timecode:string}> = {
//     decode:(data:string,byteCount:string) => {
//         if(byteCount === "4")
//             return {timecode:decodeTimecode(data)};
//         return  {timecode:"--:--:--:--"}
//     }
// }

// export const IDCountDecoder: ReturnDataDecoder<{count:number}> = {
//     decode:(data:string,byteCount:string,commandCode:string) => {
//         const actualbytes = hexToNumber(data.slice(0,4));
//         const count = hexToNumber(data.slice(4,4 + 2 * actualbytes));
//         return {count:count};
//     }
// }

// export const IDListingDecoder: ReturnDataDecoder<{clipNames:string[]}> = {
//     decode:(data:string,byteCount:string,commandCode:string) => {
//         const clipNames: string[] = [];
//         const actualbytes = hexToNumber(data.slice(0,4));
//         let byteOffset = 2;
//         if(byteCount === "A" || byteCount === "a") {
//             let clipNameLength = hexToNumber(data.slice(4,4 + byteOffset * 2))
//             while(actualbytes >= byteOffset + clipNameLength) {
//                 clipNames.push(hexToString(data.slice(4 + byteOffset * 2,4 + byteOffset * 2 + clipNameLength * 2)));
//                 byteOffset += clipNameLength;
//                 clipNameLength = hexToNumber(data.slice(4 + byteOffset * 2,4 + (byteOffset + 2) * 2));
//                 byteOffset += 2;
//             }
//         }
//         else if(byteCount === "8") {
//             // Untested
//             while(actualbytes >= byteOffset + 8) {
//                 clipNames.push(hexToString(data.slice(4 + byteOffset * 2,4 + byteOffset * 2 + 16)));
//                 byteOffset += 8;
//             }
//         }
//         return {clipNames:clipNames}
//     }
// }

// export const IDStatusDecoder: ReturnDataDecoder<{IdInStorage?:boolean,IDLoaded?:boolean, ReadyForPlayback?:boolean,LoadedInAnotherChannel?:boolean}> = {
//     decode:(data:string,byteCount:string,commandCode:string) =>
//     {
//         // NOOP
//         console.log(data);
//         // switch(hexToBits(data)) {
//         //     case 1:
//         //         return {IdInStorage:true};
//         //     case 2:
//         //         return {IDLoaded:true};
//         // }
//         return {};
//     }
// }

// interface StatusData0 {
//     Local?: boolean;
//     RemoteLocal?: boolean;
//     HardError?: boolean;
//     GeneralError?:boolean;
//     CassetOut?: boolean;
//     Busy?: boolean;
// }

// interface StatusData1 {
//     Play?: boolean;
//     Record?: boolean;
//     FastForward?: boolean;
//     Reweind?: boolean;
//     Eject?: boolean;
//     Stop?: boolean;
//     TensionRelease?: boolean;
//     StandbyOn?: boolean
// }

// interface StatusData2 {
//     CueComplete?: boolean;
//     Still?: boolean;
//     Direction?: boolean;
//     VariablePlay?: boolean;
//     Jog?: boolean;
//     Shuttle?: boolean;
//     ServoLock?: boolean;
// }

// interface StatusData3 {
//     InPreset?: boolean;
//     OutPreset?: boolean;
//     SpecificFolderExists?: boolean;
//     InvalidFolderName?: boolean;
//     FolderDeletionFailed?: boolean;
//     JogReject?: boolean;
//     SourceMissing?: boolean;
//     AutoMode?: boolean;
// }

// interface StatusData4 {
//     Preroll?: boolean;
//     EventScheduleFailed?: boolean;
//     Mute?: boolean;
//     LoopPlaybackMode?: boolean;
//     EEOn?: boolean;
// }

// interface StatusData9 {
//     PreviewInPreset: boolean;
//     PreviewOutPreset: boolean;
//     FolderNotFound: boolean;
//     DiskOverflow: boolean;
//     MetadataNotFound: boolean;
//     ClipsDropped: boolean;
//     OutPresetFailed: boolean;
//     OverwriteClipName: boolean;
// }

// interface StatusDataA {
//     IDNotFound: boolean;
//     TimecodeNotFound: boolean;
//     TransferIDComplete: boolean;
//     TransferIDAbortComplete: boolean;
//     MovieDeleteComplete: boolean;
//     TransferIDFailed: boolean;
//     TransferIDAbortFailed: boolean;
//     MovieDeleteFailed: boolean;
// }

// interface StatusDataD {
//     TimeOfDay: boolean;
//     WidescreenMode: boolean;
//     VITC: boolean;
//     Timer: boolean;
//     LTC: boolean;
//     TapeEnd: boolean;
//     TapeTop: boolean;
// }

// interface StatusDataF {
//     data0: StatusData0;
//     data1: StatusData1;
//     data2: StatusData2;
//     data3: StatusData3;
//     data4: StatusData4;
//     data9: StatusData9;
//     dataA: StatusDataA;
//     dataD: StatusDataD;
// }

// // const StatusData0Decoder: ReturnDataDecoder<StatusData0> = {

// // }

// export const StatusSenseDecoder: ReturnDataDecoder<StatusData0 | StatusData1 | StatusData2 | StatusData3 | StatusData4 | StatusData9 | StatusDataA | StatusDataD | StatusDataF> = {
//     decode:(data:string,byteCount:string,commandCode:string) => {
//         console.log(byteCount);
//         console.log(data);
//         console.log(data.substring(0,2));
//         console.log(getBit(hexToBits(data.substring(0,2)),1));
//         return {};
//     }
// }

// enum CompressionType {
//     MPEG1 = 0,
//     MPEG2 = 1,
//     D10 = 2,
//     DV25 = 3,
//     DV50 = 4,
//     DVCAM = 5,
//     MPEG2HD = 6,
//     DV100 = 7,
//     AVCI = 8
// }

// enum VideoFormat {
//     V_NTSC_525 = 0,
//     V_PAL_625 = 1,
//     V_720_59_94 = 2,
// }

// interface IClipData {
//     creation?:Date;
//     modified?:Date;
//     duration?:string;
//     compression?:CompressionType;
//     format?:VideoFormat;
//     vTracks?: number;
//     aTracks?:number;
//     adTracks?: number;
//     tTracks?:number;
// }

// export const ClipDataDecoder: ReturnDataDecoder<IClipData> = {
//     decode:(data:string,byteCount:string,commandCode:string) => {
//         console.log(data);
//         return {};
//     }
// }