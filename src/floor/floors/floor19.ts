
import { Floor } from "floor/data";

export const floor19: Floor = {
    floorId: 19,
    title: "main_19",
    transporterEnabled: true,
    quickShopEnabled: true,
    defaultGround: "ground",
    map: [
        [/*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18],
        [/*wall=*/18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,  /*wall=*/18],
        [/*wall=*/18, 0, 4, 0, 4, 4, 4, 4, 4, 0, 4, 0,  /*wall=*/18],
        [/*wall=*/18, 0, 4, 0, 4, 4, 4, 4, 4, 0, 4, 0,  /*wall=*/18],
        [/*wall=*/18, 0, 4, 0, 4, 4, 87, 4, 4, 0, 4, 0,  /*wall=*/18],
        [/*wall=*/18, 0, 4, 0, 4, 4, 0, 4, 4, 0, 4, 0,  /*wall=*/18],
        [/*wall=*/18, 0, 4, 275, 4, 4, 0, 4, 4, 275, 4, 0,  /*wall=*/18],
        [/*wall=*/18, 0, 4, 86, 4, 4, 208, 4, 4, 86, 4, 0,  /*wall=*/18],
        [/*wall=*/18, 0, 4, 43, 4, 4, 0, 4, 4, 44, 4, 0,  /*wall=*/18],
        [/*wall=*/18, 0, 4, 4, 4, 4, 0, 4, 4, 4, 4, 0,  /*wall=*/18],
        [/*wall=*/18, 0, 4, 4, 4, 4, 0, 4, 4, 4, 4, 0,  /*wall=*/18],
        [/*wall=*/18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 88, /*wall=*/18],
        [/*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18],
    ],
    firstArriveEvents: [

    ],
    pointTriggerEvents: {

    },
    switchFloorEvent: {
        "6,4": { floorId: 20, stairDirection: "downFloor" },
        "11,11": { floorId: 18, stairDirection: "upFloor" },
    },
    postBattleEvent: {
        "3,6": [
            { type: "openDoor", loc: [3, 7] }
        ],
        "9,6": [
            { type: "openDoor", loc: [9, 7] }
        ],
        "6,7": [
            "\t[vampire]你以为这样就赢了我？END魔王不会在乎你这种小喽喽的",
            "\t[vampire]对付你，不需要他出手！我本体在21楼等着你的到来！"
        ]
    },
    postGetItemEvent: {},
    postOpenDoorEvent: {},
    blockCannotMoveDirections: {},
};