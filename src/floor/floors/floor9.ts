
import { Floor } from "floor/data";

export const floor9: Floor = {
    floorId: 9,
    title: "main_9",
    transporterEnabled: true,
    quickShopEnabled: true,
    defaultGround: "ground",
    map: [
        [/*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18],
        [/*wall=*/18, 46, 21, 0, /*wall=*/18,/*wall=*/18, /*wall=*/18, 0, 0, 0, /*wall=*/18, 0, /*wall=*/18],
        [/*wall=*/18, 21, 0, 214, 81, 0, 0, 0, /*wall=*/18, 0, 81, 211, /*wall=*/18],
        [/*wall=*/18,/*wall=*/18, 81,/*wall=*/18,/*wall=*/18, 0, /*wall=*/18,/*wall=*/18, /*wall=*/18, 0, /*wall=*/18, 21,/*wall=*/18],
        [/*wall=*/18, 0, 0, 0, /*wall=*/18, 0, /*wall=*/18, 0, 0, 0, /*wall=*/18, 21,/*wall=*/18],
        [/*wall=*/18, 0, 0, 0, 83, 0, /*wall=*/18, 88,/*wall=*/18, 0, /*wall=*/18, 31,/*wall=*/18],
        [/*wall=*/18,/*wall=*/18, 82,/*wall=*/18,/*wall=*/18, 0, /*wall=*/18,/*wall=*/18, /*wall=*/18, 0, /*wall=*/18,/*wall=*/18, /*wall=*/18],
        [/*wall=*/18, 28, 220, 27,/*wall=*/18, 219,/*wall=*/18, 87,/*wall=*/18, 0, /*wall=*/18, 31,/*wall=*/18],
        [/*wall=*/18,/*wall=*/18, 81,/*wall=*/18,/*wall=*/18, 0, 0, 0, 81, 0, /*wall=*/18, 21,/*wall=*/18],
        [/*wall=*/18, 211, 31, 211,/*wall=*/18, /*wall=*/18, 82,/*wall=*/18,/*wall=*/18, 0, /*wall=*/18, 21,/*wall=*/18],
        [/*wall=*/18, 22, 211, 31,/*wall=*/18, 215, 219, 215,/*wall=*/18, 0, 81, 211, /*wall=*/18],
        [/*wall=*/18, 39, 22, 211, 81, 32, 215, 32,/*wall=*/18, 0, /*wall=*/18, 0, /*wall=*/18],
        [/*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18],
    ],
    firstArriveEvents: [

    ],
    pointTriggerEvents: {
    },
    switchFloorEvent: {
        "7,7": { floorId: 10, stairDirection: "downFloor" },
        "7,5": { floorId: 8, stairDirection: "upFloor" },
    },
    postBattleEvent: {},
    postGetItemEvent: {},
    postOpenDoorEvent: {},
    blockCannotMoveDirections: {},
};