import net from "net";
import { AmpCommand } from "./AmpCommand";
import { AmpReturn, CommandReturn } from "./AmpReturn";
import { ACK, ERR, NAK } from "./Returns";
import { zeroPad } from "./encodeUtils";
import { stringify } from "querystring";

export class AmpChannel {
    constructor(host:string,port: number,channel?: string) {
        this.host = host;
        this.port = port;
        this.channel = channel;
    }

    open() :void {
        const callback = async () => {
            if(this.channel === undefined || this.channel === "") {
                const buffer = await this.send("CRAT0014");
                if(buffer.toString() === ACK.code)
                    this.crat_open = true;
            }
            else {
                const length = this.channel.length;
                const buffer = await this.send(`CRAT${zeroPad(length + 3,4)}2${zeroPad(length,2)}${this.channel}`);
                if(buffer.toString() === ACK.code)
                    this.crat_open = true;
            }
        }
        this.socket.connect({port:this.port,host:this.host},callback);
        this.socket.on("error",(err) => {
            console.log(err);
            this.crat_open = false;
        })
    }

    close() : void {
        if(this.crat_open) {
            this.send("STOP0000");
            this.socket.end();
        }
    }

    send(command:string): Promise<Buffer> {
        return this.sendTCP(command);
    }

    async sendCommand(command:AmpCommand, data?:{byteCount?:string,commandCode?:string,data?:any}) : Promise<CommandReturn> {
        if(this.crat_open) {
            let cmd = this.replaceByteCountCommandCode(command,data?.byteCount,data?.commandCode);
            cmd = cmd + this.encodeSendData(command,data);
            //cmd =  cmd + this.generateChecksum(cmd);
            const buffer = await this.send(`CMDS${zeroPad(cmd.length,4)}${cmd}`);
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
        throw "Amp Channel not open";
    }

     private encodeSendData(command: AmpCommand,data?:{byteCount?:string,commandCode?:string,data?:any}) : string {
        return command.sendData?.encode(data?.data,data?.byteCount,data?.commandCode) || "";
     }

    private sendTCP(command:string): Promise<Buffer> {
        return new Promise<Buffer>((resolve) => {
        this.socket.write(command + "\n",() => {
            this.socket.once('data',(buffer:Buffer) => {
                resolve(buffer);
            })
        });});
    }

    private checkByteCountCommandCode (command:AmpReturn,code:string): boolean {
        Array.from(code).forEach((char:String,index:number) => {
            const cchar = command.code.at(index);
            if(cchar === "x") if(!command.byteCount?.find(element => element === char)) return false;
            if(cchar === "y") if(!command.commandCode?.find(element => element === char)) return false;
            else if(cchar !== char) return false; 
        })
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
}