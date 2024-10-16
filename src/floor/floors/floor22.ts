
import { Floor } from "floor/data";

export const floor22: Floor = {
    floorId: 22,
    title: "main_22",
    transporterEnabled: true,
    quickShopEnabled: true,
    defaultGround: "ground",
    map: [
        [/*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18],
        [/*wall=*/18, 4, 4, 4, 4, 4, 88, 4, 4, 4, 4, 4,  /*wall=*/18],
        [/*wall=*/18, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4,  /*wall=*/18],
        [/*wall=*/18, 4, 4, 4, 4, 149, 0, 0, 4, 4, 4, 4,  /*wall=*/18],
        [/*wall=*/18, 86, 86, 86, 4, 4, 83, 4, 4, 86, 86, 86, /*wall=*/18],
        [/*wall=*/18, 27, 27, 86, 4, 4, 53, 4, 4, 86, 28, 28, /*wall=*/18],
        [/*wall=*/18, 87, 27, 228, 83, 53, 0, 53, 83, 228, 28, 87, /*wall=*/18],
        [/*wall=*/18, 27, 27, 86, 4, 4, 53, 4, 4, 86, 28, 28, /*wall=*/18],
        [/*wall=*/18, 86, 86, 86, 4, 4, 83, 4, 4, 86, 86, 86, /*wall=*/18],
        [/*wall=*/18, 4, 4, 4, 86, 86, 228, 86, 86, 4, 4, 4,  /*wall=*/18],
        [/*wall=*/18, 4, 4, 4, 86, 32, 32, 32, 86, 4, 4, 4,  /*wall=*/18],
        [/*wall=*/18, 4, 4, 4, 86, 32, 87, 32, 86, 4, 4, 4,  /*wall=*/18],
        [/*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18],
    ],
    firstArriveEvents: [

    ],
    pointTriggerEvents: {
        "5,3": [
            {
                "type": "if", "condition": "item:wand1>0 && item:wand2>0",
                "true": [
                    "\t[蕾娜,leina]\b[down]你已经找齐了魔杖，我可以帮你封印END的大部分力量",
                    { "type": "animate", "name": "yongchang" },
                    { "type": "setBlock", "loc": [5, 2], "number": 133, "floorId": "MT24" },
                    { "type": "setBlock", "loc": [6, 2], "number": 134, "floorId": "MT24" },
                    { "type": "setBlock", "loc": [7, 2], "number": 135, "floorId": "MT24" },
                    { "type": "setBlock", "loc": [5, 3], "number": 136, "floorId": "MT24" },
                    { "type": "setBlock", "loc": [6, 3], "number": 137, "floorId": "MT24" },
                    { "type": "setBlock", "loc": [7, 3], "number": 138, "floorId": "MT24" },
                    { "type": "setBlock", "loc": [5, 4], "number": 139, "floorId": "MT24" },
                    { "type": "setBlock", "loc": [7, 4], "number": 140, "floorId": "MT24" },
                    { "type": "setBlock", "loc": [6, 4], "number": 258, "floorId": "MT24" },
                    "\t[蕾娜,leina]\b[down]看你了！加油！",
                    { "type": "hide", "time": 500 }
                ],
                "false": [
                    "\t[蕾娜,leina]\b[down]我感应到下一层有END的气息，去收集剩下两根魔杖，我就能帮你封印END的部分力量！"
                ]
            },
        ]
    },
    switchFloorEvent: {
        "6,1": { floorId: 21, stairDirection: "downFloor" },
        "1,6": { floorId: 23, loc: [11, 6] },
        "11,6": { floorId: 24, loc: [1, 6] },
        "6,11": { floorId: 25, loc: [6, 1] }
    },
    postBattleEvent: {
    },
    postGetItemEvent: {},
    postOpenDoorEvent: {},
    blockCannotMoveDirections: {},
};