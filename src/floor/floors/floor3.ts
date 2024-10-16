import { Floor } from "floor/data";

export const floor3: Floor = {
    floorId: 3,
    title: "main_3",
    transporterEnabled: true,
    quickShopEnabled: true,
    defaultGround: "ground",
    map: [
        [/*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18],
        [/*wall=*/18, 35, 202, 21,/*wall=*/18, 7, 131, 8,/*wall=*/18, 0, 205, 0, /*wall=*/18],
        [/*wall=*/18, 202, 21, 0,/*wall=*/18, 0, 0, 0,/*wall=*/18, 0, 18, 0, /*wall=*/18],
        [/*wall=*/18, 21, 209, 0,/*wall=*/18,/*wall=*/18, 81,/*wall=*/18,/*wall=*/18, 0,/*wall=*/18, 0, /*wall=*/18],
        [/*wall=*/18, /*wall=*/18, 81,/*wall=*/18,/*wall=*/18, 0, 209, 0,/*wall=*/18, 21,/*wall=*/18, 202, /*wall=*/18],
        [/*wall=*/18, 0, 0, 0,/*wall=*/18,/*wall=*/18,/*wall=*/18, 0,/*wall=*/18, 21,/*wall=*/18, 205, /*wall=*/18],
        [/*wall=*/18, 201,/*wall=*/18, 0, 205, 202, 205, 0,/*wall=*/18, 21,/*wall=*/18, 202, /*wall=*/18],
        [/*wall=*/18, 201,/*wall=*/18,/*wall=*/18,/*wall=*/18,/*wall=*/18,/*wall=*/18, 0, 0, 0,/*wall=*/18, 0, /*wall=*/18],
        [/*wall=*/18, 0, 0, 0, 0, 0,/*wall=*/18,/*wall=*/18, 81,/*wall=*/18,/*wall=*/18, 0, /*wall=*/18],
        [/*wall=*/18, /*wall=*/18,/*wall=*/18,/*wall=*/18,/*wall=*/18, 205,/*wall=*/18, 202, 0, 202,/*wall=*/18, 0, /*wall=*/18],
        [/*wall=*/18, /*wall=*/18, 0, 0, 0, 0,/*wall=*/18, 27, 205, 21,/*wall=*/18, 0, /*wall=*/18],
        [/*wall=*/18, 88, 0,/*wall=*/18,/*wall=*/18,/*wall=*/18,/*wall=*/18, 28, 32, 21,/*wall=*/18, 87, /*wall=*/18],
        [/*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18],
    ],
    firstArriveEvents: [
        "\t[player]\b[up,player]这层好像有商店！"
    ],
    pointTriggerEvents: {
        "6,1": [
            { "type": "openShop", "id": "moneyShop1" }
        ]
    },
    switchFloorEvent: {
        "11,11": { floorId: 4, stairDirection: "downFloor" },
        "1,11": { floorId: 2, stairDirection: "upFloor" },
    },
    postBattleEvent: {},
    postGetItemEvent: {},
    postOpenDoorEvent: {},
    blockCannotMoveDirections: {},
};