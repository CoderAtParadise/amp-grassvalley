export interface ReturnData<T> {
    bytes:number;
    decode:(data:string) => T;
}

export interface CommandReturn {
    code: string;
    data?: any[];
}

export interface AmpReturn {
    code: string;
    byteCount?: string[];
    commandCode?: string[];
    returnData?: ReturnData<any>[];
    loopingReturnData?:boolean;
}