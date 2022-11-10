import net from "net";
import { AmpCommand } from "./AmpCommand.js";
import { AmpReturn, CommandReturn, returnCodeMatches } from "./AmpReturn.js";
import { zeroPad } from "./encodeUtils.js";
import { ConditionalDeferred } from "./ConditionalDeferred.js";
import { ACK } from "./return/ACK.js";
import { NAK } from "./return/NAK.js";
import { ERR } from "./return/ERR.js";

export class AmpChannel {
    constructor(host: string, port: number, channel?: string) {
        this.host = host;
        this.port = port;
        this.channel = channel;
    }

    async open(retryHandler: () => Promise<boolean>): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            const callback = async () => {
                if (this.channel === undefined || this.channel === "") {
                    const buffer = await this.send("CRAT0014", () => true);
                    if (buffer.toString() === ACK.code) {
                        this.crat_open = true;
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                } else {
                    const length = this.channel.length;
                    const buffer = await this.send(
                        `CRAT${zeroPad(length + 3, 4)}2${zeroPad(length, 2)}${
                            this.channel
                        }`,
                        () => true
                    );
                    if (buffer.toString() === ACK.code) {
                        this.crat_open = true;
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            };
            this.socket.connect({ port: this.port, host: this.host }, () => {
                void callback();
            });
            this.socket.on("error", (err) => {
                console.log(err);
                this.crat_open = false;
                resolve(false);
            });

            this.socket.on("close", (err) => {
                if (!this.shutdown && !err) {
                    this.crat_open = false;
                    resolve(retryHandler());
                }
            });

            this.socket.on("data", (buffer: Buffer) => {
                for (let i = 0; i < this.promises.length; i++) {
                    const promise = this.promises[i];
                    const resolve = promise.canResolve(buffer);
                    if (promise.resolve) {
                        if (resolve) {
                            promise.resolve(buffer);
                            this.promises.splice(i, 1);
                            break;
                        }
                        if (Date.now() - promise.autoResolve >= 500) {
                            promise.resolve(Buffer.from("1112"));
                            this.promises.splice(i, 1);
                        }
                    }
                }
            });
        });
    }

    isOpen(): boolean {
        return this.crat_open;
    }

    close(restart: boolean): void {
        if (this.crat_open) {
            void this.send("STOP0000", () => true);
            this.socket.end();
            if (!restart) this.shutdown = true;
        }
    }

    send(
        command: string,
        canResolve: (buffer: Buffer) => boolean
    ): Promise<Buffer> {
        return this.sendTCP(command, canResolve);
    }
    async sendCommand(
        command: AmpCommand,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data?: { byteCount?: string; commandCode?: string; data?: any }
    ): Promise<CommandReturn> {
        if (this.crat_open) {
            let cmd = this.replaceByteCountCommandCode(
                command,
                data?.byteCount,
                data?.commandCode
            );
            cmd = cmd + this.encodeSendData(command, data);
            //cmd =  cmd + this.generateChecksum(cmd);
            const buffer = await this.send(
                `CMDS${zeroPad(cmd.length, 4)}${cmd}`,
                (buffer: Buffer) => {
                    const strbuffer = buffer.toString();
                    const code = strbuffer.slice(0, 4);
                    if (code === NAK.code || code === ERR.code) return true;
                    const ret = command.validReturns.find((value: AmpReturn) =>
                        returnCodeMatches(value, code)
                    );
                    if (ret !== undefined) return true;
                    return false;
                }
            );
            return new Promise<CommandReturn>((resolve) => {
                const strbuffer = buffer.toString();
                const code = strbuffer.slice(0, 4);
                const dataStr = strbuffer.slice(4);
                if (code === NAK.code || code === ERR.code)
                    resolve({ code: strbuffer });
                const ret = command.validReturns.find((value: AmpReturn) =>
                    returnCodeMatches(value, code)
                );
                if (ret && ret.returnData && code.length === 4) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    const data = ret.returnData.decode(dataStr, {
                        byteCount: code.at(1),
                        commandCode: code.at(3)
                    });
                    resolve({ code: code, data: data });
                }
                resolve({ code: code });
            });
        }
        return new Promise((res) => res({ code: "-1" }));
    }

    private encodeSendData(
        command: AmpCommand,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data?: { byteCount?: string; commandCode?: string; data?: any }
    ): string {
        return (
            command.sendData?.encode(data?.data, {
                byteCount: data?.byteCount,
                commandCode: data?.commandCode
            }) || ""
        );
    }

    private sendTCP(
        command: string,
        canResolve: (buffer: Buffer) => boolean
    ): Promise<Buffer> {
        this.socket.write(command + "\n");
        const deferred =
            this.promises[
                this.promises.push(
                    new ConditionalDeferred<Buffer>(canResolve)
                ) - 1
            ];
        return deferred.promise;
    }

    private replaceByteCountCommandCode(
        command: AmpCommand | AmpReturn,
        byteCount?: string,
        commandCode?: string
    ): string {
        let out: string = command.code;
        if (
            command.byteCount?.find(
                (element) => element === (byteCount as string)
            )
        )
            out = out.replace("x", byteCount as string);
        if (
            command.commandCode?.find(
                (element) => element === (commandCode as string)
            )
        )
            out = out.replace("x", commandCode as string);
        return out;
    }

    private generateChecksum(command: string) {
        const sum = 0x00;
        const data = command;
        while (data != "") {
            // NOOP
        }
        return sum;
    }

    private socket: net.Socket = new net.Socket();
    private host: string;
    private port: number;
    private channel?: string;
    private crat_open: boolean = false;
    private shutdown: boolean = false;
    private promises: ConditionalDeferred<Buffer>[] = [];
}
