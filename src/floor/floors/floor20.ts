
import { Floor } from "floor/data";

export const floor20: Floor = {
    floorId: 20,
    title: "main_20",
    transporterEnabled: true,
    quickShopEnabled: true,
    defaultGround: "ground",
    map: [
        [/*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18],
        [/*wall=*/18, 216, 27, 246, 31, 212, 23, 212, 31, 246, 27, 216,/*wall=*/18],
        [/*wall=*/18, 32, 4, 21, 4, 22, 4, 22, 4, 21, 4, 32, /*wall=*/18],
        [/*wall=*/18, 4, 28, 246, 0, 228, 0, 228, 0, 246, 28, 4,  /*wall=*/18],
        [/*wall=*/18, 31, 4, 21, 4, 0, 88, 0, 4, 21, 4, 31, /*wall=*/18],
        [/*wall=*/18, 212, 22, 228, 0, 0, 0, 0, 0, 228, 22, 212,/*wall=*/18],
        [/*wall=*/18, 23, 4, 0, 4, 0, 4, 0, 4, 0, 4, 23, /*wall=*/18],
        [/*wall=*/18, 212, 22, 228, 0, 0, 0, 0, 0, 228, 22, 212,/*wall=*/18],
        [/*wall=*/18, 31, 4, 21, 4, 0, 87, 0, 4, 21, 4, 31, /*wall=*/18],
        [/*wall=*/18, 4, 28, 246, 0, 228, 0, 228, 0, 246, 28, 4,  /*wall=*/18],
        [/*wall=*/18, 32, 4, 21, 4, 22, 4, 22, 4, 21, 4, 32, /*wall=*/18],
        [/*wall=*/18, 216, 27, 246, 31, 212, 23, 212, 31, 246, 27, 216,/*wall=*/18],
        [/*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18],
    ],
    firstArriveEvents: [
        // { type: "hide", loc: [6, 8] },
    ],
    pointTriggerEvents: {
        "6,8": {
            "enable": false,
            "data": [
                { "type": "switchFloor", "loc": [6, 6], "floorId": 21 }
            ]
        },
    },
    switchFloorEvent: {
        "6,4": { floorId: 19, stairDirection: "upFloor" },
        // "6,8": {floorId: 21, stairDirection: "downFloor"},
    },
    postBattleEvent: {
    },
    postGetItemEvent: {},
    postOpenDoorEvent: {},
    blockCannotMoveDirections: {},
};