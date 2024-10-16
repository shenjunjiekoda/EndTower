
import { Floor } from "floor/data";

export const floor10: Floor = {
    floorId: 10,
    title: "main_10",
    transporterEnabled: true,
    quickShopEnabled: true,
    defaultGround: "ground",
    map: [
        [/*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18],
        [/*wall=*/18, 0, /*wall=*/18, /*wall=*/18, 28, 214,/*wall=*/18, 214, 27,/*wall=*/18, /*wall=*/18, 0, /*wall=*/18],
        [/*wall=*/18, 0, 0, /*wall=*/18, /*wall=*/18, 81,/*wall=*/18, 81,/*wall=*/18, /*wall=*/18, 0, 220, /*wall=*/18],
        [/*wall=*/18, 0, 0, 0, 0, 0, /*wall=*/18, 0, 0, 0, 220, 32,/*wall=*/18],
        [/*wall=*/18, 0, /*wall=*/18, 0, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, 0, /*wall=*/18, /*wall=*/18, /*wall=*/18],
        [/*wall=*/18, 206,/*wall=*/18, 0, 0, 21, 21, 21, 0, 0, /*wall=*/18, 21,/*wall=*/18],
        [/*wall=*/18, 207,/*wall=*/18, 0, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, 81,/*wall=*/18, /*wall=*/18, 21,/*wall=*/18],
        [/*wall=*/18, 206,/*wall=*/18, 0, 86, 0, 88,/*wall=*/18, 0, 81, 207, 0, /*wall=*/18],
        [/*wall=*/18, 0, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, 81,/*wall=*/18, /*wall=*/18, 0, /*wall=*/18],
        [/*wall=*/18, 0, /*wall=*/18, 31, 28, 27,/*wall=*/18, 0, 207, 0, /*wall=*/18, 21,/*wall=*/18],
        [/*wall=*/18, 0, /*wall=*/18, 31, 28, 27, 83, 219,/*wall=*/18, 219,/*wall=*/18, 21,/*wall=*/18],
        [/*wall=*/18, 87,/*wall=*/18, 31, 28, 27,/*wall=*/18, 22,/*wall=*/18, 22,/*wall=*/18, 31,/*wall=*/18],
        [/*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18],
    ],
    firstArriveEvents: [

    ],
    pointTriggerEvents: {
        "4,7": {
            trigger: "action",
            data: [
                { type: "openDoor", loc: [4, 7] }
            ]
        }
    },
    switchFloorEvent: {
        "1,11": { floorId: 11, stairDirection: "downFloor" },
        "6,7": { floorId: 9, stairDirection: "upFloor" },
    },
    postBattleEvent: {},
    postGetItemEvent: {},
    postOpenDoorEvent: {},
    blockCannotMoveDirections: {},
};