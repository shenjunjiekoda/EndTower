
import { Floor } from "floor/data";

export const floor8: Floor = {
    floorId: 8,
    title: "main_8",
    transporterEnabled: true,
    quickShopEnabled: true,
    defaultGround: "ground",
    map: [
        [/*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18],
        [/*wall=*/18, 88,  /*wall=*/18, 0, 0, 0, 0,   /*wall=*/18, 0, 21, 211, 0,  /*wall=*/18],
        [/*wall=*/18, 0,   /*wall=*/18, 0,   /*wall=*/18,   /*wall=*/18, 81,  /*wall=*/18, 81,  /*wall=*/18,   /*wall=*/18, 0,  /*wall=*/18],
        [/*wall=*/18, 0,   /*wall=*/18, 0,   /*wall=*/18, 0, 0, 82, 0, 0,   /*wall=*/18, 27, /*wall=*/18],
        [/*wall=*/18, 0,   /*wall=*/18, 0,   /*wall=*/18, 219, /*wall=*/18,   /*wall=*/18,   /*wall=*/18, 206, /*wall=*/18, 203,/*wall=*/18],
        [/*wall=*/18, 206, /*wall=*/18, 0,   /*wall=*/18, 31,  /*wall=*/18, 87, 0, 0,   /*wall=*/18, 203,/*wall=*/18],
        [/*wall=*/18, 207, /*wall=*/18, 28,  /*wall=*/18, 31,  /*wall=*/18,   /*wall=*/18,   /*wall=*/18,   /*wall=*/18,   /*wall=*/18, 0,  /*wall=*/18],
        [/*wall=*/18, 206, /*wall=*/18, 203, /*wall=*/18, 0, 0, 0,   /*wall=*/18, 0, 207, 0,  /*wall=*/18],
        [/*wall=*/18, 0,   /*wall=*/18, 203, /*wall=*/18,   /*wall=*/18,   /*wall=*/18, 221, /*wall=*/18, 81,  /*wall=*/18,   /*wall=*/18,  /*wall=*/18],
        [/*wall=*/18, 0,   /*wall=*/18, 0, 211, 0,   /*wall=*/18, 211, /*wall=*/18, 0, 0, 0,  /*wall=*/18],
        [/*wall=*/18, 0,   /*wall=*/18,   /*wall=*/18,   /*wall=*/18, 81,  /*wall=*/18, 0,   /*wall=*/18,   /*wall=*/18,   /*wall=*/18, 0,  /*wall=*/18],
        [/*wall=*/18, 0, 0, 219, 0, 0,   /*wall=*/18, 0, 204, 246, 204, 0,  /*wall=*/18],
        [/*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18, /*wall=*/18],
    ],
    firstArriveEvents: [

    ],
    pointTriggerEvents: {
    },
    switchFloorEvent: {
        "7,5": { floorId: 9, stairDirection: "downFloor" },
        "1,1": { floorId: 7, stairDirection: "upFloor" },
    },
    postBattleEvent: {},
    postGetItemEvent: {},
    postOpenDoorEvent: {},
    blockCannotMoveDirections: {},
};