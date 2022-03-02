import { buffer } from "stream/consumers";
import { AmpChannel } from "./AmpChannel";
import { CommandReturn } from "./AmpReturn";
import { CurrentTimeSense, Play } from "./Commands";

const channel = new AmpChannel("192.168.0.16",3811,"Channel 1");
channel.open();
setTimeout(() => {channel.send("CMDS0006610C01")},3000);
setTimeout(() => {channel.sendCommand(CurrentTimeSense).then((ret:CommandReturn) => {
    console.log(ret.code);
    console.log(ret.data);
    setTimeout(() =>{channel.close()},3000);
})},3000);