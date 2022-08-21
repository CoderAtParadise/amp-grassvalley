export interface ReturnDataDecoder<T> {
    decode:(data:string,codes:{byteCount?:string,commandCode?:string}) => T;
}

export type CommandReturn = {
    code: string;
    data?: unknown;
}

export type AmpReturn = {
    code: string;
    byteCount?: string[];
    commandCode?: string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    returnData?: ReturnDataDecoder<any>;
    loopingReturnData?:boolean;
}