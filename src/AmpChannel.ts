import net from "net";
import { resolve } from "path";
import { AmpCommand } from "./AmpCommand";
import { AmpReturn, CommandReturn, ReturnData } from "./AmpReturn";
import { ACK, ERR, NAK } from "./Returns";

export enum Connection {
    TCP = "tcp",
    UDP = "udp"
}

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
                const buffer = await this.send(`CRAT${this.zeroPad(length + 3,4)}2${this.zeroPad(length,2)}${this.channel}`);
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

    async sendCommand(command:AmpCommand, data:{byteCount?:string,commandCode?:string,data:any[]}) : Promise<CommandReturn> {
        if(this.crat_open) {
            let cmd = this.replaceByteCountCommandCode(command,data.byteCount,data.commandCode);
            cmd = cmd + this.encodeSendData(command,data);
            const buffer = await this.send(`CMDS${this.zeroPad(cmd.length,4)}${cmd}`);
                return new Promise<CommandReturn>((resolve) => {
                    const strbuffer = buffer.toString();
                    if(strbuffer === NAK.code || strbuffer === ERR.code) resolve({code: strbuffer})
            });
        }
        throw "Amp Channel not open";
    }

     private encodeSendData(command: AmpCommand,data:{byteCount?:string,commandCode?:string,data:any[]}) : string {
        if(data.data.length === 0)
            return "";
        return "";
     }

    private sendTCP(command:string): Promise<Buffer> {
        return new Promise<Buffer>((resolve) => {
        this.socket.write(command + "\n",() => {
            this.socket.once('data',(buffer:Buffer) => {
                resolve(buffer);
            })
        });});
    }

    private zeroPad(str: number, places: number): string {
        return String(Math.floor(str)).padStart(places, "0");
    }

    private replaceByteCountCommandCode(
        command: AmpCommand,
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

    private socket: net.Socket = new net.Socket(); 
    private host: string;
    private port: number;
    private channel?: string;
    private listeners: Promise<any>[] = [];
    private crat_open: boolean = false;
}