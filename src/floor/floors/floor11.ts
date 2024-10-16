
import { Floor } from "floor/data";

export const floor11: Floor = {
    floorId: 11,
    title: "main_11",
    transporterEnabled: true,
    quickShopEnabled: true,
    defaultGround: "ground",
    map: [
        [/*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19],
        [/*wall=*/19, 31,  /*wall=*/19, 21,  /*wall=*/19, 22,  /*wall=*/19, 23,  /*wall=*/19, 32, 40, 32, /*wall=*/19],
        [/*wall=*/19, 31,  /*wall=*/19, 21,  /*wall=*/19, 22,  /*wall=*/19, 23,  /*wall=*/19, 222, 223, 222,/*wall=*/19],
        [/*wall=*/19, 31,  /*wall=*/19, 21,  /*wall=*/19, 22,  /*wall=*/19, 23,  /*wall=*/19, 0, 222, 0,  /*wall=*/19],
        [/*wall=*/19, 81,  /*wall=*/19, 81,  /*wall=*/19, 81,  /*wall=*/19, 81,  /*wall=*/19,  /*wall=*/19, 82,  /*wall=*/19, /*wall=*/19],
        [/*wall=*/19, 0, 0, 0, 0, 0,   /*wall=*/19, 0, 0, 0, 0, 0,  /*wall=*/19],
        [/*wall=*/19, 81,  /*wall=*/19,  /*wall=*/19, 82,  /*wall=*/19,  /*wall=*/19,  /*wall=*/19, 82,  /*wall=*/19,  /*wall=*/19, 81, /*wall=*/19],
        [/*wall=*/19, 28,  /*wall=*/19, 0, 222, 32, 224, 32, 222, 0,   /*wall=*/19, 27, /*wall=*/19],
        [/*wall=*/19, 28,  /*wall=*/19, 214, /*wall=*/19,  /*wall=*/19,  /*wall=*/19,  /*wall=*/19,  /*wall=*/19, 214, /*wall=*/19, 27, /*wall=*/19],
        [/*wall=*/19, 28,  /*wall=*/19, 214, /*wall=*/19, 7, 131, 8,   /*wall=*/19, 214, /*wall=*/19, 27, /*wall=*/19],
        [/*wall=*/19,/*wall=*/19,  /*wall=*/19, 83,  /*wall=*/19, 31, 0, 31,  /*wall=*/19, 83,  /*wall=*/19,  /*wall=*/19, /*wall=*/19],
        [/*wall=*/19, 88, 0, 0, 0, 0, 0, 0, 0, 0, 0, 87, /*wall=*/19],
        [/*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19],
    ],
    firstArriveEvents: [

    ],
    pointTriggerEvents: {
        "6,9": [
            { type: "openShop", id: "moneyShop2" }
        ]
    },
    switchFloorEvent: {
        "11,11": { floorId: 12, stairDirection: "downFloor" },
        "1,11": { floorId: 10, stairDirection: "upFloor" },
    },
    postBattleEvent: {},
    postGetItemEvent: {},
    postOpenDoorEvent: {},
    blockCannotMoveDirections: {},
};