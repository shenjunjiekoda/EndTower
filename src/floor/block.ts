import { clone, isset } from "../common/util";
import { playerMgr } from "../player/data";
import { getMapData } from "./data";

export interface BlockEvent {
    // 类型
    type: string;
    // 标识符
    id: string;
    // 是否可以通行
    noPass?: boolean;
    // 触发器
    trigger?: string;
    // 其他参数
    data?: any;
    // 动画帧数
    animateFrameCount?: number;
}

export interface Block {
    // x 坐标 | X cordinate
    x: number;
    // y 坐标 | Y cordinate
    y: number;
    // id | ID
    id?: number;
    // 是否可见 | Visible or not
    enable?: boolean;
    // 块事件 | Block event
    event?: BlockEvent;
}

const init_block_events: { [key: number]: BlockEvent } = {
    1: { type: 'terrains', id: 'yellowWall' },
    2: { type: 'terrains', id: 'whiteWall' },
    3: { type: 'terrains', id: 'blueWall' },
    4: { type: 'animates', id: 'star', noPass: true },
    5: { type: 'animates', id: 'lava', noPass: true },
    6: { type: 'animates', id: 'ice' },

    7: { type: 'terrains', id: 'blueShop-left' },
    8: { type: 'terrains', id: 'blueShop-right' },
    9: { type: 'terrains', id: 'pinkShop-left' },
    10: { type: 'terrains', id: 'pinkShop-right' },

    11: { type: 'animates', id: 'lavaNet', noPass: false, trigger: 'passNet' },
    12: { type: 'animates', id: 'poisonNet', noPass: false, trigger: 'passNet' },
    13: { type: 'animates', id: 'weakNet', noPass: false, trigger: 'passNet' },
    14: { type: 'animates', id: 'curseNet', noPass: false, trigger: 'passNet' },
    15: { type: 'animates', id: 'water', noPass: true },

    16: { type: 'terrains', id: 'grass' },
    17: { type: 'terrains', id: 'grass2' },

    18: { type: 'wall', id: 'brownwall' },
    19: { type: 'wall', id: 'redwall' },
    20: { type: 'wall', id: 'pinkwall' },
    69: { type: 'greenwall', id: 'greenwall' },

    21: { type: 'items', id: 'yellowKey' }, // 黄钥匙
    22: { type: 'items', id: 'blueKey' }, // 蓝钥匙
    23: { type: 'items', id: 'redKey' }, // 红钥匙
    24: { type: 'items', id: 'greenKey' }, // 绿钥匙
    25: { type: 'items', id: 'steelKey' }, // 铁门钥匙
    26: { type: 'items', id: 'bigKey' }, // 大黄门钥匙（钥匙盒）
    27: { type: 'items', id: 'redJewel' }, // 红宝石
    28: { type: 'items', id: 'blueJewel' }, // 蓝宝石
    29: { type: 'items', id: 'greenJewel' }, // 绿宝石
    30: { type: 'items', id: 'yellowJewel' }, // 黄宝石
    31: { type: 'items', id: 'redPotion' }, // 红血瓶
    32: { type: 'items', id: 'bluePotion' }, // 蓝血瓶
    33: { type: 'items', id: 'greenPotion' }, // 绿血瓶
    34: { type: 'items', id: 'yellowPotion' }, // 黄血瓶
    35: { type: 'items', id: 'sword1' }, // 铁剑
    36: { type: 'items', id: 'shield1' }, // 铁盾
    37: { type: 'items', id: 'sword2' }, // 银剑
    38: { type: 'items', id: 'shield2' }, // 银盾
    39: { type: 'items', id: 'sword3' }, // 骑士剑
    40: { type: 'items', id: 'shield3' }, // 骑士盾
    41: { type: 'items', id: 'sword4' }, // 圣剑
    42: { type: 'items', id: 'shield4' }, // 圣盾
    43: { type: 'items', id: 'sword5' }, // 神圣剑
    44: { type: 'items', id: 'shield5' }, // 神圣盾
    45: { type: 'items', id: 'encyclopedia' }, // 怪物手册
    46: { type: 'items', id: 'fly' }, // 楼层传送器
    47: { type: 'items', id: 'pickaxe' }, // 破墙镐
    48: { type: 'items', id: 'icePickaxe' }, // 破冰镐
    49: { type: 'items', id: 'bomb' }, // 炸弹
    50: { type: 'items', id: 'centerFly' }, // 中心对称
    51: { type: 'items', id: 'upFly' }, // 上楼器
    52: { type: 'items', id: 'downFly' }, // 下楼器
    53: { type: 'items', id: 'coin' }, // 幸运金币
    54: { type: 'items', id: 'snow' }, // 冰冻徽章
    55: { type: 'items', id: 'cross' }, // 十字架
    56: { type: 'items', id: 'superPotion' }, // 圣水
    57: { type: 'items', id: 'earthquake' }, // 地震卷轴
    58: { type: 'items', id: 'poisonWine' }, // 解毒药水
    59: { type: 'items', id: 'weakWine' }, // 解衰药水
    60: { type: 'items', id: 'curseWine' }, // 解咒药水
    61: { type: 'items', id: 'superWine' }, // 万能药水
    62: { type: 'items', id: 'knife' }, // 屠龙匕首
    63: { type: 'items', id: 'moneyPocket' }, // 金钱袋
    64: { type: 'items', id: 'shoes' }, // 绿鞋
    65: { type: 'items', id: 'hammer' }, // 圣锤
    66: { type: 'items', id: 'bigFly' },
    67: { type: 'items', id: 'wand1' },
    68: { type: 'items', id: 'wand2' },

    81: { type: 'terrains', id: 'yellowDoor', trigger: 'openDoor' }, // 黄门
    82: { type: 'terrains', id: 'blueDoor', trigger: 'openDoor' }, // 蓝门
    83: { type: 'terrains', id: 'redDoor', trigger: 'openDoor' }, // 红门
    84: { type: 'terrains', id: 'greenDoor', trigger: 'openDoor' }, // 绿门
    85: { type: 'terrains', id: 'specialDoor', trigger: 'openDoor' }, // 机关门左
    86: { type: 'terrains', id: 'steelDoor', trigger: 'openDoor' }, // 铁门
    87: { type: 'terrains', id: 'upFloor', noPass: false }, // 上楼梯
    88: { type: 'terrains', id: 'downFloor', noPass: false }, // 下楼梯

    89: { type: 'animates', id: 'portal', noPass: false }, // 传送门
    90: { type: 'animates', id: 'starPortal', noPass: false }, // 星空传送门
    91: { type: 'animates', id: 'upPortal', noPass: false }, // 上箭头
    92: { type: 'animates', id: 'leftPortal', noPass: false }, // 左箭头
    93: { type: 'animates', id: 'downPortal', noPass: false }, // 下箭头
    94: { type: 'animates', id: 'rightPortal', noPass: false }, // 右箭头

    121: { type: 'npcs', id: 'man' },
    122: { type: 'npcs', id: 'woman' },
    123: { type: 'npcs', id: 'thief' },
    124: { type: 'npcs', id: 'fairy' },
    125: { type: 'npcs', id: 'magician' },
    126: { type: 'npcs', id: 'womanMagician' },
    127: { type: 'npcs', id: 'oldMan' },
    128: { type: 'npcs', id: 'child' },
    129: { type: 'npcs', id: 'wood' },
    130: { type: 'npcs', id: 'pinkShop' },
    131: { type: 'npcs', id: 'blueShop' },
    132: { type: 'npcs', id: 'princess' },

    133: { type: 'npcs', id: 'wlt' },
    134: { type: 'npcs', id: 'wt' },
    135: { type: 'npcs', id: 'wrt' },
    136: { type: 'npcs', id: 'wl' },
    137: { type: 'npcs', id: 'wc' },
    138: { type: 'npcs', id: 'wr' },
    139: { type: 'npcs', id: 'wlb' },
    140: { type: 'npcs', id: 'wrb' },
    141: { type: 'npcs', id: 'dlt' },
    142: { type: 'npcs', id: 'dt' },
    143: { type: 'npcs', id: 'drt' },
    144: { type: 'npcs', id: 'dl' },
    145: { type: 'npcs', id: 'dc' },
    146: { type: 'npcs', id: 'dr' },
    147: { type: 'npcs', id: 'dlb' },
    148: { type: 'npcs', id: 'drb' },
    149: { type: 'npcs', id: 'leina' },
    150: { type: 'npcs', id: 'jay' },

    161: { type: 'terrains', id: 'arrowUp', noPass: false }, // 单向上箭头
    162: { type: 'terrains', id: 'arrowDown', noPass: false }, // 单向下箭头
    163: { type: 'terrains', id: 'arrowLeft', noPass: false }, // 单向左箭头
    164: { type: 'terrains', id: 'arrowRight', noPass: false }, // 单向右箭头
    165: { type: 'terrains', id: 'light', trigger: 'changeLight', noPass: false }, // 灯
    166: { type: 'terrains', id: 'darkLight', noPass: true }, // 暗灯
    167: { type: 'terrains', id: 'ski', trigger: 'ski', noPass: false }, // 滑冰
    168: { type: 'terrains', id: 'flower', noPass: false }, // 花
    169: { type: 'terrains', id: 'box', trigger: 'pushBox', noPass: true }, // 箱子
    170: { type: 'terrains', id: 'boxed', trigger: 'pushBox', noPass: true }, // 完成的箱子

    201: { type: 'enemies', id: 'greenSlime' },
    202: { type: 'enemies', id: 'redSlime' },
    203: { type: 'enemies', id: 'blackSlime' },
    204: { type: 'enemies', id: 'slimelord' },
    205: { type: 'enemies', id: 'bat' },
    206: { type: 'enemies', id: 'bigBat' },
    207: { type: 'enemies', id: 'redBat' },
    208: { type: 'enemies', id: 'vampire' },
    268: { type: 'enemies', id: 'vampire2' },
    269: { type: 'enemies', id: 'vampire3' },
    209: { type: 'enemies', id: 'skeleton' },
    210: { type: 'enemies', id: 'skeletonSoilder' },
    211: { type: 'enemies', id: 'skeletonCaptain' },
    212: { type: 'enemies', id: 'ghostSkeleton' },
    213: { type: 'enemies', id: 'zombie' },
    214: { type: 'enemies', id: 'zombieKnight' },
    215: { type: 'enemies', id: 'rock' },
    216: { type: 'enemies', id: 'slimeMan' },
    217: { type: 'enemies', id: 'bluePriest' },
    218: { type: 'enemies', id: 'redPriest' },
    219: { type: 'enemies', id: 'brownWizard' },
    220: { type: 'enemies', id: 'redWizard' },
    221: { type: 'enemies', id: 'yellowGuard' },
    222: { type: 'enemies', id: 'blueGuard' },
    223: { type: 'enemies', id: 'redGuard' },
    224: { type: 'enemies', id: 'swordsman' },
    225: { type: 'enemies', id: 'soldier' },
    226: { type: 'enemies', id: 'yellowKnight' },
    227: { type: 'enemies', id: 'redKnight' },
    228: { type: 'enemies', id: 'darkKnight' },
    229: { type: 'enemies', id: 'blackKing' },
    230: { type: 'enemies', id: 'yellowKing' },
    231: { type: 'enemies', id: 'greenKing' },
    232: { type: 'enemies', id: 'blueKnight' },
    233: { type: 'enemies', id: 'goldSlime' },
    234: { type: 'enemies', id: 'poisonSkeleton' },
    235: { type: 'enemies', id: 'poisonBat' },
    236: { type: 'enemies', id: 'steelRock' },
    237: { type: 'enemies', id: 'skeletonPriest' },
    238: { type: 'enemies', id: 'skeletonKing' },
    239: { type: 'enemies', id: 'skeletonWizard' },
    240: { type: 'enemies', id: 'redSkeletonCaption' },
    241: { type: 'enemies', id: 'badplayer' },
    242: { type: 'enemies', id: 'demon' },
    243: { type: 'enemies', id: 'demonPriest' },
    244: { type: 'enemies', id: 'goldHornSlime' },
    245: { type: 'enemies', id: 'redKing' },
    275: { type: 'enemies', id: 'redKing2' },
    246: { type: 'enemies', id: 'whiteKing' },
    247: { type: 'enemies', id: 'blackMagician' },
    248: { type: 'enemies', id: 'silverSlime' },
    249: { type: 'enemies', id: 'swordEmperor' },
    250: { type: 'enemies', id: 'whiteHornSlime' },
    251: { type: 'enemies', id: 'badPrincess' },
    252: { type: 'enemies', id: 'badFairy' },
    253: { type: 'enemies', id: 'grayPriest' },
    254: { type: 'enemies', id: 'redSwordsman' },
    255: { type: 'enemies', id: 'whiteGhost' },
    256: { type: 'enemies', id: 'poisonZombie' },
    257: { type: 'enemies', id: 'magicDragon' },
    258: { type: 'enemies', id: 'octopus' },
    259: { type: 'enemies', id: 'darkFairy' },
    260: { type: 'enemies', id: 'greenKnight' },
};


