
import { Floor } from "floor/data";

export const floor15: Floor = {
    floorId: 15,
    title: "main_15",
    transporterEnabled: true,
    quickShopEnabled: true,
    defaultGround: "ground",
    map: [
        [/*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18],
        [/*wall=*/18, 0, 0, 0, 0, 88, 4, 87, 0, 0, 0, 0, /*wall=*/18],
        [/*wall=*/18, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, /*wall=*/18],
        [/*wall=*/18, 0, 4, 4,   /*wall=*/18,  /*wall=*/18,  /*wall=*/18,  /*wall=*/18,  /*wall=*/18, 4, 4, 0, /*wall=*/18],
        [/*wall=*/18, 0, 4,   /*wall=*/18,  /*wall=*/18, 121, /*wall=*/18, 122, /*wall=*/18,  /*wall=*/18, 4, 0, /*wall=*/18],
        [/*wall=*/18, 0, 4,   /*wall=*/18,  /*wall=*/18, 28,  /*wall=*/18, 28,  /*wall=*/18,  /*wall=*/18, 4, 0, /*wall=*/18],
        [/*wall=*/18, 0, 4,   /*wall=*/18,  /*wall=*/18, 27,  /*wall=*/18, 27,  /*wall=*/18,  /*wall=*/18, 4, 0, /*wall=*/18],
        [/*wall=*/18, 0, 4, 4,   /*wall=*/18, 0,   /*wall=*/18, 0,   /*wall=*/18, 4, 4, 0, /*wall=*/18],
        [/*wall=*/18, 0, 4, 4,   /*wall=*/18, 81,  /*wall=*/18, 81,  /*wall=*/18, 4, 4, 0, /*wall=*/18],
        [/*wall=*/18, 0, 4, 4, 4, 0, 0, 0, 4, 4, 4, 0, /*wall=*/18],
        [/*wall=*/18, 0, 4, 4, 4, 4, 83, 4, 4, 4, 4, 0, /*wall=*/18],
        [/*wall=*/18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, /*wall=*/18],
        [/*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18],
    ],
    firstArriveEvents: [

    ],
    pointTriggerEvents: {
        "5,4": [
            {
                "type": "choices", "text": "\t[神秘老人,man]500经验换120攻击，要吗？",
                "choices": [
                    {
                        "text": "我要", "action": [
                            {
                                "type": "if", "condition": "status:exp>=500",
                                "true": [
                                    { "type": "setValue", "name": "status:exp", "value": "status:exp-500" },
                                    { "type": "setValue", "name": "status:attack", "value": "status:attack+120" },
                                    { "type": "hide" }
                                ],
                                "false": [
                                    "\t[神秘老人,man]你的经验不足！"
                                ]
                            }
                        ]
                    },
                    { "text": "谢谢，不用", "action": [] }
                ]
            }
        ],
        "7,4": [
            {
                "type": "choices", "text": "\t[神秘老人,woman]500金币换120防御，要吗？",
                "choices": [
                    {
                        "text": "我要", "action": [
                            {
                                "type": "if", "condition": "status:money>=500",
                                "true": [
                                    { "type": "setValue", "name": "status:money", "value": "status:money-500" },
                                    { "type": "setValue", "name": "status:defense", "value": "status:defense+120" },
                                    { "type": "hide" }
                                ],
                                "false": [
                                    "\t[神秘老人,man]你的金币不足！"
                                ]
                            }
                        ]
                    },
                    { "text": "谢谢，不用", "action": [] }
                ]
            }
        ]
    },
    switchFloorEvent: {
        "7,1": { floorId: 16, stairDirection: "downFloor" },
        "5,1": { floorId: 14, stairDirection: "upFloor" },
    },
    postBattleEvent: {},
    postGetItemEvent: {},
    postOpenDoorEvent: {},
    blockCannotMoveDirections: {},
};