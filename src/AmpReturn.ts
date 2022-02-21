export interface AmpReturn {
    code: string;
    byteCount?: string[];
    commandCode?: string[];
    returnDataCount?: number;
    loopingReturnData?:boolean;
    decode?: (data: string) => void;
}