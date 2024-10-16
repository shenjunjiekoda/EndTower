
import { Floor } from "floor/data";

export const floor24: Floor = {
    floorId: 24,
    title: "main_22R",
    transporterEnabled: false,
    quickShopEnabled: false,
    defaultGround: "ground",
    map: [
        [/*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18],
        [/*wall=*/18, 32, 0, 4, 0, 0, 0, 28, 28, 28, 0, 228,/*wall=*/18],
        [/*wall=*/18, 4, 0, 82, 0, 4, 4, 4, 4, 4, 4, 0,/*wall=*/18],
        [/*wall=*/18, 4, 0, 4, 0, 228, 228, 228, 247, 4, 4, 28,/*wall=*/18],
        [/*wall=*/18, 4, 0, 4, 4, 4, 4, 4, 50, 4, 4, 28,/*wall=*/18],
        [/*wall=*/18, 4, 0, 53, 4, 4, 4, 4, 4, 4, 247, 0,/*wall=*/18],
        [/*wall=*/18, 88, 0, 82, 53, 4, 4, 68, 86, 269, 83, 4,/*wall=*/18],
        [/*wall=*/18, 4, 0, 53, 4, 4, 4, 4, 4, 4, 247, 0,/*wall=*/18],
        [/*wall=*/18, 4, 0, 4, 4, 4, 4, 4, 50, 4, 4, 28,/*wall=*/18],
        [/*wall=*/18, 4, 0, 4, 0, 228, 228, 228, 247, 4, 4, 28,/*wall=*/18],
        [/*wall=*/18, 4, 0, 82, 0, 4, 4, 4, 4, 4, 4, 0,/*wall=*/18],
        [/*wall=*/18, 32, 0, 4, 0, 0, 0, 28, 28, 28, 0, 228,/*wall=*/18],
        [/*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18],
    ],
    firstArriveEvents: [

    ],
    pointTriggerEvents: {
    },
    switchFloorEvent: {
        "1,6": { floorId: 22, loc: [6, 6] },
    },
    postBattleEvent: {
        "9,6": [
            { type: "openDoor", loc: [8, 6] },
        ]
    },
    postGetItemEvent: {},
    postOpenDoorEvent: {},
    blockCannotMoveDirections: {},
};