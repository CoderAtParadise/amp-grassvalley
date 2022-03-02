export interface ReturnDataDecoder<T> {
    decode:(data:string,byteCount:string,commandCode:string) => T;
}

export interface CommandReturn {
    code: string;
    data?: any;
}

export interface AmpReturn {
    code: string;
    byteCount?: string[];
    commandCode?: string[];
    returnData?: ReturnDataDecoder<any>;
    loopingReturnData?:boolean;
}