export function getBlock(x: number, y: number, id: number | string): Block {
    let enable: boolean | null = null;
    id = String(id);

    if (id.length > 2) {
        if (id.endsWith(":f")) {
            id = id.slice(0, -2);
            enable = false;
        } else if (id.endsWith(":t")) {
            id = id.slice(0, -2);
            enable = true;
        }
    }

    const parsedId = parseInt(id);

    const block: Block = { x, y, id: parsedId };
    if (isset(enable)) {
        block.enable = enable!;
    }

    if (parsedId in init_block_events) {
        block.event = init_block_events[parsedId];
    }

    return block;
}

export function getBlockAtPointOnFloor(x: number, y: number, floorId: number = playerMgr.getFloorId(), needEnable = true): { index: number, block: Block } | null {
    const mapData = getMapData(floorId);

    if (!mapData || !mapData.blocks) {
        console.error(`invalid map data for floorId=${floorId}`);
        return null;
    }

    const blocks = mapData.blocks;
    const index = blocks.findIndex(block => block.x === x && block.y === y && isset(block.event));

    if (index === -1) {
        return null;
    }

    if (needEnable && !blocks[index].enable) {
        return null;
    }

    return { index, block: blocks[index] };
}



export function initBlockInfo(block: Block): void {
    if (isset(block.event)) {
        if (block.event!.type === 'enemies' && !isset(block.event!.trigger)) {
            block.event!.trigger = 'battle';
        }
        if (block.event!.type === 'items' && !isset(block.event!.trigger)) {
            block.event!.trigger = 'getItem';
        }
        if (!isset(block.event!.noPass)) {
            if (['enemies', 'terrains', 'npcs', 'leina', 'jay'].includes(block.event!.type) || block.event!.type.endsWith('wall')) {
                block.event!.noPass = true;
            }
        }
        if (!isset(block.event!.animateFrameCount)) {
            if (['enemies', 'npcs'].includes(block.event!.type)) {
                block.event!.animateFrameCount = 2;
            }
            if (block.event!.type === 'animates') {
                block.event!.animateFrameCount = 4;
            }
        }
    }
}

