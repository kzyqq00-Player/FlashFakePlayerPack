import type {SimulatedPlayer} from '@minecraft/server-gametest'

import {
    spawnSimulatedPlayer,
    spawnSimulatedPlayerByNameTag,
    simulatedPlayerEnum,
    spawned as spawnedEvent,
    GetPID,
    initSucceed
} from '../main'
import {CommandInfo, CommandRegistry} from '../../lib/yumeCommand/CommandRegistry'
import {Dimension, Vector3, world} from '@minecraft/server'
import {xyz_dododo} from "../../lib/xboyPackage/xyz_dododo";

const overworld = world.getDimension("overworld");

const commandRegistry: CommandRegistry = new CommandRegistry()
commandRegistry.registerCommand('假人生成')
commandRegistry.registerAlias('假人创建', '假人生成')
commandRegistry.registerAlias('FFPP', '假人生成')
commandRegistry.registerAlias('ffpp', '假人生成')
commandRegistry.registerAlias('Ffpp', '假人生成')

const noArgs = ({args, entity, location}) => {
    if (!initSucceed)
        return entity?.sendMessage('[假人] 插件未初始化完成，请重试')
    if (args.length !== 1) return;
    // TEST with pid input

    // if (isEntity) {
    //     const pid = GetPID()
    //     const __flashPlayer = world.scoreboard.getObjective('##FlashPlayer##')
    //     const simulatedPlayer: SimulatedPlayer = spawnSimulatedPlayer(entity.location, entity.dimension, pid)
    //
    //
    //     simulatedPlayerEnum[pid] = simulatedPlayer
    //     simulatedPlayerEnum[simulatedPlayer.id] = pid
    //
    //     spawnedEvent.trigger({spawnedSimulatedPlayer: simulatedPlayer, PID: pid})
    //     // __flashPlayer.setScore(simulatedPlayer,pid) //Score方案 因为无法为模拟玩家设置分数而放弃
    //     __flashPlayer.setScore(simulatedPlayer.id, pid)
    //
    //     // ScoreBase.AddPoints(<ScoreboardObjective>ScoreBase.GetObject('##FlashPlayer##'),1)
    //     // const pidParticipant = __flashPlayer.getParticipants().find(P=>P.displayName==='##currentPID')
    //
    //     // TEST END
    // } else {
        const pid = GetPID()
        const __flashPlayer = world.scoreboard.getObjective('##FlashPlayer##')
        const simulatedPlayer: SimulatedPlayer = spawnSimulatedPlayer(location, entity, pid)


        simulatedPlayerEnum[pid] = simulatedPlayer
        simulatedPlayerEnum[simulatedPlayer.id] = pid

        spawnedEvent.trigger({spawnedSimulatedPlayer: simulatedPlayer, PID: pid})
        // __flashPlayer.setScore(simulatedPlayer,pid) //Score方案 因为无法为模拟玩家设置分数而放弃
        __flashPlayer.setScore(simulatedPlayer.id, pid)
    // }
}

commandRegistry.registerCommand('假人生成', noArgs)

const withArgs = ({args, entity, location, isEntity}) => {
    if (args[1] !== '批量') return
    if (typeof Number(args[2]) !== 'number') return entity?.sendMessage('[模拟玩家] 命令错误，期待数字却得到 ' + typeof Number(args[2]))

    let count = Number(args[2])
    while (count-- > 0)
        if (isEntity) {
            const pid = GetPID()
            const __flashPlayer = world.scoreboard.getObjective('##FlashPlayer##')
            const simulatedPlayer: SimulatedPlayer = spawnSimulatedPlayer(entity.location, entity.dimension, pid)


            // add simulatedPlayer to SimulatedPlayerList,by ues obj <key,value>
            simulatedPlayerEnum[pid] = simulatedPlayer
            simulatedPlayerEnum[simulatedPlayer.id] = pid

            spawnedEvent.trigger({spawnedSimulatedPlayer: simulatedPlayer, PID: pid})
            __flashPlayer.setScore(simulatedPlayer.id, pid)

        } else {
            const pid = GetPID()
            const __flashPlayer = world.scoreboard.getObjective('##FlashPlayer##')
            const simulatedPlayer: SimulatedPlayer = spawnSimulatedPlayer(location, entity, pid)


            // add simulatedPlayer to SimulatedPlayerList,by ues obj <key,value>
            simulatedPlayerEnum[pid] = simulatedPlayer
            simulatedPlayerEnum[simulatedPlayer.id] = pid

            spawnedEvent.trigger({spawnedSimulatedPlayer: simulatedPlayer, PID: pid})
            __flashPlayer.setScore(simulatedPlayer.id, pid)
        }
}
commandRegistry.registerCommand('假人生成', withArgs)

// #56 参考：
// 假人生成 x y z name 维度序号（数字 0-主世界 1-地狱 2-末地）
const withArgs_xyz_name = ({args, entity}: CommandInfo) => {
    let location: Vector3 = null
    let nameTag: string = null
    if (args[1] === '批量' || args.length < 2) return

    // xyz
    if (args.length >= 2 && args.length <= 3)
        return entity?.sendMessage('[模拟玩家] 命令错误，期待三个坐标数字，得到个数为' + (args.length - 1))
    try {
        const [x, y, z] = args.slice(1, 4)
        const {x: _x, y: _y, z: _z} = entity.location
        const [__x, __y, __z] = xyz_dododo([x, y, z], [_x, _y, _z])
        location = {x: __x, y: __y, z: __z}
        // 好烂，谁来改改
    } catch (e) {
        return entity?.sendMessage('[模拟玩家] 命令错误，期待三个却得到错误的信息 ' + args.join(' '))
    }

    // name
    if (args.length >= 5) {
        try {
            nameTag = args[4]
        } catch (e) {
            return entity?.sendMessage('[模拟玩家] 命令错误，期待文本作为名称却得到 ' + args[4])
        }
    }

    // dimension
    let dimension: Dimension;
    if (args.length >= 6) {
        try {
            dimension = world.getDimension(["overworld", "nether", "the end"][Number(args[5])])
        } catch (e) {
            return entity?.sendMessage('[模拟玩家] 命令错误，期待序号作为维度（0-主世界 1-地狱 2-末地）却得到 ' + args[5])
        }
    }

    const pid = GetPID()
    const __flashPlayer = world.scoreboard.getObjective('##FlashPlayer##')

    const simulatedPlayer: SimulatedPlayer = nameTag ? spawnSimulatedPlayerByNameTag(location, dimension ?? entity?.dimension ?? overworld, nameTag) : spawnSimulatedPlayer(location, dimension ?? entity?.dimension ?? overworld, pid)

    simulatedPlayerEnum[pid] = simulatedPlayer
    simulatedPlayerEnum[simulatedPlayer.id] = pid

    spawnedEvent.trigger({spawnedSimulatedPlayer: simulatedPlayer, PID: pid})
    __flashPlayer.setScore(simulatedPlayer.id, pid)
}
commandRegistry.registerCommand('假人生成', withArgs_xyz_name)

world.afterEvents.chatSend.subscribe(({message, sender}) => {
    const cmdArgs = CommandRegistry.parse(message)
    if (commandRegistry.commandsList.has(cmdArgs[0]))
        commandRegistry.executeCommand(cmdArgs[0], {entity: sender, isEntity: true, args: cmdArgs})

    if (message === 'showshowway') {
        sender.sendMessage(commandRegistry.showList())
    }
})

// console.error('[假人]内置插件chatSpawn加载成功')