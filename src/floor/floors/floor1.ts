import { Floor } from "floor/data";

export const floor1: Floor = {
    floorId: 1,
    title: "main_1",
    transporterEnabled: true,
    quickShopEnabled: true,
    defaultGround: "ground",
    map: [
        [/*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18],
        [/*wall=*/18, 87, 0, 21, 201, 202, 201, 0, 0, 0, 0, 0, /*wall=*/18],
        [/*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18,/*wall=*/18,/*wall=*/18,/*wall=*/18,/*wall=*/18,/*wall=*/18,/*wall=*/18, 0, /*wall=*/18],
        [/*wall=*/18, 31, 0, 209, 81, 0, /*wall=*/18, 31, 21, 31,/*wall=*/18, 0, /*wall=*/18],
        [/*wall=*/18, 21, 209, 27, /*wall=*/18, 0, /*wall=*/18, 31, 21, 31,/*wall=*/18, 0, /*wall=*/18],
        [/*wall=*/18,/*wall=*/18, 81,/*wall=*/18, /*wall=*/18, 0,/*wall=*/18, /*wall=*/18,/*wall=*/18, 203,/*wall=*/18, 0, 18],
        [/*wall=*/18, 21, 210, 0,/*wall=*/18, 0, 81, 217, 201, 205,/*wall=*/18, 0, 18],
        [/*wall=*/18, 28, 0, 22,/*wall=*/18, 0,/*wall=*/18, /*wall=*/18,/*wall=*/18, /*wall=*/18,/*wall=*/18, 0, 18],
        [/*wall=*/18,/*wall=*/18, 81,/*wall=*/18, /*wall=*/18, 0, 0, 0, 0, 0, 0, 0, /*wall=*/18],
        [/*wall=*/18, 0, 210, 0,/*wall=*/18, /*wall=*/18, 83,/*wall=*/18, /*wall=*/18,/*wall=*/18, 81, /*wall=*/18, /*wall=*/18],
        [/*wall=*/18, 31, 45, 21,/*wall=*/18, 0, 0, 23,/*wall=*/18, 21, 213, 22, /*wall=*/18],
        [/*wall=*/18, 31, 32, 21,/*wall=*/18, 0, 88, 0,/*wall=*/18, 21, 21, 21, /*wall=*/18],
        [/*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18],
    ],
    firstArriveEvents: [
        "\t[player]\b[up,player]这就是主塔么？",
        "\t[player]\b[up,player]先打败这些挡路的怪吧",
    ],
    pointTriggerEvents: {
    },
    switchFloorEvent: {
        "1,1": { floorId: 2, stairDirection: "downFloor" },
        "6,11": { floorId: 0, stairDirection: "upFloor" }
    },
    postBattleEvent: {},
    postGetItemEvent: {},
    postOpenDoorEvent: {},
    blockCannotMoveDirections: {},
};