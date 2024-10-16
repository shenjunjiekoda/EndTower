import { isset } from "../../common/util";
import { getBlockAtPointOnFloor } from "../../floor/block";
import { getFloorById, getMapData } from "../../floor/data";
import { playerMgr } from "../../player/data";
import { canvasAnimate } from "./animates";
import { event } from "./canvas";
import { BLOCK_WIDTH } from "../../common/constants";
import { updateDamageDisplay } from "./damage";

export function removeBlockById(index: number, floorId: number) {
    const map = getMapData(floorId);
    let blocks = map.blocks;
    const x = blocks[index].x, y = blocks[index].y;

    const floor = getFloorById(floorId)!;

    // 检查该点是否存在事件
    let block: string = x + "," + y;
    let event = undefined;
    if (!(block in floor.pointTriggerEvents)) {
        if (block in floor.switchFloorEvent) {
            event = floor.switchFloorEvent[block];
        }
    } else {
        event = floor.pointTriggerEvents[block];
    }

    // 不存在事件，直接删除
    if (!isset(event)) {
        blocks.splice(index, 1);
        return;
    }
    blocks[index].enable = false;
}

export function removeBlockByIds(floorId: number, ids: number[]) {
    ids.sort((a, b) => b - a).forEach(id => {
        removeBlockById(id, floorId);
    });
}

export function removeBlock(x: number, y: number, floorId?: number) {
    floorId = floorId || playerMgr.getFloorId();

    let block = getBlockAtPointOnFloor(x, y, floorId, false);
    if (!isset(block)) {
        return;
    }

    let index = block!.index;

    if (floorId == playerMgr.getFloorId()) {
        canvasAnimate.removeGlobalAnimatePoint(x, y);
        event.clearRect(x * BLOCK_WIDTH, y * BLOCK_WIDTH, BLOCK_WIDTH, BLOCK_WIDTH);
    }

    removeBlockById(index, floorId);
    updateDamageDisplay();
}
