import dgram from "dgram";
import net, { NetConnectOpts } from "net";
import { AmpCommand } from "./AmpCommand";

export enum Connection {
    TCP = "tcp",
    UDP = "udp"
}

export class AmpChannel {
    constructor(host:string,port: number,channel?: string, socketType:Connection = Connection.TCP) {
        this.host = host;
        this.port = port;
        this.channel = channel;
        switch(socketType) {
            case Connection.TCP:
                this.socket = new net.Socket();
                break
            case Connection.UDP:
                this.socket = new dgram.Socket();
        }
    }

    open() : void {
        const callback = () => {
            if(this.channel === undefined || this.channel === "")
                this.send("CRAT0014",() => {});
            else {
                const length = this.channel.length;
                this.send(`CRAT${this.zeroPad(length + 3,4)}2${length}${this.channel}`,() => {})
            }
        }
        if(this.socket as dgram.Socket) (this.socket as dgram.Socket).connect(this.port,this.host,callback);
        if(this.socket as net.Socket) (this.socket as net.Socket).connect({port:this.port,host:this.host},callback);
    }

    close() : void {
        this.send("STOP0000",() => {});
        if(this.socket as dgram.Socket) (this.socket as dgram.Socket).close();
        if(this.socket as net.Socket) (this.socket as net.Socket).end();
    }

    send(command:string, res:(data:string) => void): void {
        if(this.socket as dgram.Socket) this.sendUDP(command,res);
        if(this.socket as net.Socket) this.sendTCP(command,res);
    }

    sendCommand(command:AmpCommand, data:{byteCount?:string,commandCode?:string,data:any[]}): void {
        this.send(`CMD${this.replaceByteCountCommandCode(command,data.byteCount,data.commandCode)}`,(data:string) => {

        });
    }

    private sendTCP(command:string,res:(data:string)=> void): void {
        (this.socket as dgram.Socket).send(command + "\n");
        this.socket.on("data",res);
    }

    private sendUDP(command:string,res:(data:string)=> void): void {
        (this.socket as net.Socket).write(command + "\n");
        this.socket.on("data",res);
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

    private socket: dgram.Socket | net.Socket; 
    private host: string;
    private port: number;
    private channel?: string;
}