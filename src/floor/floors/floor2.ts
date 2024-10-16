import { Floor } from "floor/data";

export const floor2: Floor = {
    floorId: 2,
    title: "main_2",
    transporterEnabled: true,
    quickShopEnabled: true,
    defaultGround: "brownground",
    map: [
        [/*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19],
        [/*wall=*/19, 88, /*wall=*/19, 0, 227, 0, /*wall=*/19, 27, 28, 21, 23, 0, /*wall=*/19],
        [/*wall=*/19, 0, /*wall=*/19, 28, /*wall=*/19, 32, /*wall=*/19, 27, 28, 21, 22, 0, /*wall=*/19],
        [/*wall=*/19, 0, /*wall=*/19, 21, /*wall=*/19, 21, /*wall=*/19, 27, 28, 21, 21, 226, /*wall=*/19],
        [/*wall=*/19, 0, /*wall=*/19, 21, /*wall=*/19, 21, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, 84, /*wall=*/19],
        [/*wall=*/19, 0, /*wall=*/19, 0, /*wall=*/19, 0, 0, 0, 81, 0, 0, 0, /*wall=*/19],
        [/*wall=*/19, 0, /*wall=*/19, 81, /*wall=*/19, /*wall=*/19, 81, /*wall=*/19, /*wall=*/19, /*wall=*/19, 84, /*wall=*/19, /*wall=*/19],
        [/*wall=*/19, 0, 85, 0, 0, 0, 0, /*wall=*/19, 0, 0, 226, 0, /*wall=*/19],
        [/*wall=*/19, 0, /*wall=*/19, 81, /*wall=*/19, /*wall=*/19, 82, /*wall=*/19, 86, /*wall=*/19, /*wall=*/19, 86, /*wall=*/19],
        [/*wall=*/19, 0, /*wall=*/19, 21, /*wall=*/19, 32, 31, /*wall=*/19, 0, /*wall=*/19, /*wall=*/19, 0, /*wall=*/19],
        [/*wall=*/19, 0, /*wall=*/19, 21, /*wall=*/19, 32, 31, /*wall=*/19, 0, /*wall=*/19, /*wall=*/19, 0, /*wall=*/19],
        [/*wall=*/19, 87, /*wall=*/19, 27, /*wall=*/19, 32, 31, /*wall=*/19, 121, /*wall=*/19, /*wall=*/19, 122, /*wall=*/19],
        [/*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19],
    ],
    firstArriveEvents: [
    ],
    pointTriggerEvents: {
        "8,11": [
            "\t[神秘老人,man]\b[up]谢谢你救了我！送你70攻击吧！",
            { type: "setValue", name: "status:attack", value: "status:attack+70" },
            { type: "hide", time: 500 },
        ],
        "11,11": [
            "\t[神秘老人,woman]\b[up]谢谢你救了我！送你30防御吧！",
            { type: "setValue", name: "status:defense", value: "status:defense+30" },
            { type: "hide", time: 500 },
        ],
    },
    switchFloorEvent: {
        "1,1": { floorId: 1, stairDirection: "upFloor" },
        "1,11": { floorId: 3, stairDirection: "downFloor" }
    },
    postBattleEvent: {
        "10,7": [
            { type: "openDoor", loc: [8, 8] },
            { type: "openDoor", loc: [11, 8] },
        ]
    },
    postGetItemEvent: {},
    postOpenDoorEvent: {},
    blockCannotMoveDirections: {},
};