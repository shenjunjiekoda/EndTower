
import { Floor } from "floor/data";

export const floor23: Floor = {
    floorId: 23,
    title: "main_22L",
    transporterEnabled: false,
    quickShopEnabled: false,
    defaultGround: "ground",
    map: [
        [/*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18],
        [/*wall=*/18, 228, 0, 27, 27, 27, 0, 0, 0, 4, 0, 32, /*wall=*/18],
        [/*wall=*/18, 0, 4, 4, 4, 4, 4, 4, 0, 82, 0, 4, /*wall=*/18],
        [/*wall=*/18, 27, 4, 4, 247, 228, 228, 228, 0, 4, 0, 4, /*wall=*/18],
        [/*wall=*/18, 27, 4, 4, 50, 4, 4, 4, 4, 4, 0, 4, /*wall=*/18],
        [/*wall=*/18, 0, 247, 4, 4, 4, 4, 4, 4, 53, 0, 4, /*wall=*/18],
        [/*wall=*/18, 4, 83, 269, 86, 67, 4, 4, 53, 82, 0, 88, /*wall=*/18],
        [/*wall=*/18, 0, 247, 4, 4, 4, 4, 4, 4, 53, 0, 4, /*wall=*/18],
        [/*wall=*/18, 27, 4, 4, 50, 4, 4, 4, 4, 4, 0, 4, /*wall=*/18],
        [/*wall=*/18, 27, 4, 4, 247, 228, 228, 228, 0, 4, 0, 4, /*wall=*/18],
        [/*wall=*/18, 0, 4, 4, 4, 4, 4, 4, 0, 82, 0, 4, /*wall=*/18],
        [/*wall=*/18, 228, 0, 27, 27, 27, 0, 0, 0, 4, 0, 32, /*wall=*/18],
        [/*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18],
    ],
    firstArriveEvents: [

    ],
    pointTriggerEvents: {

    },
    switchFloorEvent: {
        "11,6": { floorId: 22, loc: [6, 6] },
    },
    postBattleEvent: {
        "3,6": [
            { type: "openDoor", loc: [4, 6] },
        ]
    },
    postGetItemEvent: {},
    postOpenDoorEvent: {},
    blockCannotMoveDirections: {},
};