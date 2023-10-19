import { SimulatedPlayerList, testWorldLocation } from '../main';
import { CommandRegistry } from '../../lib/yumeCommand/CommandRegistry';
import { getSimPlayer } from '../../lib/xboyPackage/Util';
import { system, Vector } from "@minecraft/server";
export const BreakBlockSimulatedPlayerList = new Set();
const commandRegistry = new CommandRegistry();
const noArgs = ({ args, entity, isEntity }) => {
    if (args.length !== 1)
        return;
    if (!isEntity)
        return;
    const SimPlayer = getSimPlayer.formView(entity);
    if (!SimPlayer)
        return;
    for (const i in SimulatedPlayerList)
        if (SimulatedPlayerList[i] === SimPlayer)
            BreakBlockSimulatedPlayerList.add(i);
    // console.error('[假人]内置插件'+'假人挖掘'+'执行成功')
};
commandRegistry.registerCommand('假人挖掘', noArgs);
world.afterEvents.chatSend.subscribe(({ message, sender }) => {
    // const cmdArgs = CommandRegistry.parse(message)
    // if(commandRegistry.commandsList.has(cmdArgs[0]))
    //     commandRegistry.executeCommand(cmdArgs[0],{entity:sender,isEntity:true,args:cmdArgs})
    commandRegistry.execute(message, { entity: sender, isEntity: true });
});
// task
const breaks = () => {
    // TEST
    // for (let simulatedPlayerListKey in SimulatedPlayerList) {
    //
    //     const blockLocation = SimulatedPlayerList[simulatedPlayerListKey].getBlockFromViewDirection({maxDistance: 4})?.block?.location
    //     if (blockLocation)
    //         SimulatedPlayerList[simulatedPlayerListKey].breakBlock(Vector.subtract(blockLocation, testWorldLocation))
    //
    // }
    BreakBlockSimulatedPlayerList.forEach((simIndex) => {
        const blockLocation = SimulatedPlayerList[simIndex].getBlockFromViewDirection({ maxDistance: 4 })?.block?.location;
        if (blockLocation)
            SimulatedPlayerList[simIndex].breakBlock(Vector.subtract(blockLocation, testWorldLocation));
    });
};
system.runInterval(breaks, 0);
// console.error('[假人]内置插件'+commandName+'加载成功')
