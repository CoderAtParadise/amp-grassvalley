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

export function returnCodeMatches(
    command: AmpReturn,
    code: string,
    matches?: { byteCount?: string[]; commandCode?: string[] }
): boolean {
    for (let i = 0; i < code.length; i++) {
        const char = code[i];
        const cchar = command.code[i];
        if (cchar === "x") {
            if (!command.byteCount?.includes(char.toUpperCase())) return false;
            if (matches?.byteCount) {
                if (!matches.byteCount.includes(char.toUpperCase()))
                    return false;
            }
        } else if (cchar === "y") {
            if (!command.commandCode?.includes(char.toUpperCase()))
                return false;
            if (matches?.commandCode) {
                if (!matches.commandCode.includes(char.toUpperCase()))
                    return false;
            }
        } else if (cchar !== char.toUpperCase()) return false;
    }
    return true;
}
