import {world, Entity, ItemUseAfterEvent, Vector3} from "@minecraft/server";
import EventSignal from "./EventSignal";
import type {projectileFiredEvent, projectileFiredEventSignal} from "../../@types/globalThis";
import type {FishingHookDespawnedEvent, FishingHookDespawnedEventSignal} from "../../@types/globalThis";
import {MolangVariableMap, system} from "@minecraft/server";


const projectileFired: projectileFiredEventSignal = new EventSignal<projectileFiredEvent>();
// const projectileDespawned: projectileDespawnedEventSignal = new EventSignal<projectileDespawnedEvent>();
const fishingHookDespawned: FishingHookDespawnedEventSignal = new EventSignal<FishingHookDespawnedEvent>();

const queue = {
    fishingHookDespawned_HookArray: new Map<Entity["id"], Entity>(),
    fishingHookDespawned_TickArray: new Array<Function>(),
    playerFishingArray: new Array<Entity>(),
};

const pos = {}
world.afterEvents.itemUse.subscribe((event: ItemUseAfterEvent) => {
    event.itemStack.typeId === "minecraft:bow"
        ? (
            // world.getDimension("overworld").runCommandAsync("tell @a[tag=xboy] queue.playerFishingArray.push(event.source)=>"+queue.playerFishingArray.push(event.source)),
            // world.getDimension("overworld").runCommandAsync("tell @a[tag=xboy] queue.fishingHookDespawned_HookArray=>"+queue.fishingHookDespawned_HookArray.size)
            queue.playerFishingArray.push(event.source)
        ) : 0
})

const around = (v: number, r: number) => v > -r && v < r;

// const r3 = (o:Vector3,v:number):boolean=>o.x>v||o.x<-v || o.y>v||o.y<-v || o.z>v||o.z<v;

const soso = ({x, y, z}) => ({x: +x.toFixed(2), y: +y.toFixed(2), z: +z.toFixed(2)});

// 相对位差
const div = ({x, y, z}, {x: a, y: b, z: c}) => ({x: x - a, y: y - b, z: z - c})
// 差方 模
const yu = ({x, y, z}, {x: a, y: b, z: c}) => ((x - a) ** 2 + (y - b) ** 2 + (z - c) ** 2)
const me = ({x, y, z}, {x: a, y: b, z: c}, m: number) => ({x: x - a * m, y: y - b * m, z: z - c * m})
const yume = ({x, y, z}, {x: a, y: b, z: c}) => Math.sqrt((x - a) ** 2 + (y - b) ** 2 + (z - c) ** 2)
const r3 = (o: Vector3, _o: Vector3, v: number): boolean => o.x - _o.x < -v || o.x - _o.x > v || o.y - _o.y > v || o.y - _o.y < -v || o.z - _o.z > v || o.z - _o.z < -v;
world.afterEvents.entitySpawn.subscribe(({entity: entity}) => {
    // world.getDimension("overworld").runCommandAsync("tell @a[tag=xboy] size fishingHookDespawned_HookArray=>"+queue.fishingHookDespawned_HookArray.size)

    // entity.runCommandAsync("me "+entity.typeId)
    // entity.runCommandAsync("tell @a[tag=xboy] length playerFishingArray "+queue.playerFishingArray.length)
    let fisher: Entity;
    try {
        if (entity?.typeId === "minecraft:arrow") {
            fisher = queue.playerFishingArray.find(
                playerFishing => {

                    entity.runCommandAsync("tell @a[tag=xboy] length x " + (entity.location.x - playerFishing.location.x - playerFishing.getVelocity().x))
                    entity.runCommandAsync("tell @a[tag=xboy] length y " + (entity.location.y - playerFishing.location.y - playerFishing.getVelocity().y))
                    entity.runCommandAsync("tell @a[tag=xboy] length z " + (entity.location.z - playerFishing.location.z - playerFishing.getVelocity().z))
                    entity.runCommandAsync("tell @a[tag=xboy] ==========================================")

                    around(entity.location.x - playerFishing.location.x - playerFishing.getVelocity().x, 5) // 直 言 不 讳
                    // 这code就是shit我说怎么你了😡
                    around(entity.location.y - playerFishing.location.y - playerFishing.getVelocity().y, 7)
                    around(entity.location.z - playerFishing.location.z - playerFishing.getVelocity().z, 5)
                }
            )
            queue.fishingHookDespawned_HookArray.set(entity.id, fisher);
            pos[entity.id] = [entity.location];
            projectileFired.trigger({HookId: entity.id, Fisher: fisher})
        }
    } catch (error) {
        // world.getDimension("overworld").runCommandAsync("tell @a[tag=xboy] error"+error)
        // world.getDimension("overworld").runCommandAsync("tell @a[tag=xboy] lifetimeState"+entity.location)
        // world.getDimension("overworld").runCommandAsync("tell @a[tag=xboy] error"+entity.dimension.id)
    }
})


