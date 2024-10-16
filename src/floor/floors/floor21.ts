
import { Floor } from "floor/data";

export const floor21: Floor = {
    floorId: 21,
    title: "main_21",
    transporterEnabled: false,
    quickShopEnabled: false,
    defaultGround: "ground",
    map: [
        [/*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18],
        [/*wall=*/18, 4, 4, 4, 4, 4, 87, 4, 4, 4, 4, 4,  /*wall=*/18],
        [/*wall=*/18, 4, 4, 0, 0, 4, 268, 4, 0, 0, 0, 4,  /*wall=*/18],
        [/*wall=*/18, 4, 0, 0, 4, 4, 247, 4, 4, 0, 0, 4,  /*wall=*/18],
        [/*wall=*/18, 4, 0, 0, 0, 4, 247, 4, 0, 0, 0, 4,  /*wall=*/18],
        [/*wall=*/18, 4, 4, 0, 0, 0, 0, 0, 0, 0, 4, 4,  /*wall=*/18],
        [/*wall=*/18, 4, 4, 0, 0, 0, 0, 0, 0, 0, 4, 4,  /*wall=*/18],
        [/*wall=*/18, 4, 4, 4, 0, 0, 4, 0, 0, 4, 4, 4,  /*wall=*/18],
        [/*wall=*/18, 4, 4, 4, 4, 86, 88, 86, 4, 4, 4, 4,  /*wall=*/18],
        [/*wall=*/18, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,  /*wall=*/18],
        [/*wall=*/18, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,  /*wall=*/18],
        [/*wall=*/18, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,  /*wall=*/18],
        [/*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18],
    ],
    firstArriveEvents: [

    ],
    pointTriggerEvents: {
        "6,8": {
            "enable": false,
            "data": [
                { "type": "switchFloor", "loc": [6, 6], "floorId": 21 }
            ]
        },
    },
    switchFloorEvent: {
        "6,1": { floorId: 22, stairDirection: "downFloor" },
        "6,8": { floorId: 20, stairDirection: "upFloor" },
    },
    postBattleEvent: {
        "6,2": [
            { "type": "openDoor", "loc": [5, 8] },
            { "type": "openDoor", "loc": [7, 8] },
            { "type": "hide", "loc": [6, 5], "floorId": 18 },
        ]
    },
    postGetItemEvent: {},
    postOpenDoorEvent: {},
    blockCannotMoveDirections: {},
};