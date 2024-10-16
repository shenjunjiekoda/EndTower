
import { Floor } from "floor/data";

export const floor7: Floor = {
    floorId: 7,
    title: "main_7",
    transporterEnabled: true,
    quickShopEnabled: true,
    defaultGround: "brownground",
    map: [
        [/*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19],
        [/*wall=*/19, 87, 0, 0, 0, 0, 0, 0, 0,/*wall=*/19,/*wall=*/19,/*wall=*/19,/*wall=*/19],
        [/*wall=*/19,/*wall=*/19,/*wall=*/19, 0, 207,/*wall=*/19, 84,/*wall=*/19, 211, 0,/*wall=*/19,/*wall=*/19,/*wall=*/19],
        [/*wall=*/19,/*wall=*/19, 0, 207, 28,/*wall=*/19, 246,/*wall=*/19, 27, 211, 0,/*wall=*/19,/*wall=*/19],
        [/*wall=*/19, 0, 0,/*wall=*/19,/*wall=*/19,/*wall=*/19, 86,/*wall=*/19,/*wall=*/19,/*wall=*/19, 0, 0,/*wall=*/19],
        [/*wall=*/19, 0, 0, 84, 246, 86, 55, 86, 246, 84, 0, 0,/*wall=*/19],
        [/*wall=*/19, 0,/*wall=*/19,/*wall=*/19,/*wall=*/19,/*wall=*/19, 86,/*wall=*/19,/*wall=*/19,/*wall=*/19,/*wall=*/19, 0,/*wall=*/19],
        [/*wall=*/19, 0,/*wall=*/19, 31, 27,/*wall=*/19, 246,/*wall=*/19, 28, 31,/*wall=*/19, 0,/*wall=*/19],
        [/*wall=*/19, 0,/*wall=*/19, 21, 31,/*wall=*/19, 84,/*wall=*/19, 31, 21,/*wall=*/19, 0,/*wall=*/19],
        [/*wall=*/19, 0,/*wall=*/19,/*wall=*/19, 22, 22, 32, 22, 22,/*wall=*/19,/*wall=*/19, 0,/*wall=*/19],
        [/*wall=*/19, 0, 0,/*wall=*/19,/*wall=*/19,/*wall=*/19, 83,/*wall=*/19,/*wall=*/19,/*wall=*/19, 0, 0,/*wall=*/19],
        [/*wall=*/19,/*wall=*/19, 0, 0, 81, 88, 0, 0, 81, 0, 0,/*wall=*/19,/*wall=*/19],
        [/*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19, /*wall=*/19],
    ],
    firstArriveEvents: [
        "\t[player]\b[up,player]那是灵器么？不太敢确定...",
        "\t[player]\b[up,player]绿色的钥匙很稀有，我得小心抉择。",
    ],
    pointTriggerEvents: {
        "5,5": {
            trigger: "action",
            data: [
                { "type": "openDoor", "loc": [5, 5] }
            ]
        }
    },
    switchFloorEvent: {
        "1,1": { floorId: 8, stairDirection: "downFloor" },
        "5,11": { floorId: 6, stairDirection: "upFloor" },
    },
    postBattleEvent: {},
    postGetItemEvent: {
        "6,5": [
            "\t[player]蕾娜找的灵器是这个吗？",
            "\t[蕾娜,leina]对，我可以提升你的力量百分比，你可以在最合适的时候过来找我给你施法。"
        ]
    },
    postOpenDoorEvent: {},
    blockCannotMoveDirections: {},
};