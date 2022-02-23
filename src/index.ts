import { AmpChannel } from "./AmpChannel";
import { Play } from "./Commands";

const channel = new AmpChannel("192.168.0.19",3811,"Channel 1");
channel.open();

setTimeout(() => {channel.send("CMDS00041956").then((buffer:Buffer) => {
    console.log(buffer.toString());
})},3000);