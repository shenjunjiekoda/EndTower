
import { Floor } from "floor/data";

export const floor12: Floor = {
    floorId: 12,
    title: "main_12",
    transporterEnabled: true,
    quickShopEnabled: true,
    defaultGround: "ground",
    map: [
        [/*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20],
        [/*wall=*/20, 122, 28,  /*wall=*/20, 0, 226, 227, 226, 0,   /*wall=*/20, 32, 48, /*wall=*/20],
        [/*wall=*/20, 27, 0,   /*wall=*/20, 0,   /*wall=*/20, 81,  /*wall=*/20, 0,   /*wall=*/20, 0, 32, /*wall=*/20],
        [/*wall=*/20, 0, 0,   /*wall=*/20, 0,   /*wall=*/20, 227, /*wall=*/20, 0,   /*wall=*/20, 0, 0,  /*wall=*/20],
        [/*wall=*/20, 0, 224, /*wall=*/20, 0,   /*wall=*/20, 21,  /*wall=*/20, 0,   /*wall=*/20, 228, 0,  /*wall=*/20],
        [/*wall=*/20, 224, 225, /*wall=*/20, 0,   /*wall=*/20, 21,  /*wall=*/20, 0,   /*wall=*/20, 247, 228,/*wall=*/20],
        [/*wall=*/20, /*wall=*/20, 82,  /*wall=*/20, 0,   /*wall=*/20, 31,  /*wall=*/20, 0,   /*wall=*/20, 82,  /*wall=*/20, /*wall=*/20],
        [/*wall=*/20, 0, 0, 0, 0,   /*wall=*/20, 31,  /*wall=*/20, 0, 0, 0, 0,  /*wall=*/20],
        [/*wall=*/20, /*wall=*/20,  /*wall=*/20,  /*wall=*/20, 0,   /*wall=*/20,  /*wall=*/20,  /*wall=*/20, 0,   /*wall=*/20,  /*wall=*/20,  /*wall=*/20, /*wall=*/20],
        [/*wall=*/20, 28, 224, 81, 222, 222, 223, 222, 222, 81, 224, 27, /*wall=*/20],
        [/*wall=*/20, /*wall=*/20,  /*wall=*/20,  /*wall=*/20,  /*wall=*/20,  /*wall=*/20, 82,  /*wall=*/20,  /*wall=*/20,  /*wall=*/20,  /*wall=*/20,  /*wall=*/20, /*wall=*/20],
        [/*wall=*/20, 87, 0, 0, 0, 0, 0, 0, 0, 0, 0, 88, /*wall=*/20],
        [/*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20],
    ],
    firstArriveEvents: [

    ],
    pointTriggerEvents: {
        "1,1": [
            {
                "type": "choices", "text": "\t[神秘老人,woman]你有多余的钥匙需要出售吗？",
                "choices": [
                    {
                        "text": "黄钥匙（7金币）", "action": [
                            {
                                "type": "if", "condition": "item:yellowKey>0",
                                "true": [
                                    { "type": "setValue", "name": "item:yellowKey", "value": "item:yellowKey-1" },
                                    { "type": "setValue", "name": "status:money", "value": "status:money+7" }
                                ],
                                "false": []
                            }
                        ]
                    },
                    {
                        "text": "蓝钥匙（35金币）", "action": [
                            {
                                "type": "if", "condition": "item:blueKey>0",
                                "true": [
                                    { "type": "setValue", "name": "item:blueKey", "value": "item:blueKey-1" },
                                    { "type": "setValue", "name": "status:money", "value": "status:money+35" }
                                ],
                                "false": []
                            }
                        ]
                    },
                    {
                        "text": "红钥匙（70金币）", "action": [
                            {
                                "type": "if", "condition": "item:redKey>0",
                                "true": [
                                    { "type": "setValue", "name": "item:redKey", "value": "item:redKey-1" },
                                    { "type": "setValue", "name": "status:money", "value": "status:money+70" }
                                ],
                                "false": []
                            }
                        ]
                    },
                    {
                        "text": "绿钥匙（110金币）", "action": [
                            {
                                "type": "if", "condition": "item:greenKey>0",
                                "true": [
                                    { "type": "setValue", "name": "item:greenKey", "value": "item:greenKey-1" },
                                    { "type": "setValue", "name": "status:money", "value": "status:money+110" }
                                ],
                                "false": []
                            }
                        ]
                    },
                    { "text": "离开", "action": [{ "type": "exit" }] }
                ]
            },
            { "type": "revisit" }
        ]
    },
    switchFloorEvent: {
        "1,11": { floorId: 13, stairDirection: "downFloor" },
        "11,11": { floorId: 11, stairDirection: "upFloor" },
    },
    postBattleEvent: {},
    postGetItemEvent: {},
    postOpenDoorEvent: {},
    blockCannotMoveDirections: {},
};