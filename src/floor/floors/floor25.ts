
import { Floor } from "floor/data";

export const floor25: Floor = {
    floorId: 25,
    title: "main_22D",
    transporterEnabled: false,
    quickShopEnabled: false,
    defaultGround: "ground",
    map: [
        [/*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18],
        [/*wall=*/18, 32, 4, 4, 4, 4, 88, 4, 4, 4, 4, 32, /*wall=*/18],
        [/*wall=*/18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, /*wall=*/18],
        [/*wall=*/18, 4, 82, 4, 4, 26, 82, 26, 4, 4, 82, 4, /*wall=*/18],
        [/*wall=*/18, 0, 0, 0, 4, 4, 26, 4, 4, 0, 0, 0, /*wall=*/18],
        [/*wall=*/18, 0, 4, 228, 4, 4, 4, 4, 4, 228, 4, 0, /*wall=*/18],
        [/*wall=*/18, 0, 4, 228, 4, 4, 4, 4, 4, 228, 4, 0, /*wall=*/18],
        [/*wall=*/18, 31, 4, 228, 4, 4, 85, 4, 4, 228, 4, 31, /*wall=*/18],
        [/*wall=*/18, 31, 4, 247, 66, 4, 86, 4, 66, 247, 4, 31, /*wall=*/18],
        [/*wall=*/18, 31, 4, 4, 4, 4, 269, 4, 4, 4, 4, 31, /*wall=*/18],
        [/*wall=*/18, 0, 4, 4, 4, 247, 83, 247, 4, 4, 4, 0, /*wall=*/18],
        [/*wall=*/18, 228, 0, 32, 32, 0, 4, 0, 32, 32, 0, 228, /*wall=*/18],
        [/*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18],
    ],
    firstArriveEvents: [

    ],
    pointTriggerEvents: {
    },
    switchFloorEvent: {
        "6,1": { floorId: 22, loc: [6, 6] },
        "6,7": { floorId: 26, loc: [6, 11] }
    },
    postBattleEvent: {
        "6,9": [
            { type: "openDoor", loc: [6, 8] },
        ]
    },
    postGetItemEvent: {},
    postOpenDoorEvent: {},
    blockCannotMoveDirections: {},
};