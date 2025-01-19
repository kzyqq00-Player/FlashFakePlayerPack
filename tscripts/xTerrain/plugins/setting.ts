import { CommandRegistry } from '../../lib/yumeCommand/CommandRegistry'
import { world, type ScoreboardObjective } from '@minecraft/server'
import scoreBase from '../../lib/xboyPackage/scoreBase/rw'

const commandRegistry: CommandRegistry = new CommandRegistry()

commandRegistry.registerAlias('假人重置编号','假人重置序号')
commandRegistry.registerAlias('假人编号重置','假人重置序号')
commandRegistry.registerAlias('假人序号重置','假人重置序号')
commandRegistry.registerCommand('假人重置序号', ({ entity }) => {

    const setPID = (PID:number=1)=>{
        const __flashPlayer = <ScoreboardObjective>scoreBase.getObject('##FlashPlayer##')

        const value = scoreBase.getPoints(__flashPlayer,'##currentPID')

              __flashPlayer.setScore('##currentPID',PID)

        return value
    }
    const pid = setPID(1)
    entity?.sendMessage('重置成功，重置前为'+pid)


    entity?.sendMessage('以前是以前✋ ，现在是现在✋ ，你要是一直拿以前当作现在✋ ，哥们，你怎么不拿你开新档的时候对比')
})

world.afterEvents.chatSend.subscribe(({message, sender})=>{
    const cmdArgs = CommandRegistry.parse(message)
    if(commandRegistry.commandsList.has(cmdArgs[0]))
        commandRegistry.executeCommand(cmdArgs[0],{entity:sender,isEntity:true,args:cmdArgs})

    if(message==='showshowway'){
        sender.sendMessage(commandRegistry.showList().toString())
    }
})