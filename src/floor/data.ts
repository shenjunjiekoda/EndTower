import { floor0 } from "./floors/floor0";
import { floor1 } from "./floors/floor1";
import { floor2 } from "./floors/floor2";
import { floor3 } from "./floors/floor3";
import { floor4 } from "./floors/floor4";
import { floor5 } from "./floors/floor5";
import { floor6 } from "./floors/floor6";
import { floor7 } from "./floors/floor7";
import { floor8 } from "./floors/floor8";
import { floor9 } from "./floors/floor9";
import { floor10 } from "./floors/floor10";
import { floor11 } from "./floors/floor11";
import { floor12 } from "./floors/floor12";
import { floor13 } from "./floors/floor13";
import { floor14 } from "./floors/floor14";
import { floor15 } from "./floors/floor15";
import { floor16 } from "./floors/floor16";
import { floor17 } from "./floors/floor17";
import { floor18 } from "./floors/floor18";
import { floor19 } from "./floors/floor19";
import { floor20 } from "./floors/floor20";
import { floor21 } from "./floors/floor21";
import { floor22 } from "./floors/floor22";
import { floor23 } from "./floors/floor23";
import { floor24 } from "./floors/floor24";
import { floor25 } from "./floors/floor25";
import { floor26 } from "./floors/floor26";
import { addBlockEvent, addSwitchFloorBlockEvent, Block, getBlock, getBlockAtPointOnFloor, initBlockInfo } from "./block";
import { isset, toInt } from "../common/util";
import { playerMgr } from "../player/data";
import { core } from "../common/global";
import { blockingCtx } from "../window/canvas/damage";
import { CANVAS_BLOCK_WIDTH_CNT } from "../common/constants";

export interface Floor {
    // 楼层唯一标识符 | Floor Unique ID
    floorId: number;
    // 楼层标题 | Floor Title
    title: string; // stored in zh.json && en.json
    // 楼层名称 | Floor Name
    name?: string; // stored in zh.json && en.json
    // 是否可以被传送 | Can be transported
    transporterEnabled: boolean;
    // 是否可以快速商店 | Can use quick shop
    quickShopEnabled: boolean;
    // 地面的图块ID | Ground ID
    defaultGround: string;
    // 到达该层后默认播放的BGM | Default BGM when arrive
    arriveBgm?: string;
    // 地图数据 | Map data
    map: number[][]; // CANVAS_BLOCK_WIDTH_CNTxCANVAS_BLOCK_WIDTH_CNT
    // 第一次到达该层的事件 | First arrive event
    firstArriveEvents?: any[];
    // 到达某点触发的事件列表 | Point trigger events
    pointTriggerEvents: Record<string, any>;
    // 楼层转换事件 | Floor switch event
    switchFloorEvent: Record<string, { floorId: number, stairDirection?: string, loc?: number[] }>;
    // 战斗后可能触发的事件列表 | Possible events after battle
    postBattleEvent?: Record<string, any>;
    // 获得道具后可能触发的事件列表 | Possible events after get item
    postGetItemEvent?: Record<string, any>;
    // 开完门后可能触发的事件列表 | Possible events after open door
    postOpenDoorEvent?: Record<string, any>;
    // 每个图块不可通行的方向 | Directions that each block cannot move
    blockCannotMoveDirections?: Record<string, string[]>;
}

let floors: Record<number, Floor> = {};

export function initFloors() {
    floors = {
        0: { ...floor0 },
        1: { ...floor1 },
        2: { ...floor2 },
        3: { ...floor3 },
        4: { ...floor4 },
        5: { ...floor5 },
        6: { ...floor6 },
        7: { ...floor7 },
        8: { ...floor8 },
        9: { ...floor9 },
        10: { ...floor10 },
        11: { ...floor11 },
        12: { ...floor12 },
        13: { ...floor13 },
        14: { ...floor14 },
        15: { ...floor15 },
        16: { ...floor16 },
        17: { ...floor17 },
        18: { ...floor18 },
        19: { ...floor19 },
        20: { ...floor20 },
        21: { ...floor21 },
        22: { ...floor22 },
        23: { ...floor23 },
        24: { ...floor24 },
        25: { ...floor25 },
        26: { ...floor26 }
    };
    console.log('floors inited complete', floors);
}

export function getFloorById(floorId: number = playerMgr.getFloorId()): Floor {
    if (floorId in floors) {
        return floors[floorId];
    }
    throw new Error('floor not found:' + floorId);
}

export function getAllFloorIds(): number[] {
    return Object.keys(floors).map(Number).sort();
}

export function getAllFloors(): Record<number, Floor> {
    return floors;
}

export interface MapData {
    floorId: number;
    title: string;
    transporterEnabled: boolean;
    blocks: Block[];
}

