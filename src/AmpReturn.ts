export interface ReturnDataDecoder<T> {
    decode: (
        data: string,
        codes: { byteCount?: string; commandCode?: string }
    ) => T;
}

export type CommandReturn = {
    code: string;
    data?: unknown;
};

export type AmpReturn = {
    code: string;
    byteCount?: string[];
    commandCode?: string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    returnData?: ReturnDataDecoder<any>;
    loopingReturnData?: boolean;
};

export function returnCodeMatches(command: AmpReturn, code: string): boolean {
    for (let i = 0; i < code.length; i++) {
        const char = code.at(i);
        const cchar = command.code.at(i);
        if (cchar === "x") {
            if (
                !command.byteCount?.find(
                    (element) =>
                        element === char || element === char?.toUpperCase()
                )
            )
                return false;
        } else if (cchar === "y") {
            if (
                !command.commandCode?.find(
                    (element) =>
                        element === char || element === char?.toUpperCase()
                )
            )
                return false;
        } else if (cchar !== char && cchar !== char?.toUpperCase())
            return false;
    }
    return true;
}
