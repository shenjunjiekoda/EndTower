
import { Floor } from "floor/data";

export const floor14: Floor = {
    floorId: 14,
    title: "main_14",
    transporterEnabled: true,
    quickShopEnabled: true,
    defaultGround: "ground",
    map: [
        [/*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19],
        [/*wall=*/19, /*wall=*/19, 0, 228, 26, 164, 87, 0, 0, 0, 0,   /*wall=*/19, /*wall=*/19],
        [/*wall=*/19, /*wall=*/19, 0, 32,  /*wall=*/19,  /*wall=*/19,  /*wall=*/19,  /*wall=*/19,  /*wall=*/19, 32, 0,   /*wall=*/19, /*wall=*/19],
        [/*wall=*/19, /*wall=*/19, 0,   /*wall=*/19,  /*wall=*/19,  /*wall=*/19,  /*wall=*/19,  /*wall=*/19,  /*wall=*/19,  /*wall=*/19, 0,   /*wall=*/19, /*wall=*/19],
        [/*wall=*/19, /*wall=*/19, 0,   /*wall=*/19,  /*wall=*/19,  /*wall=*/19, 56,  /*wall=*/19,  /*wall=*/19,  /*wall=*/19, 0,   /*wall=*/19, /*wall=*/19],
        [/*wall=*/19, /*wall=*/19, 0,   /*wall=*/19,  /*wall=*/19,  /*wall=*/19, 86,  /*wall=*/19,  /*wall=*/19,  /*wall=*/19, 0,   /*wall=*/19, /*wall=*/19],
        [/*wall=*/19, /*wall=*/19, 0, 31,  /*wall=*/19,  /*wall=*/19, 225, /*wall=*/19,  /*wall=*/19, 31, 0,   /*wall=*/19, /*wall=*/19],
        [/*wall=*/19, /*wall=*/19, 0, 4, 4,   /*wall=*/19, 212, /*wall=*/19, 4, 4, 0,   /*wall=*/19, /*wall=*/19],
        [/*wall=*/19, /*wall=*/19, 0, 4, 4,   /*wall=*/19, 225, /*wall=*/19, 4, 4, 0,   /*wall=*/19, /*wall=*/19],
        [/*wall=*/19, /*wall=*/19, 0, 4, 4,   /*wall=*/19, 82,  /*wall=*/19, 4, 4, 0,   /*wall=*/19, /*wall=*/19],
        [/*wall=*/19, /*wall=*/19, 222, 223, 222, 82, 0, 82, 222, 223, 222, /*wall=*/19, /*wall=*/19],
        [/*wall=*/19, /*wall=*/19,  /*wall=*/19,  /*wall=*/19,  /*wall=*/19,  /*wall=*/19, 88,  /*wall=*/19,  /*wall=*/19,  /*wall=*/19,  /*wall=*/19,  /*wall=*/19, /*wall=*/19],
        [/*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19],
    ],
    firstArriveEvents: [

    ],
    pointTriggerEvents: {
        "6,5": {
            trigger: "action",
            data: [
                { type: "openDoor", loc: [6, 5] }
            ]
        }
    },
    switchFloorEvent: {
        "6,1": { floorId: 15, stairDirection: "downFloor" },
        "6,11": { floorId: 13, stairDirection: "upFloor" },
    },
    postBattleEvent: {},
    postGetItemEvent: {},
    postOpenDoorEvent: {},
    blockCannotMoveDirections: {},
};