system.runInterval(() => {
    //这里清空干嘛的
    // queue.playerFishingArray = [];
    queue.fishingHookDespawned_TickArray.length ? queue.fishingHookDespawned_TickArray.pop()() : 0;

    const fishingHookArray = world.getDimension("overworld").getEntities({type: "minecraft:arrow"})
    const HookIdArray = fishingHookArray.map(Hook => Hook.id)
    // queue.fishingHookDespawned_HookArray.forEach((Fisher,HookId)=>console.error(Fisher,HookId))  //TEST
    // queue.fishingHookDespawned_HookArray.forEach((Fisher, HookId) => HookIdArray.includes(HookId) ? yume(pos[HookId][pos[HookId].length-1],world.getEntity(HookId).location)<0.01 ?console.error('静止',pos[HookId][pos[HookId].length-1].y,world.getEntity(HookId).location.y): (console.error('移动'),pos[HookId].push(world.getEntity(HookId).location)) : (fishingHookDespawned.trigger({ HookId: HookId, Fisher: Fisher, fishingHookDespawned_TickArray: queue.fishingHookDespawned_TickArray }), queue.fishingHookDespawned_HookArray.delete(HookId)))
    queue.fishingHookDespawned_HookArray.forEach((Fisher, HookId) => HookIdArray.includes(HookId) ? yume(pos[HookId][pos[HookId].length - 1], world.getEntity(HookId).location) < 0.01 ? 0 : pos[HookId].push(world.getEntity(HookId).location) : (fishingHookDespawned.trigger({
        HookId: HookId,
        Fisher: Fisher,
        fishingHookDespawned_TickArray: queue.fishingHookDespawned_TickArray
    }),
        queue.fishingHookDespawned_HookArray.delete(HookId)))
    //写完感觉效率逆天，但想了想，能够有几个钩子，这又不是海鲜市场，满池子钩子里没有一 滴水
})

/*
*/
console.error(("#########"))


projectileFired.subscribe(event => {
    console.error("projectileFired")
    world.getDimension("overworld").runCommandAsync("me ##arrow发射\u000aarrow id=>" + event.HookId + "\u000a发起者id=>" + event.Fisher.id);
})

console.error("#########")
fishingHookDespawned.subscribe(event => {
    console.error("projectileFiredDespawned")
    world.getDimension("overworld").runCommandAsync("me ##arrow销毁\u000aarrow id=>" + event.HookId + "\u000a发起者id=>" + event.Fisher.id);
    // 工具人们.forEach(_=> _==undefined?0:_.id===event.Fisher.id?
    event.fishingHookDespawned_TickArray.push(() => {
        console.error('fishingHookDespawned_TickArray', JSON.stringify(pos[event.HookId]))
        // world.getDimension('overworld').runCommand('me pos[event.HookId].length'+pos[event.HookId].length)
        let time = 0;
        for (let i = pos[event.HookId].length - 1, arr = pos[event.HookId]; i > 0; --i) {

            // 两点距离
            let length = yu(arr[i], arr[i - 1]);
            let mou = 0;
            do {
                let l = +mou;
                let t = ++time;
                let _i = i;
                system.runTimeout(() => {
                    world.getDimension('overworld').spawnParticle('minecraft:endrod', me(
                        arr[i],
                        div(arr[i], arr[i - 1]),
                        l
                    ), new MolangVariableMap())
                    // world.getDimension('overworld').runCommand('me ??怎么个事'+JSON.stringify(arr[i])+' '+Number(t)+' '+l+ ' length:'+i+' '+_i)
                }, (t / 30) >> 0)

                // world.getDimension('overworld').spawnParticle('minecraft:endrod',me(
                //     arr[i],
                //     div(arr[i],arr[i-1]),
                //     length
                // ),new MolangVariableMap())

                // world.getDimension('overworld').runCommand('me pos'+
                // JSON.stringify(me(
                //     arr[i],
                //     div(arr[i],arr[i-1]),
                //         length
                // )
                // )+' length:'+length)
            }
            while ((mou += 0.1) < length)

            world.getDimension('overworld').runCommand('me pos[event.HookId].length' + pos[event.HookId].length + ' ' + yu(arr[i], arr[i - 1]))

            // (me(
            //     location,
            //     div(location,蔡[坤-1]),
            //     ((Math.sqrt(坤坤坤))-r)/Math.sqrt(坤坤坤))
            // )


        }

        pos[event.HookId] = undefined
    })
    // :0)
})
export {projectileFired}