export function addBlockEvent(block: Block, x: number, y: number, event_input: any): void {
    // console.log('add event for', JSON.stringify(block), x, y, JSON.stringify(event_input));

    if (!isset(event_input)) {
        console.log('no event input');
        return;
    }

    if (!isset(block.event)) {
        console.log('no event for block, set as terrains');
        block.event = { type: 'terrains', id: 'normalBlock', noPass: false };
    }

    let event = clone(event_input);
    if (typeof event_input === 'string') {
        event = { data: [event_input] };
    } else if (Array.isArray(event_input)) {
        event = { data: event_input };
    }

    if (!isset(event.data)) {
        event.data = [];
    }

    if (event.noPass)
        block.event!.noPass = event.noPass;

    if (!isset(block.enable) && event.enable!)
        block.enable = event.enable;

    if (!isset(block.event!.trigger)) {
        block.event!.trigger = event.trigger ? event.trigger : 'action';
    } else if (isset(event.trigger) && event.trigger! != 'checkBlock') {
        block.event!.trigger = event.trigger;
    }

    for (const key in event) {
        if (key !== 'enable' && key !== 'trigger') {
            const clonedValue = clone(event[key]);
            block.event![key as keyof BlockEvent] = clonedValue;
        }
    }
    block.event = clone(block.event);
}

export function addSwitchFloorBlockEvent(floorID: number, block: Block, x: number, y: number, event?: any): void {
    if (!isset(event)) {
        return;
    }
    // console.log('add switch floor for', floorID, block, x, y, event);

    addBlockEvent(block, x, y, { trigger: 'switchFloor', data: event });
}


export function blocksToNumberArray(blockArray: Block[]): number[][] {
    let blocks: number[][] = [];
    for (let x = 0; x < 13; x++) {
        blocks[x] = [];
        for (let y = 0; y < 13; y++) {
            blocks[x].push(0);
        }
    }
    blockArray.forEach(block => {
        if (!isset(block.enable) && !block.enable && isset(block.id)) {
            blocks[block.y][block.x] = block.id!;
        }
    });
    return blocks;
}