export function loadFloor(floorId: number, map?: number[][]): MapData {
    const floor: Floor = getFloorById(floorId)!;
    // console.log('load current floor: ', floorId, map, floor);

    let data: MapData = {
        floorId: floor.floorId,
        title: floor.title,
        transporterEnabled: floor.transporterEnabled,
        blocks: []
    };
    if (!isset(map)) {
        map = floor.map;
    }
    for (let i = 0; i < CANVAS_BLOCK_WIDTH_CNT; i++) {
        for (let j = 0; j < CANVAS_BLOCK_WIDTH_CNT; j++) {
            let block = getBlock(j, i, map![i][j]);
            initBlockInfo(block);
            addBlockEvent(block, j, i, floor.pointTriggerEvents[j + "," + i]);
            addSwitchFloorBlockEvent(floorId, block, j, i, floor.switchFloorEvent[j + "," + i]);
            if (isset(block.event)) {
                data.blocks.push(block);
            }
        }
    }
    return data;
}

let floorMaps: Record<number, MapData> = {};

export function initFloorMaps() {
    console.log('init floor maps');
    floorMaps = {};
    const floorIds = getAllFloorIds();
    for (let i = 0; i < floorIds.length; i++) {
        const floorId = floorIds[i];
        if (floorId in floorMaps) {
            continue;
        }
        floorMaps[floorId] = { ...loadFloor(floorId) };
    }
}

export function pushBlockToFloor(floorID: number, block: Block) {
    floorMaps[floorID].blocks.push(block);
}

export function getMapData(floorID?: number): MapData {
    if (!isset(floorID)) {
        floorID = playerMgr.getFloorId();
    }
    if (floorID! in floorMaps) {
        return floorMaps[floorID!];
    }
    throw new Error('floor map not found:' + floorID);
}

export function getFloorIdsOfMaps(): number[] {
    return Object.keys(floorMaps).map(id => parseInt(id));
}



export function canMoveDirectly(destX: number, destY: number): boolean {
    if (core.hasFlag('poison'))
        return false;

    let fromX = playerMgr.getPlayerLocX();
    let fromY = playerMgr.getPlayerLocY();

    if (fromX == destX && fromY == destY)
        return false;

    if (isset(getBlockAtPointOnFloor(fromX, fromY)) || blockingCtx.damage[CANVAS_BLOCK_WIDTH_CNT * fromX + fromY] > 0)
        return false;

    // BFS
    let visited = [];
    let queue: number[] = [];
    visited[CANVAS_BLOCK_WIDTH_CNT * fromX + fromY] = true;
    queue.push(CANVAS_BLOCK_WIDTH_CNT * fromX + fromY);

    let directions = [[-1, 0], [1, 0], [0, 1], [0, -1]];
    while (queue.length > 0) {
        let now = queue.shift()!;
        let nowX = toInt(now / CANVAS_BLOCK_WIDTH_CNT), nowY = now % CANVAS_BLOCK_WIDTH_CNT;

        for (let dir in directions) {
            let nx = nowX + directions[dir][0], ny = nowY + directions[dir][1];
            if (nx < 0 || nx >= CANVAS_BLOCK_WIDTH_CNT || ny < 0 || ny >= CANVAS_BLOCK_WIDTH_CNT)
                continue;

            if (visited[CANVAS_BLOCK_WIDTH_CNT * nx + ny] || isset(getBlockAtPointOnFloor(nx, ny)) || blockingCtx.damage[CANVAS_BLOCK_WIDTH_CNT * nx + ny] > 0)
                continue;

            if (nx == destX && ny == destY)
                return true;
            visited[CANVAS_BLOCK_WIDTH_CNT * nx + ny] = true;
            queue.push(CANVAS_BLOCK_WIDTH_CNT * nx + ny);
        }
    }
    return false;
}

export function existTerrain(x: number, y: number, terrainId?: string, floorId?: number): boolean {
    let block = getBlockAtPointOnFloor(x, y, floorId);
    if (!isset(block) || block?.block?.event?.type != 'terrains') {
        return false;
    }
    return !isset(terrainId) || block?.block?.event?.id == terrainId;
}

export function stairExists(x: number, y: number, floorId?: number) {
    let block = getBlockAtPointOnFloor(x, y, floorId);
    return isset(block) && block!.block.event?.type == 'terrains' && (block!.block.event?.id == 'upFloor' || block!.block.event?.id == 'downFloor');
}

export function saveMaps(): Record<number, string> {
    let maps: Record<number, string> = {};
    let floorIds = getFloorIdsOfMaps();
    for (let i = 0; i < floorIds.length; i++) {
        let floorId = floorIds[i];
        maps[floorId] = serializeMap(floorId);
    }
    return maps;
}

export function serializeMap(floorId: number): string {
    return JSON.stringify(floorMaps[floorId]);
}

export function loadMaps(serializedMaps: Record<number, string>) {
    floorMaps = {};
    let floorIds = Object.keys(serializedMaps).map(id => parseInt(id));
    for (let i = 0; i < floorIds.length; i++) {
        let floorId: number = floorIds[i];
        let serializedMap: string = serializedMaps[floorId];
        const jsonObj = JSON.parse(serializedMap);
        floorMaps[floorId] = jsonObj as MapData;
    }
}

export function loadMap(maps: Record<number, string>, floorId: number) {
    return JSON.parse(maps[floorId]) as MapData;
}