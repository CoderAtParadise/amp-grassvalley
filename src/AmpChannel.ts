import net from "net";
import { AmpCommand } from "./AmpCommand.js";
import { AmpReturn, CommandReturn } from "./AmpReturn.js";
import { ACK, ERR, NAK } from "./Returns.js";
import { zeroPad } from "./encodeUtils.js";
import { ConditionalDeferred } from "./ConditionalDeferred.js";

export class AmpChannel {
    constructor(host:string,port: number,channel?: string) {
        this.host = host;
        this.port = port;
        this.channel = channel;
    }

    async open(retryHandler: () => Promise<boolean>) : Promise<boolean> {
        return new Promise<boolean>((res) => {
        const callback = async () => {
            if(this.channel === undefined || this.channel === "") {
                const buffer = await this.send("CRAT0014",() => true);
                if(buffer.toString() === ACK.code)
                    this.crat_open = true;
                    res(true);
            }
            else {
                const length = this.channel.length;
                const buffer = await this.send(`CRAT${zeroPad(length + 3,4)}2${zeroPad(length,2)}${this.channel}`,() => true);
                if(buffer.toString() === ACK.code)
                    this.crat_open = true;
                    res(true);
            }
        }
        this.socket.connect({port:this.port,host:this.host},callback);
        this.socket.on("error",(err) => {
            console.log(err);
            this.crat_open = false;
            res(false);
        });

        this.socket.on("close",(err) => {
            if(!this.shutdown && !err) {
                console.log("Hello");
                this.crat_open = false;
                retryHandler();
                res(false);
            }
        });

        this.socket.on("data",(buffer:Buffer) => {
            for(let i = 0; i < this.promises.length; i++) {
                const promise = this.promises[i];
                const resolve = promise.canResolve(buffer);
                if(resolve) {
                    promise.resolve!(buffer);
                    this.promises.splice(i,1);
                    break;
                }
            }
        });
    });
    }

    isOpen(): boolean {
        return this.crat_open;
    }

    close(restart:boolean) : void {
        if(this.crat_open) {
            this.send("STOP0000",() => true);
            this.socket.end();
            if(!restart)
            this.shutdown = true;
        }
    }

    send(command:string,canResolve:(buffer:Buffer) => boolean): Promise<Buffer> {
        return this.sendTCP(command,canResolve);
        
    }

    async sendCommand(command:AmpCommand, data?:{byteCount?:string,commandCode?:string,data?:any}) : Promise<CommandReturn> {
        if(this.crat_open) {
            let cmd = this.replaceByteCountCommandCode(command,data?.byteCount,data?.commandCode);
            cmd = cmd + this.encodeSendData(command,data);
            //cmd =  cmd + this.generateChecksum(cmd);
            const buffer = await  this.send(`CMDS${zeroPad(cmd.length,4)}${cmd}`,(buffer:Buffer) => {
                const strbuffer = buffer.toString();
                const code = strbuffer.slice(0,4);
                if(code === NAK.code || code === ERR.code) return true;
                const ret = command.validReturns.find((value:AmpReturn) => this.checkByteCountCommandCode(value,code));
                if(ret !== undefined)
                    return true;
                return false;
            });
                return new Promise<CommandReturn>((resolve) => {
                    const strbuffer = buffer.toString();
                    const code = strbuffer.slice(0,4);
                    const dataStr = strbuffer.slice(4);
                    if(code === NAK.code || code === ERR.code) resolve({code: strbuffer});
                    const ret = command.validReturns.find((value:AmpReturn) => this.checkByteCountCommandCode(value,code));
                    if(ret?.returnData) {
                        const data = ret.returnData.decode(dataStr,code.at(1)!,code.at(3)!) ;
                         resolve({code:code,data:data});
                    }
                    resolve({code:code});
            });
        }
        return new Promise((res) =>res({code: "-1"}));
    }

     private encodeSendData(command: AmpCommand,data?:{byteCount?:string,commandCode?:string,data?:any}) : string {
        return command.sendData?.encode(data?.data,data?.byteCount,data?.commandCode) || "";
     }

    private sendTCP(command:string,canResolve: (buffer:Buffer) => boolean): Promise<Buffer> {
        this.socket.write(command + "\n");
        const deferred = this.promises[this.promises.push(new ConditionalDeferred<Buffer>(canResolve)) - 1];
        return deferred.promise;
    }

    private checkByteCountCommandCode (command:AmpReturn,code:string): boolean {
        for(let i =0; i < code.length; i++) {
            const char = code.at(i);
            const cchar = command.code.at(i);
            if (cchar === "x") {if(!command.byteCount?.find(element => element === char || element === char?.toUpperCase())) return false;}
            else if(cchar === "y") {if(!command.commandCode?.find(element => element === char || element === char?.toUpperCase())) return false;}
            else if(cchar !== char && cchar !== char?.toUpperCase()) return false; 
    }
        return true;
    }

    private replaceByteCountCommandCode(
        command: AmpCommand | AmpReturn,
        byteCount?:string,
        commandCode?: string,
    ): string {
        let out: string = command.code 
        if (command.byteCount?.find(element => element === byteCount as string))
            out = out.replace("x", byteCount as string);
        if (command.commandCode?.find(element => element === commandCode as string))
            out = out.replace("x", commandCode as string);
        return out;
    }

    private generateChecksum(command:string) {
        let sum = 0x00;
        const data = command
        while(data != "") {
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