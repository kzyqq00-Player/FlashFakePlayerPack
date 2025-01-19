import {
        // Dimension,
        DisplaySlotId,
        Entity,
        ObjectiveSortOrder,
        Scoreboard,
        ScoreboardIdentity,
        ScoreboardObjective,
        world
} from "@minecraft/server";

// const overworld : Dimension = world.getDimension("overworld");
// let xboy;

// xboy = world.scoreboard.getObjective("testObjectName")
// console.log(xboy)

// xboy = world.scoreboard.getObjectives()
// console.log(xboy)

// xboy = world.scoreboard.getParticipants()
// console.log(xboy[1].displayName)



const getScoreBoard    : Scoreboard = world.scoreboard;
//@ts-ignore
const getScoreObject    = ( Objective:ScoreboardObjective | String=undefined) : ScoreboardObjective|ScoreboardObjective[] => typeof Objective === "undefined" ? getScoreBoard.getObjectives() : typeof Objective === "string" ?  getScoreBoard.getObjective(Objective) : Objective ;

// 这是什么玩意
// @ts-ignore
const getScoreParti    = (args: Entity | ScoreboardObjective ) : Entity|ScoreboardIdentity[]=>  args ? (args.dimension?Array.from(getScoreBoard.getParticipants()).find(Participant=>Participant.getEntity()==args):args[0].getParticipants()) : getScoreBoard.getParticipants();
// @ts-ignore
const getScorePoints    = (object : ScoreboardObjective|string,partic: Entity | ScoreboardIdentity | string) : number =>  (<ScoreboardObjective>getScoreObject(object)).getScore(partic);

// @ts-ignore
const assScoreObject    = (ObjName: string) : ScoreboardObjective|undefined=> getScoreObject().find((scoreboard : { id: string; })=>{if(scoreboard .id === ObjName)return true});

// const assScoreParti    = (...args: any[])=>{return args.length === 2 ? args[1].getParticipants().find((participant: { displayName: string;id: number; })=>{if(participant.displayName === args[0])return true}) : getScoreParti().find((participant: { displayName: string; })=>{if(participant.displayName === args[0])return true})};
const assScoreParti    = (participant: Entity | ScoreboardIdentity | string, ScoreObject:ScoreboardObjective)=> ScoreObject.hasParticipant(participant) ;


///scoreboard objectives remove testObjectName
///scoreboard objectives add testObjectName dummy ss
// const DelScoreObjectAsync    = (ObjName: string | ScoreboardObjective)=>{return overworld.runCommand(`scoreboard objectives remove ${(typeof ObjName === typeof "xBoyMinemc") ? ObjName : ObjName.id}`)};
// const NewScoreObjectAsync    = (...args: string[])=>{return overworld.runCommand(`scoreboard objectives add x'x'x'x'x'x'x'x'x'x'x'x'x'x'x'x'x'x'x ${args[0]} ${args[2]||"dummy"} ${args[1]}`)};



// const DelScoreObject_    = (ObjName: string & ScoreboardObjective)=> overworld.runCommand(`scoreboard objectives remove `+ (ObjName?.id || ObjName) );

const delScoreObject    = (objectiveId: ScoreboardObjective | string)=> world.scoreboard.removeObjective(objectiveId);

// const NewScoreObject_    = (ObjName: string,DisplayName:string,dummy:string='dummy')=> overworld.runCommand(`scoreboard objectives add ${ObjName} ${dummy} ${DisplayName}`);

const newScoreObject    = (objectiveId: string, displayName: string=objectiveId)=> getScoreBoard.addObjective(objectiveId, displayName);
//scoreboard objectives setDisplay list ScoreName ascending
//@ts-ignore
const disScoreObject    = (displaySlotId:DisplaySlotId, objective: ScoreboardObjective=undefined, sortOrder: ObjectiveSortOrder=('ascending'&&0))=> objective ? world.scoreboard.setObjectiveAtDisplaySlot(displaySlotId,  {objective,sortOrder}) : world.scoreboard.clearObjectiveAtDisplaySlot(displaySlotId);
// scoreBase

///scoreboard players add "Xboy minemc" testObjectName 3
// const AddScorePointsAsync    = (...args: (string & Entity)[])=>{overworld.runCommand(`scoreboard players add ${args[0].name ? ('"'+ args[0].name +'"') : (args[0].includes('"') ? args[0] : ('"'+args[0]+'"'))} ${(typeof args[1] === typeof "Xboy minemc")?args[1]:('"'+args[1].id+'"')} ${args[2]}`)};
// const SetScorePointsAsync    = (...args: string[])=>{overworld.runCommand(`scoreboard players set ${args[0].name ? ('"'+ args[0].name +'"') : (args[0].includes('"') ? args[0] : ('"'+args[0]+'"'))} ${(typeof args[1] === typeof "Xboy minemc")?args[1]:('"'+args[1].id+'"')} ${args[2]}`)};

// @ts-ignore
// const AddScorePoints_    = (...args: string[])=> overworld.runCommand(`scoreboard players add ${args[0].name ? ('"'+ args[0].name +'"') : (args[0].includes('"') ? args[0] : ('"'+args[0]+'"'))} ${(typeof args[1] === typeof "Xboy minemc")?args[1]:('"'+args[1].id+'"')} ${args[2]}`);


// 不再被推荐和维护
const addScorePoints    = (ScoreObject:ScoreboardObjective|string,  participant: Entity | ScoreboardIdentity | string,  scoreToAdd: number )=> getScoreObject(ScoreObject).addScore(participant,scoreToAdd);



// const SetScorePoints_    = (...args: string[])=>{overworld.runCommand(`scoreboard players set ${args[0].name ? ('"'+ args[0].name +'"') : (args[0].includes('"') ? args[0] : ('"'+args[0]+'"'))} ${(typeof args[1] === typeof "Xboy minemc")?args[1]:('"'+args[1].id+'"')} ${args[2]}`)};

// No longer recommended and maintained
// 不再被推荐和维护
// @ts-ignore
const setScorePoints     = (ScoreObject:ScoreboardObjective|string,  participant: Entity | ScoreboardIdentity | string, score: number): void=>getScoreObject(ScoreObject).setScore(participant,score);

const scoreBase = {
        getObject : getScoreObject,
        getParti : getScoreParti,
        getPoints : getScorePoints,
        assObject : assScoreObject,
        assParti : assScoreParti,
        delObjectAsync : delScoreObject,
        newObjectAsync : newScoreObject,
        delObject : delScoreObject,
        newObject : newScoreObject,
        disObject : disScoreObject,
        addPointsAsync : addScorePoints,
        setPointsAsync : setScorePoints,
        addPoints : addScorePoints,
        setPoints : setScorePoints
}
export default scoreBase;

// const ScoreBase = {
//     getScoreObject : getScoreObject,
//     getScoreParti : getScoreParti,
//     getScorePoints : getScorePoints,
//     assScoreObject : assScoreObject,
//     assScorePartic : assScorePartic,
//     DelScoreObjectAsync : delScoreObject,
//     NewScoreObjectAsync : newScoreObject,
//     delScoreObject : delScoreObject,
//     newScoreObject : newScoreObject,
//     disScoreObject : disScoreObject,
//     AddScorePointsAsync : addScorePoints,
//     SetScorePointsAsync : setScorePoints,
//     addScorePoints : addScorePoints,
//     setScorePoints : setScorePoints
// }
