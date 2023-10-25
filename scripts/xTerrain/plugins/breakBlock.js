﻿import { SimulatedPlayerList, testWorldLocation } from '../main';
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
};
commandRegistry.registerCommand('假人挖掘', noArgs);
world.afterEvents.chatSend.subscribe(({ message, sender }) => {
    commandRegistry.execute(message, { entity: sender, isEntity: true });
});
const breaks = () => {
    BreakBlockSimulatedPlayerList.forEach((simIndex) => {
        const blockLocation = SimulatedPlayerList[simIndex].getBlockFromViewDirection({ maxDistance: 4 })?.block?.location;
        if (blockLocation)
            SimulatedPlayerList[simIndex].breakBlock(Vector.subtract(blockLocation, testWorldLocation));
    });
};
system.runInterval(breaks, 0);
