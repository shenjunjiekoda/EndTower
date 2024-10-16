
import { Floor } from "floor/data";

export const floor18: Floor = {
    floorId: 18,
    title: "main_18",
    transporterEnabled: true,
    quickShopEnabled: true,
    defaultGround: "ground",
    map: [
        [/*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18],
        [/*wall=*/18, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, /*wall=*/18],
        [/*wall=*/18, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, /*wall=*/18],
        [/*wall=*/18, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, /*wall=*/18],
        [/*wall=*/18, 4, 4, 4, 4,/*wall=*/18,/*wall=*/18,/*wall=*/18, 4, 4, 4, 4, /*wall=*/18],
        [/*wall=*/18, 4, 4, 4,/*wall=*/18,/*wall=*/18, 132,/*wall=*/18,/*wall=*/18, 4, 4, 4, /*wall=*/18],
        [/*wall=*/18, 4, 4, 4,/*wall=*/18,/*wall=*/18, 86,/*wall=*/18,/*wall=*/18, 4, 4, 4, /*wall=*/18],
        [/*wall=*/18, 4, 4, 4,/*wall=*/18,/*wall=*/18, 83,/*wall=*/18,/*wall=*/18, 4, 4, 4, /*wall=*/18],
        [/*wall=*/18, 4, 4, 4, 4,/*wall=*/18, 83,/*wall=*/18, 4, 4, 4, 4, /*wall=*/18],
        [/*wall=*/18, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, /*wall=*/18],
        [/*wall=*/18, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, /*wall=*/18],
        [/*wall=*/18, 88, 0, 0, 0, 0, 0, 0, 0, 0, 0, 87, /*wall=*/18],
        [/*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18],
    ],
    firstArriveEvents: [
        { "type": "hide", "loc": [11, 11] },
    ],
    pointTriggerEvents: {
        // "11,11": {
        //     "enable": false,
        //     "data": [
        //         { "type": "switchFloor", "loc": [11, 11], "floorId": 19 }
        //     ]
        // },
        "6,6": {
            "trigger": "action",
            "data": [
                { "type": "openDoor", "loc": [6, 6] }
            ]
        },
        "6,5": [
            {
                "type": "if", "condition": "flag:princess",
                "true": [
                ],
                "false": [
                    "\t[player]\b[down,player]艾达，我来救你了！和我一起走吧",
                    "\t[艾达公主,princess]\b[up]我走不了，魔王对我施展了囚心术",
                    "\t[player]\b[down,player]刚刚我不是杀了一个红衣魔王吗？",
                    "\t[艾达公主,princess]\b[up]那不是END，真正的END还在这座塔内",
                    "\t[player]\b[down,player]艾达，我怎么才能解救你？！",
                    "\t[艾达公主,princess]\b[up]我不知道，我的头好疼！",
                    "\t[？？？]你想救她就上来吧，我会慢慢折磨你！",
                    { "type": "setValue", "name": "flag:princess", "value": "true" },
                    { "type": "show", "loc": [11, 11] }
                ]
            },
            "\t[公主,princess]\b[up] 我想在这休息下，{player}，我在这等你",
        ]
    },
    switchFloorEvent: {
        "1,11": { floorId: 17, stairDirection: "upFloor" },
        "11,11": { floorId: 19, stairDirection: "downFloor" },
    },
    postBattleEvent: {
    },
    postGetItemEvent: {},
    postOpenDoorEvent: {},
    blockCannotMoveDirections: {},
};