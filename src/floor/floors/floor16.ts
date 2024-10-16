
import { Floor } from "floor/data";

export const floor16: Floor = {
    floorId: 16,
    title: "main_16",
    transporterEnabled: true,
    quickShopEnabled: true,
    defaultGround: "ground",
    map: [
        [/*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20],
        [/*wall=*/20, 4, 4, 4, 4,  /*wall=*/20, 0, 88,  /*wall=*/20, 4, 4, 4,  /*wall=*/20],
        [/*wall=*/20, 4, 4, 4, 4,  /*wall=*/20, 0,  /*wall=*/20,  /*wall=*/20, 4, 4, 4,  /*wall=*/20],
        [/*wall=*/20, 4, 4, 4, 4,  /*wall=*/20, 0,  /*wall=*/20, 4, 4, 4, 4,  /*wall=*/20],
        [/*wall=*/20, 4, 4, 4, 4,   /*wall=*/20, 83,  /*wall=*/20, 4, 4, 4, 4,  /*wall=*/20],
        [/*wall=*/20, 4, 4, 4,   /*wall=*/20,  /*wall=*/20, 0,   /*wall=*/20,  /*wall=*/20, 4, 4, 4,  /*wall=*/20],
        [/*wall=*/20, 4, 4, 4,   /*wall=*/20,  /*wall=*/20, 245, /*wall=*/20,  /*wall=*/20, 4, 4, 4,  /*wall=*/20],
        [/*wall=*/20, 4, 4, 4,   /*wall=*/20,  /*wall=*/20, 0,   /*wall=*/20,  /*wall=*/20, 4, 4, 4,  /*wall=*/20],
        [/*wall=*/20, 4, 4, 4,   /*wall=*/20,  /*wall=*/20, 87,  /*wall=*/20,  /*wall=*/20, 4, 4, 4,  /*wall=*/20],
        [/*wall=*/20, 4, 4, 4, 4,   /*wall=*/20,  /*wall=*/20,  /*wall=*/20, 4, 4, 4, 4,  /*wall=*/20],
        [/*wall=*/20, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,  /*wall=*/20],
        [/*wall=*/20, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,  /*wall=*/20],
        [/*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20, /*wall=*/20],
    ],
    firstArriveEvents: [

    ],
    pointTriggerEvents: {

    },
    switchFloorEvent: {
        "6,8": { floorId: 17, stairDirection: "downFloor" },
        "7,1": { floorId: 15, stairDirection: "upFloor" },
    },
    postBattleEvent: {
        "6,6": [
            "\t[redKing]你叫{player}是吗？有点东西嘛",
            "\t[redKing]我能告诉你的我并不是不是END，真正的挑战还在后面呢。"
        ]
    },
    postGetItemEvent: {},
    postOpenDoorEvent: {
        "6,4":  [
            "\t[redKing]区区人类也来挑战我？"
        ]
    },
    blockCannotMoveDirections: {},
};