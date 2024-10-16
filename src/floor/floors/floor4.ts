import { Floor } from "floor/data";

export const floor4: Floor = {
    floorId: 4,
    title: "main_4",
    transporterEnabled: true,
    quickShopEnabled: true,
    defaultGround: "ground",
    map: [
        [/*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18],
        [/*wall=*/18, 0, 203, 0,  /*wall2=*/19, 0, 150, 0,  /*wall2=*/19, 0, 203, 0,  /*wall=*/18],
        [/*wall=*/18, 81, /*wall=*/18, 81,  /*wall2=*/19, 0, 0, 0,  /*wall2=*/19, 81, /*wall=*/18, 81,  /*wall=*/18],
        [/*wall=*/18, 0, /*wall=*/18, 0,  /*wall2=*/19,  /*wall2=*/19, 86,  /*wall2=*/19,  /*wall2=*/19, 0, /*wall=*/18, 0,  /*wall=*/18],
        [/*wall=*/18, 0, /*wall=*/18, 209,  /*wall2=*/19, 206, 207, 206,  /*wall2=*/19, 209, /*wall=*/18, 0,  /*wall=*/18],
        [/*wall=*/18, 205, /*wall=*/18, 31,  /*wall2=*/19, 28, 206, 28,  /*wall2=*/19, 31, /*wall=*/18, 205,  /*wall=*/18],
        [/*wall=*/18, 205, /*wall=*/18, 31,  /*wall2=*/19,  /*wall2=*/19, 83,  /*wall2=*/19,  /*wall2=*/19, 31, /*wall=*/18, 205,  /*wall=*/18],
        [/*wall=*/18, 202, /*wall=*/18, 0,  /*wall2=*/19, 213, 221, 213,  /*wall2=*/19, 0, /*wall=*/18, 202,  /*wall=*/18],
        [/*wall=*/18, 0, /*wall=*/18, 0,  /*wall2=*/19, 27, 213, 27,  /*wall2=*/19, 0, /*wall=*/18, 0,  /*wall=*/18],
        [/*wall=*/18, 0, /*wall=*/18, 0,  /*wall2=*/19,  /*wall2=*/19, 82,  /*wall2=*/19,  /*wall2=*/19, 0, /*wall=*/18, 0,  /*wall=*/18],
        [/*wall=*/18, 0, /*wall=*/18, 0,  /*wall2=*/19, 21, 0, 21,  /*wall2=*/19, 0, /*wall=*/18, 0,  /*wall=*/18],
        [/*wall=*/18, 87, /*wall=*/18, 0, 203, 0, 0, 0, 203, 0, /*wall=*/18, 88,  /*wall=*/18],
        [/*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18],
    ],
    firstArriveEvents: [
        "\t[player]\b[up,player]有别人被囚禁在这么？",
        "\t[player]\b[up,player]或许他知道些什么信息",
        "\t[player]\b[up,player]不过那个红色的蝙蝠守在他前面，看起来不太好对付。",
    ],
    pointTriggerEvents: {
        "6,1": [
            {
                "type": "if", "condition": "!flag:visitedThief",
                "true": [
                    "\t[迈特Jay,jay]\b[down]谢谢你救了我！",
                    "\t[迈特Jay,jay]\b[down]我叫迈特Jay，是一名寻宝猎人，有一天无意中闯入了这座塔，结果被这里的魔物们发现给关在了这里。",
                    "\t[player]\b[down,player]（蕾娜不是说我是最近唯一一个来的人吗，这是有人在说谎吗？）",
                    "\t[player]\b[down,player]没事！乐于助人嘛！",
                    "\t[迈特Jay,jay]\b[down]为了感谢你，我给你把2楼的机关门打开吧。",
                    { type: "openDoor", loc: [2, 7], floorId: 2 },
                    "\t[迈特Jay,jay]\b[down]另外，我有一把锄头遗失在了这座塔里，如果你能帮我找到，我就可以为你打开18楼的通路",
                    "\t[player]\b[down,player]好的，我会留意的",
                    { "type": "setValue", "name": "flag:visitedThief", "value": "true" }
                ],
                "false": [
                    {
                        "type": "if", "condition": "item:icePickaxe>0",
                        "true": [
                            "\t[迈特Jay,jay]\b[down]这就是我的锄头！\n我现在就去为你打开18楼的通路！",
                            { type: "hide" },
                            { type: "hide", loc: [6, 9], floorId: 18 },
                            { type: "hide", loc: [6, 10], floorId: 18 },
                        ],
                        "false": [
                            "\t[迈特Jay,jay]\b[down]你找到锄头了吗？",
                            "\t[player]\b[down,player]啊还没有，我再去找找~",
                        ]
                    }
                ]
            }
        ]
    },
    switchFloorEvent: {
        "1,11": { floorId: 5, stairDirection: "downFloor" },
        "11,11": { floorId: 3, stairDirection: "upFloor" },
    },
    postBattleEvent: {
        "6,4": [{ "type": "openDoor", "loc": [6, 3] }]
    },
    postGetItemEvent: {},
    postOpenDoorEvent: {},
    blockCannotMoveDirections: {},
};