import type {Block, Dimension, Entity, EntityQueryOptions, Player, Vector3} from '@minecraft/server'
import {SimulatedPlayer} from '@minecraft/server-gametest'
import SIGN from './YumeSignEnum'


// getEntitiesFromViewDirection
export const getSimPlayer = {
    // only one
    formView: (e:Entity,maxDistance=16):SimulatedPlayer=>(<SimulatedPlayer><unknown>e.getEntitiesFromViewDirection({maxDistance}).find(({entity}) => entity.hasTag(SIGN.YUME_SIM_SIGN))?.entity),

}


// function getEntitiesNear(who:Entity|Block,maxDistance:number,defEntityQueryOptions:EntityQueryOptions){
//     const EQO : EntityQueryOptions = {}//new EntityQueryOptions()
//     EQO.maxDistance = maxDistance
//     EQO.location    = who.location
//     EQO.excludeTypes= ["minecraft:player","minecraft:arrow","minecraft:xp_orb","minecraft:item"]
//     EQO.closest   = 1
//     Object.assign(EQO,defEntityQueryOptions)
//     const entities = who.dimension.getEntities(EQO)
//     const targets = []
//     for(const entity of entities)targets.push(entity)
//     return targets
// }
// function getPlayerNear(who:Entity|Block,maxDistance:number,defEntityQueryOptions:EntityQueryOptions){
//     const EQO: EntityQueryOptions = {}//new EntityQueryOptions();
//     EQO.maxDistance = maxDistance;                                                               ;;"距离";;
//     EQO.location    = who.location;  //new Location(逻辑主体.location.x,逻辑主体.location.y,逻辑主体.location.z);                                                  ;;"中心坐标-ri泥god";;
//     // EQO.excludeTypes= ["minecraft:arrow","minecraft:xp_orb","minecraft:item"];                                              ;;"排除掉的实体类型";;
//     EQO.closest   = 1;
//     EQO.excludeTags = [SIGN.YUME_SIM_SIGN]
//     Object.assign(EQO,defEntityQueryOptions)
//     const entities = who.dimension.getEntities(EQO)
//     const targets = []
//     for(const entity of entities)targets.push(entity)
//     return targets
// }

export function getEntitiesNear(location:Vector3, dimension:Dimension, maxDistance:number, Options={}){
    const entityQueryOptions:EntityQueryOptions = {}//new EntityQueryOptions()
    entityQueryOptions.maxDistance = maxDistance
    entityQueryOptions.location    = location
    entityQueryOptions.excludeTypes= ["minecraft:player","minecraft:arrow","minecraft:xp_orb","minecraft:item"]
    entityQueryOptions.closest   = 1
    Object.assign(entityQueryOptions,Options)
    return dimension.getEntities(entityQueryOptions)
}
export function getPlayerNear(who:Entity|Block, maxDistance:number, defEntityQueryOptions:EntityQueryOptions):Player[] {
    const entityQueryOptions: EntityQueryOptions = {}//new EntityQueryOptions()
    entityQueryOptions.maxDistance = maxDistance
    entityQueryOptions.location    = who.location
    // entityQueryOptions.excludeTypes= ["minecraft:arrow","minecraft:xp_orb","minecraft:item"]
    entityQueryOptions.closest   = 1
    entityQueryOptions.excludeTags = [SIGN.YUME_SIM_SIGN]
    Object.assign(entityQueryOptions,defEntityQueryOptions)
    const entities = who.dimension.getPlayers(entityQueryOptions)
    const targets:Player[] = []
    for(const entity of entities)targets.push(entity)
    return targets
}