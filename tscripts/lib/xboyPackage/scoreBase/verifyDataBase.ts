import {ScoreboardObjective, world} from '@minecraft/server'
import   scoreBase      from './rw'

let ScoreBaseSnapshot = <ScoreboardObjective[]>scoreBase.getObject()

const checkScoreObjectExist = (ScoreObjectName : string) : boolean =>  !!Array.from(ScoreBaseSnapshot).find(ScoreObject=>ScoreObjectName === ScoreObject.id)

const verify = function(){
    ScoreBaseSnapshot = <ScoreboardObjective[]>scoreBase.getObject();
    ['##FlashPlayer##'].forEach(_=>
        checkScoreObjectExist(_) || scoreBase.newObjectAsync(_).displayName
    )

    world.scoreboard.getObjective('##FlashPlayer##').hasParticipant('##currentPID') || scoreBase.setPoints('##FlashPlayer##','##currentPID',1)


}

export default verify