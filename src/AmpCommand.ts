import { AmpReturn } from "./AmpReturn";

export interface SendData<T> {
    optional: boolean
    encode: (value: T, sendCode?: string, commandCode?: string) => [string,number];
}

export interface AmpCommand {
    code:string;
    byteCount?: string[];
    commandCode?: string[];
    sendData?: SendData<any>[];
    loopingSendData?: boolean;
    validReturns: AmpReturn[];
}