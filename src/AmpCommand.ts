import { AmpReturn } from "./AmpReturn.js";

export interface SendDataEncoder<DataType> {
    encode: (
        data: DataType,
        codes: { byteCount?: string; commandCode?: string }
    ) => string;
}

export type AmpCommand = {
    code: string;
    byteCount?: string[];
    commandCode?: string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendData?: SendDataEncoder<any>;
    validReturns: AmpReturn[];
}
