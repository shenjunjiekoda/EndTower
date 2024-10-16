
import { Floor } from "floor/data";

export const floor5: Floor = {
    floorId: 5,
    title: "main_5",
    transporterEnabled: true,
    quickShopEnabled: true,
    defaultGround: "ground",
    map: [
        [/*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18],
        [/*wall=*/18, 26,/*wall=*/18, 31,/*wall=*/18, 32, 217, 0, 0, 217, 21, 22, /*wall=*/18],
        [/*wall=*/18, 0,/*wall=*/18, 27,/*wall=*/18, 217, 0, 0, 0, 0, 217, 21, /*wall=*/18],
        [/*wall=*/18, 206,/*wall=*/18, 0,/*wall=*/18, 210, 0,/*wall=*/18,/*wall=*/18, 81,/*wall=*/18,/*wall=*/18, /*wall=*/18],
        [/*wall=*/18, 0, 81, 217,/*wall=*/18, 36, 210,/*wall=*/18, 0, 213, 210, 122, /*wall=*/18],
        [/*wall=*/18, 206,/*wall=*/18, 0,/*wall=*/18,/*wall=*/18,/*wall=*/18,/*wall=*/18, 0, 0, 0, 210, /*wall=*/18],
        [/*wall=*/18, 27,/*wall=*/18, 0, 0, 0, 205, 209, 0, 0, 0, 0, /*wall=*/18],
        [/*wall=*/18, 28,/*wall=*/18,/*wall=*/18, 203,/*wall=*/18,/*wall=*/18,/*wall=*/18,/*wall=*/18, 0, 0, 0, /*wall=*/18],
        [/*wall=*/18, 0, 121,/*wall=*/18, 203,/*wall=*/18, 0, 0, 0, 213, 221, 0, /*wall=*/18],
        [/*wall=*/18,/*wall=*/18,/*wall=*/18,/*wall=*/18, 205,/*wall=*/18, 81,/*wall=*/18, 82,/*wall=*/18, 81,/*wall=*/18, /*wall=*/18],
        [/*wall=*/18, 0, 0,/*wall=*/18, 0,/*wall=*/18, 205,/*wall=*/18, 28, 81, 0,/*wall=*/18, /*wall=*/18],
        [/*wall=*/18, 88, 0, 205, 0, 0, 0,/*wall=*/18, 21,/*wall=*/18, 87,/*wall=*/18, /*wall=*/18],
        [/*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18],
    ],
    firstArriveEvents: [
        "\t[player]\b[up,player]这层还有老爷爷被困在怪物间",
        "\t[player]\b[up,player]难道除了公主外还有很多人被囚禁在这终结塔里么",
    ],
    pointTriggerEvents: {
        "2,8": [
            { type: "openShop", id: "expShop1" },
        ],
        "11,4": [
            { type: "openShop", id: "keyShop" },
        ]
    },
    switchFloorEvent: {
        "10,11": { floorId: 6, stairDirection: "downFloor" },
        "1,11": { floorId: 4, stairDirection: "upFloor" },
    },
    postBattleEvent: {},
    postGetItemEvent: {},
    postOpenDoorEvent: {},
    blockCannotMoveDirections: {},
};