import { AmpReturn } from "./AmpReturn";

export interface CommandData<T> {
    data: T;
}

export interface SendData<T> {
    encode:(    sendCode?: string,
        commandCode?: string) => [string,number];
}

export interface AmpCommand {
    code:string;
    byteCount?: string[];
    commandCode?: string[];
    sendData?: SendData<any>[];
    loopingSendData?: boolean;
    validReturns: AmpReturn[];
}