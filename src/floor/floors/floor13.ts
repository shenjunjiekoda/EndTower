
import { Floor } from "floor/data";

export const floor13: Floor = {
    floorId: 13,
    title: "main_13",
    transporterEnabled: true,
    quickShopEnabled: true,
    defaultGround: "ground",
    map: [
        [/*wall=*/69, /*wall=*/69, /*wall=*/69, /*wall=*/69, /*wall=*/69, /*wall=*/69, /*wall=*/69, /*wall=*/69, /*wall=*/69, /*wall=*/69, /*wall=*/69, /*wall=*/69, /*wall=*/69],
        [/*wall=*/69, 0, 224, 0, 0, 0, 0, 0, /*wall=*/69, 0, 225, 0,/*wall=*/69],
        [/*wall=*/69, 0, /*wall=*/69,/*wall=*/69,/*wall=*/69,/*wall=*/69,/*wall=*/69, 81, /*wall=*/69, 0, /*wall=*/69, 0,/*wall=*/69],
        [/*wall=*/69, 0, /*wall=*/69, 0, 0, 222, 0, 0, /*wall=*/69, 0, /*wall=*/69, 0,/*wall=*/69],
        [/*wall=*/69, 32, /*wall=*/69, 83, /*wall=*/69,/*wall=*/69,/*wall=*/69, 0, /*wall=*/69, 0, /*wall=*/69, 0,/*wall=*/69],
        [/*wall=*/69, 226, /*wall=*/69, 0, 0, 225,/*wall=*/69, 222, /*wall=*/69, 27, /*wall=*/69, 0,/*wall=*/69],
        [/*wall=*/69, 227, /*wall=*/69, 0, 212, 86,/*wall=*/69, 223, /*wall=*/69, 27, /*wall=*/69, 0,/*wall=*/69],
        [/*wall=*/69, 226,/*wall=*/69, 225, 86, 121,/*wall=*/69, 222, /*wall=*/69, 27, /*wall=*/69, 28,/*wall=*/69],
        [/*wall=*/69, 0, /*wall=*/69,/*wall=*/69,/*wall=*/69,/*wall=*/69,/*wall=*/69, 0, /*wall=*/69, 0, /*wall=*/69, 28,/*wall=*/69],
        [/*wall=*/69, 0, 226, 0, /*wall=*/69, 0, 0, 0, 225, 0, /*wall=*/69, 28,/*wall=*/69],
        [/*wall=*/69, /*wall=*/69,/*wall=*/69, 0, /*wall=*/69, 32, /*wall=*/69,/*wall=*/69,/*wall=*/69,/*wall=*/69,/*wall=*/69, 0,/*wall=*/69],
        [/*wall=*/69, 88, 0, 0, 82, 0, 87, /*wall=*/69, 66, 212, 81, 0,/*wall=*/69],
        [/*wall=*/69, /*wall=*/69, /*wall=*/69, /*wall=*/69, /*wall=*/69, /*wall=*/69, /*wall=*/69, /*wall=*/69, /*wall=*/69, /*wall=*/69, /*wall=*/69, /*wall=*/69, /*wall=*/69],
    ],
    firstArriveEvents: [

    ],
    pointTriggerEvents: {
        "5,7": [
            { "type": "openShop", "id": "expShop2" }
        ],
        "4,7": {
            "trigger": "action",
            "data": [
                { "type": "openDoor", "loc": [4, 7] }
            ]
        }
    },
    switchFloorEvent: {
        "6,11": { floorId: 14, stairDirection: "downFloor" },
        "1,11": { floorId: 12, stairDirection: "upFloor" },
    },
    postBattleEvent: {},
    postGetItemEvent: {},
    postOpenDoorEvent: {},
    blockCannotMoveDirections: {},
};