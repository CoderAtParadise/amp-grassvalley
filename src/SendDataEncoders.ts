// import { SendDataEncoder } from "./AmpCommand.js";
// import { reverseTimecode, toHex, zeroPad } from "./encodeUtils.js";

// export const IDStatusEncoder: SendDataEncoder<{ clipName: string }> = {
//     encode: (data: { clipName: string }, byteCount?: string) => {
//         if (byteCount === "A") {
//             return `${toHex(data.clipName.length, 4)}${toHex(data.clipName)}`;
//         }
//         return `${toHex(data.clipName)}`;
//     }
// };

// export const StatusSenseSendData: SendDataEncoder<{ byte: string }> = {
//     encode: (data: { byte: string }) => {
//         return `${zeroPad(data.byte, 2)}`;
//     }
// };

// export const ClipDataRequestEncoder: SendDataEncoder<{
//     type: string;
//     clipName: string;
// }> = {
//     encode: (data: { type: string; clipName: string }) => {
//         if (data.type === "C") {
//             const actualbytes = 3 + data.clipName.length;
//             return `${toHex(actualbytes, 4)}0C${toHex(
//                 data.clipName.length,
//                 4
//             )}${toHex(data.clipName)}`;
//         }
//         return "";
//     }
// };
