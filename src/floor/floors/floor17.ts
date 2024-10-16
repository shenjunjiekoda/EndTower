
import { Floor } from "floor/data";

export const floor17: Floor = {
    floorId: 17,
    title: "main_17",
    transporterEnabled: true,
    quickShopEnabled: true,
    defaultGround: "ground",
    map: [
        [/*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18],
        [/*wall=*/18, 4, 228, 212, 0, 0, 0, 0, 0, 0, 0, 228,/*wall=*/18],
        [/*wall=*/18, 4, 212, 4, 4, 4, 4, 4, 4, 4, 4, 0,  /*wall=*/18],
        [/*wall=*/18, 4, 0, 4, 228, 0, 0, 0, 0, 0, 0, 228,/*wall=*/18],
        [/*wall=*/18, 4, 0, 4, 0, 4, 4, 4, 4, 4, 4, 4,  /*wall=*/18],
        [/*wall=*/18, 4, 0, 4, 0, 4, 228, 0, 0, 0, 228, 4,  /*wall=*/18],
        [/*wall=*/18, 4, 0, 4, 228, 0, 0, 4, 4, 4, 0, 4,  /*wall=*/18],
        [/*wall=*/18, 4, 0, 4, 4, 4, 4, 4, 228, 0, 228, 4,  /*wall=*/18],
        [/*wall=*/18, 4, 212, 4, 4, 4, 88, 4, 0, 4, 4, 4,  /*wall=*/18],
        [/*wall=*/18, 4, 228, 212, 0, 216, 0, 4, 228, 0, 0, 228,/*wall=*/18],
        [/*wall=*/18, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0,  /*wall=*/18],
        [/*wall=*/18, 87, 0, 216, 0, 0, 0, 0, 0, 0, 0, 228,/*wall=*/18],
        [/*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18],
    ],
    firstArriveEvents: [

    ],
    pointTriggerEvents: {

    },
    switchFloorEvent: {
        "1,11": { floorId: 18, stairDirection: "downFloor" },
        "6,8": { floorId: 16, stairDirection: "upFloor" },
    },
    postBattleEvent: {
    },
    postGetItemEvent: {},
    postOpenDoorEvent: {},
    blockCannotMoveDirections: {},
};