import { isset } from "../../common/util";
import { getFloorById, getMapData } from "../../floor/data";
import { damage } from "./canvas";
import { config } from "../../common/config";
import { BLACK, BLOCK_WIDTH, CANVAS_BLOCK_WIDTH_CNT, DAMAGE_DISPLAY_FONT, GREEN, MAX, ORANGE, PINK, RED, WHITE, YELLOW } from "../../common/constants";
import { playerMgr } from "../../player/data";
import { enemiesMgr } from "../../enemies/data";

export class BlockingContext {
    private static instance: BlockingContext;

    // (x, y)点的伤害 | damage of (x, y) point
    damage: { [key: string]: number } = {};
    // 地图怪物id | enemy on the map
    map: { [key: string]: string } = {};
    // (x, y)是否有阻击 | whether (x, y) has block
    hasBlock: { [key: string]: boolean } = {};

    private constructor() {
        if (BlockingContext.instance) {
            throw new Error("Error: Instantiation failed: Use BlockingContext.getInstance() instead of new.");
        }
        BlockingContext.instance = this;
    }

    static getInstance() {
        if (!BlockingContext.instance) {
            BlockingContext.instance = new BlockingContext();
        }
        return BlockingContext.instance;
    }

    reset() {
        this.damage = {};
        this.map = {};
        this.hasBlock = {};
    }
};

export let blockingCtx: BlockingContext;

export function initBlockingContext() {
    blockingCtx = BlockingContext.getInstance();
}

// 更新全地图显伤 | update all map's damage display
export function updateDamageDisplay() {
    console.log('update damage display');
    let map = getMapData();

    if (!isset(map.blocks)) {
        return;
    }

    damage.clearRect();

    let mapBlocks = map.blocks!;

    if (!playerMgr.hasItem('encyclopedia')) {
        console.log('no Encyclopedia');
        return;
    }
    console.log('has Encyclopedia');

    damage.setFont(DAMAGE_DISPLAY_FONT);

    const player_hp = playerMgr.getPlayerHP();
    if (config.displayEnemyDamage) {

        damage.setTextAlign('left');

        for (let i = 0; i < mapBlocks.length; i++) {
            const block = mapBlocks[i]
            let x = block.x, y = block.y;
            if (isset(block.event) && block.event?.type == 'enemies'
                && !(isset(block.enable) && !block.enable)) {

                // 非系统默认的战斗事件（被覆盖）
                if (block.event.trigger != 'battle') {
                    // 判断显伤
                    let pointTriggerEvents = getFloorById()!.pointTriggerEvents;
                    let block = x + "," + y;
                    if (block in pointTriggerEvents) {
                        let event = pointTriggerEvents[block];
                        if (!(event instanceof Array)) {
                            if (isset(event.displayDamage) && !event.displayDamage) {
                                continue;
                            }
                        }
                    }
                }

                let num = enemiesMgr.getDamage(block.event.id);

                let color = BLACK;
                if (num <= 0)
                    color = GREEN;
                else if (num < player_hp / 3)
                    color = WHITE;
                else if (num < player_hp * 2 / 3)
                    color = YELLOW;
                else if (num < player_hp)
                    color = PINK;
                else
                    color = RED;

                let damageStr: string = num.toString();
                if (num >= MAX)
                    damageStr = "???";
                else if (num > 100000)
                    damageStr = (num / 10000).toFixed(1) + "w";

                damage.setFillStyle(BLACK);
                damage.fillText(damageStr, BLOCK_WIDTH * x + 2, BLOCK_WIDTH * (y + 1) - 2);
                damage.fillText(damageStr, BLOCK_WIDTH * x, BLOCK_WIDTH * (y + 1) - 2);
                damage.fillText(damageStr, BLOCK_WIDTH * x + 2, BLOCK_WIDTH * (y + 1));
                damage.fillText(damageStr, BLOCK_WIDTH * x, BLOCK_WIDTH * (y + 1));

                damage.setFillStyle(color);
                damage.fillText(damageStr, BLOCK_WIDTH * x + 1, BLOCK_WIDTH * (y + 1) - 1);

            }
        }
    }

    if (config.displayExtraDamage) {
        damage.setTextAlign('center');
        for (let x = 0; x < CANVAS_BLOCK_WIDTH_CNT; x++) {
            for (let y = 0; y < CANVAS_BLOCK_WIDTH_CNT; y++) {
                let damageNum = blockingCtx.damage[CANVAS_BLOCK_WIDTH_CNT * x + y];
                if (damageNum > 0) {
                    let damageStr: string = damage.toString();
                    damage.drawText(damageStr, BLOCK_WIDTH * x + BLOCK_WIDTH / 2 + 1, BLOCK_WIDTH * (y + 1) - CANVAS_BLOCK_WIDTH_CNT, BLACK);
                    damage.drawText(damageStr, BLOCK_WIDTH * x + BLOCK_WIDTH / 2 - 1, BLOCK_WIDTH * (y + 1) - BLOCK_WIDTH / 2 + 1, BLACK);
                    damage.drawText(damageStr, BLOCK_WIDTH * x + BLOCK_WIDTH / 2 + 1, BLOCK_WIDTH * (y + 1) - BLOCK_WIDTH / 2 + 1, BLACK);
                    damage.drawText(damageStr, BLOCK_WIDTH * x + 15, BLOCK_WIDTH * (y + 1) - CANVAS_BLOCK_WIDTH_CNT, BLACK);
                    damage.drawText(damageStr, BLOCK_WIDTH * x + BLOCK_WIDTH / 2, BLOCK_WIDTH * (y + 1) - BLOCK_WIDTH / 2 + 2, ORANGE);
                }
            }
        }
    }
}
