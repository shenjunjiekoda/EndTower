
import { Floor } from "floor/data";

export const floor6: Floor = {
    floorId: 6,
    title: "main_6",
    transporterEnabled: true,
    quickShopEnabled: true,
    defaultGround: "ground",
    map: [
        [/*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18],
        [/*wall=*/18, 50, 211,/*wall=*/18, 28,/*wall=*/18, 21, 204, 53,/*wall=*/18, 32, 32, /*wall=*/18],
        [/*wall=*/18, 211, 21,/*wall=*/18, 27,/*wall=*/18, 0, 21, 204,/*wall=*/18, 215, 32, /*wall=*/18],
        [/*wall=*/18, 21, 207, 82, 0, 82, 207, 0, 21,/*wall=*/18, 0, 215, /*wall=*/18],
        [/*wall=*/18, 0, 0,/*wall=*/18, 221,/*wall=*/18, 0, 0, 0,/*wall=*/18, 220, 0, /*wall=*/18],
        [/*wall=*/18,/*wall=*/18,/*wall=*/18,/*wall=*/18, 83,/*wall=*/18,/*wall=*/18,/*wall=*/18,/*wall=*/18,/*wall=*/18, 81,/*wall=*/18, /*wall=*/18],
        [/*wall=*/18, 0, 0, 218, 0, 21, 21, 21, 0, 218, 0, 0, /*wall=*/18],
        [/*wall=*/18, 0,/*wall=*/18,/*wall=*/18,/*wall=*/18,/*wall=*/18,/*wall=*/18,/*wall=*/18,/*wall=*/18,/*wall=*/18,/*wall=*/18,/*wall=*/18, /*wall=*/18],
        [/*wall=*/18, 0,/*wall=*/18, 206, 81, 206, 0, 0, 0, 0, 0,/*wall=*/18, /*wall=*/18],
        [/*wall=*/18, 0,/*wall=*/18, 81,/*wall=*/18, 81,/*wall=*/18,/*wall=*/18,/*wall=*/18,/*wall=*/18, 82,/*wall=*/18, /*wall=*/18],
        [/*wall=*/18, 0,/*wall=*/18, 206,/*wall=*/18, 0, 0,/*wall=*/18,/*wall=*/18, 0, 0,/*wall=*/18, /*wall=*/18],
        [/*wall=*/18, 0, 0, 0,/*wall=*/18, 87, 0, 81, 81, 0, 88,/*wall=*/18, /*wall=*/18],
        [/*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18],
    ],
    firstArriveEvents: [

    ],
    pointTriggerEvents: {
    },
    switchFloorEvent: {
        "5,11": { floorId: 7, stairDirection: "downFloor" },
        "10,11": { floorId: 5, stairDirection: "upFloor" },
    },
    postBattleEvent: {},
    postGetItemEvent: {},
    postOpenDoorEvent: {},
    blockCannotMoveDirections: {},
};