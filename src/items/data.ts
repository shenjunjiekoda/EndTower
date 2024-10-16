import { config } from "../common/config";
import { core } from "../common/global";
import { callertrace, isset, log } from "../common/util";
import { getBlock, getBlockAtPointOnFloor } from "../floor/block";
import { getAllFloorIds, getMapData } from "../floor/data";
import { playerMgr } from "../player/data";
import { canvas, player, ui } from "../window/canvas/canvas";
import statusBar from "../window/statusBar";
import { PlayerItems } from "./playerItem";
import { drawPlayer } from "../window/canvas/player";
import { updateDamageDisplay } from "../window/canvas/damage";
import i18next from "i18next";
import { enemiesMgr } from "../enemies/data";
import { canvasAnimate } from "../window/canvas/animates";
import { eventManager } from "../events/events";
import { BLOCK_WIDTH } from "../common/constants";
import { removeBlockByIds } from "../window/canvas/map";
import { switchFloor } from "../floor/switch";
import { route } from "../player/route";
import { drawEncyclopedia, drawOpenEncyclopedia, drawTransporter } from "../window/canvas/functionality";

export interface Item {
    type: string;
    name: string;
    desc?: string;
}

class ItemManager {
    private items!: Record<string, Item>;

    constructor() {
        this.initItems();
    }

    private initKeys() {
        return {
            // 钥匙 | Keys
            'yellowKey': { type: 'keys', name: '黄钥匙' },
            'blueKey': { type: 'keys', name: '蓝钥匙' },
            'redKey': { type: 'keys', name: '红钥匙' },
            'greenKey': { type: 'keys', name: '绿钥匙' },
            'bigKey': { type: 'tools', name: '大黄门钥匙', desc: '可以开启当前层所有黄门' },
            'steelKey': { type: 'tools', name: '铁门钥匙', desc: '可以打开一扇铁门' },
        };
    }

    private initJewels() {
        return {
            // 宝石 | Jewels
            'redJewel': { type: 'trigger', name: '红宝石' },
            'blueJewel': { type: 'trigger', name: '蓝宝石' },
            'greenJewel': { type: 'trigger', name: '绿宝石' },
            'yellowJewel': { type: 'trigger', name: '黄宝石' },
        };
    }

    private initPotions() {
        return {
            // 药水 | Potions
            'redPotion': { type: 'trigger', name: '红血瓶' },
            'bluePotion': { type: 'trigger', name: '蓝血瓶' },
            'yellowPotion': { type: 'trigger', name: '黄血瓶' },
            'greenPotion': { type: 'trigger', name: '绿血瓶' },
            'superPotion': { type: 'trigger', name: '圣水' },
        };
    }

    private initWeapons() {
        return {
            // 武器 | Weapons
            'sword0': { type: 'constants', name: '折断的剑', desc: '没有任何作用的剑，相当于脱掉装备。' },
            'sword1': { type: 'trigger', name: '铁剑' },
            'sword2': { type: 'trigger', name: '银剑' },
            'sword3': { type: 'trigger', name: '骑士剑' },
            'sword4': { type: 'trigger', name: '圣剑' },
            'sword5': { type: 'trigger', name: '神圣剑' }
        };
    }

    private initArmors() {
        // 盾牌 | Shields
        return {
            'shield0': { type: 'constants', name: '残破的盾', desc: '没有任何作用的盾，相当于脱掉装备。' },
            'shield1': { type: 'trigger', name: '铁盾' },
            'shield2': { type: 'trigger', name: '银盾' },
            'shield3': { type: 'trigger', name: '骑士盾' },
            'shield4': { type: 'trigger', name: '圣盾' },
            'shield5': { type: 'trigger', name: '神圣盾' },
        };
    }

    private initWines() {
        return {
            'poisonWine': { type: 'tools', name: '解毒药水', desc: '可以解除中毒状态' },
            'weakWine': { type: 'tools', name: '解衰药水', desc: '可以解除衰弱状态' },
            'curseWine': { type: 'tools', name: '解咒药水', desc: '可以解除诅咒状态' },
            'superWine': { type: 'tools', name: '万能药水', desc: '可以解除所有不良状态' },
        };
    }

    private checkAndSetBigKeyIsBox() {
        if (config.bigKeyIsBox) {
            this.items['bigKey'] = { type: 'trigger', name: '钥匙盒' };
        }
    }

    private checkAndSetPickaxeFourDirections() {
        if (config.pickaxeFourDirections) {
            this.items['pickaxe'].desc = "可以破坏勇士四周的墙";
        }
    }

    private checkAndSetBombFourDirections() {
        if (config.bombFourDirections) {
            this.items['bomb'].desc = "可以炸掉勇士四周的怪物";
        }
    }

    private checkAndSetIndirectEquipment() {
        if (!config.equipmentDirectly) {
            this.items.sword1 = { type: 'constants', name: '铁剑', desc: '一把很普通的铁剑，攻击+' + config.sword1 };
            this.items.sword2 = { type: 'constants', name: '银剑', desc: '一把很普通的银剑，攻击+' + config.sword2 };
            this.items.sword3 = { type: 'constants', name: '骑士剑', desc: '一把很普通的骑士剑，攻击+' + config.sword3 };
            this.items.sword4 = { type: 'constants', name: '圣剑', desc: '一把很普通的圣剑，攻击+' + config.sword4 };
            this.items.sword5 = { type: 'constants', name: '神圣剑', desc: '一把很普通的神圣剑，攻击+' + config.sword5 };
            this.items.shield1 = { type: 'constants', name: '铁盾', desc: '一个很普通的铁盾，防御+' + config.shield1 };
            this.items.shield2 = { type: 'constants', name: '银盾', desc: '一个很普通的银盾，防御+' + config.shield2 };
            this.items.shield3 = { type: 'constants', name: '骑士盾', desc: '一个很普通的骑士盾，防御+' + config.shield3 };
            this.items.shield4 = { type: 'constants', name: '圣盾', desc: '一个很普通的圣盾，防御+' + config.shield4 };
            this.items.shield5 = { type: 'constants', name: '神圣盾', desc: '一个很普通的神圣盾，防御+' + config.shield5 };
        }
    }

    private initNPCItems() {
        return {
            'cross': { type: 'constants', name: '十字架', desc: '仙子所需要的十字架' },
            'icePickaxe': { type: 'constants', name: '锄头', desc: '小偷需要的锄头' },
            'wand1': { type: 'constants', name: '火之法杖', "desc": "封印Boss需要的物品之一" },
            'wand2': { type: 'constants', name: '冰之法杖', "desc": "封印Boss需要的物品之一" },
        };
    }

    private initOtherItems() {
        return {
            'moneyPocket': { type: 'trigger', name: '金钱袋' },
            'coin': { type: 'trigger', name: '幸运金币' },

            'encyclopedia': { type: 'constants', name: '怪物手册', desc: '可以查看当前楼层各怪物属性' },

            'bomb': { type: 'tools', name: '炸弹', desc: '可以炸掉勇士面前的怪物' },
            'hammer': { type: 'tools', name: '圣锤', desc: '可以炸掉勇士面前的怪物' },

            'pickaxe': { type: 'tools', name: '破墙镐', desc: '可以破坏勇士面前的墙' },
            'earthquake': { type: 'tools', name: '地震卷轴', desc: '可以破坏当前层的所有墙' },

            'transporter': { type: 'constants', name: '楼层传送器', desc: '可以自由往来去过的楼层' },

            'centerFly': { type: 'trigger', name: '小飞羽' },
            'bigFly': { type: 'trigger', name: '大飞羽' },
            'upFly': { type: 'tools', name: '上楼器', desc: '可以飞往楼上的相同位置' },
            'downFly': { type: 'tools', name: '下楼器', desc: '可以飞往楼下的相同位置' },

            'snow': { type: 'constants', name: '冰冻徽章', desc: '可以将四周的熔岩变成平地' },
            'knife': { type: 'constants', name: '屠龙匕首', desc: '该道具尚未被定义' },
            'shoes': { type: 'constants', name: '绿鞋', desc: '持有时无视负面地形' },
        };
    }

    @log
    @callertrace
    initItems() {
        this.items = {
            ...this.initKeys(),
            ...this.initJewels(),
            ...this.initPotions(),
            ...this.initWeapons(),
            ...this.initArmors(),
            ...this.initWines(),
            ...this.initNPCItems(),
            ...this.initOtherItems()
        };

        this.checkAndSetBigKeyIsBox();
        this.checkAndSetPickaxeFourDirections();
        this.checkAndSetBombFourDirections();
        this.checkAndSetIndirectEquipment();
    }


    getItemByID(id: string): Item {
        if (id in this.items) {
            return this.items[id];
        }
        throw new Error(`Item ${id} not found`);
    }

    getItemDirectEffectTip(itemId: string) {
        switch (itemId) {
            case 'redJewel':
                return "，攻击+" + config.redJewel;
            case 'blueJewel':
                return "，防御+" + config.blueJewel;
            case 'greenJewel':
                return "，魔防+" + config.greenJewel;
            case 'yellowJewel':
                return "，全属性提升";
            case 'redPotion':
                return "，生命+" + config.redPotion;
            case 'bluePotion':
                return "，生命+" + config.bluePotion;
            case 'yellowPotion':
                return "，生命+" + config.yellowPotion;
            case 'greenPotion':
                return "，生命+" + config.greenPotion;
            case 'centerFly':
                return "，等级+1";
            case 'bigFly':
                return "，等级+3";
            case 'bigKey':
                return "，全钥匙+1";
            case 'superPotion':
                return "，生命值翻倍";
            case 'coin':
                return "，金币+" + config.moneyPocket;
            case 'sword1':
                return config.equipmentDirectly ? "" : "，攻击+" + config.sword1;
            case 'sword2':
                return config.equipmentDirectly ? "" : "，攻击+" + config.sword2;
            case 'sword3':
                return config.equipmentDirectly ? "" : "，攻击+" + config.sword3;
            case 'sword4':
                return config.equipmentDirectly ? "" : "，攻击+" + config.sword4;
            case 'sword5':
                return config.equipmentDirectly ? "" : "，攻击+" + config.sword5;
            case 'shield1':
                return config.equipmentDirectly ? "" : "，防御+" + config.shield1;
            case 'shield2':
                return config.equipmentDirectly ? "" : "，防御+" + config.shield2;
            case 'shield3':
                return config.equipmentDirectly ? "" : "，防御+" + config.shield3;
            case 'shield4':
                return config.equipmentDirectly ? "" : "，防御+" + config.shield4;
            case 'shield5':
                return config.equipmentDirectly ? "" : "，防御+" + config.shield5;

            default:
                return "";
        }
    }

    useItemEffectDirectly(itemId: string, itemNum: number = 1) {
        console.log(`useItemEffectDirectly ${itemId} ${itemNum}`);
        const item = this.items[itemId];
        const itemType = item.type;
        console.log('item', item);
        console.log('itemtype', itemType);
        switch (itemType) {
            case 'trigger':
                switch (itemId) {
                    case 'redJewel':
                        playerMgr.addPlayerAttack(config.redJewel);
                        break;
                    case 'blueJewel':
                        playerMgr.addPlayerDefense(config.blueJewel);
                        break;
                    case 'greenJewel':
                        playerMgr.addPlayerMoney(config.greenJewel);
                        break;
                    case 'yellowJewel':
                        playerMgr.addPlayerHP(1000);
                        playerMgr.addPlayerAttack(10);
                        playerMgr.addPlayerDefense(10);
                        break;
                    case 'redPotion':
                        playerMgr.addPlayerHP(config.redPotion);
                        break;
                    case 'bluePotion':
                        playerMgr.addPlayerHP(config.bluePotion);
                        break;
                    case 'yellowPotion':
                        playerMgr.addPlayerHP(config.yellowPotion);
                        break;
                    case 'greenPotion':
                        playerMgr.addPlayerHP(config.greenPotion);
                        break;
                    case 'sword1':
                        playerMgr.addPlayerAttack(config.sword1);
                        break;
                    case 'sword2':
                        playerMgr.addPlayerAttack(config.sword2);
                        break;
                    case 'sword3':
                        playerMgr.addPlayerAttack(config.sword3);
                        break;
                    case 'sword4':
                        playerMgr.addPlayerAttack(config.sword4);
                        break;
                    case 'sword5':
                        playerMgr.addPlayerAttack(config.sword5);
                        break;
                    case 'shield1':
                        playerMgr.addPlayerDefense(config.shield1);
                        break;
                    case 'shield2':
                        playerMgr.addPlayerDefense(config.shield2);
                        break;
                    case 'shield3':
                        playerMgr.addPlayerDefense(config.shield3);
                        break;
                    case 'shield4':
                        playerMgr.addPlayerDefense(config.shield4);
                        break;
                    case 'shield5':
                        playerMgr.addPlayerDefense(config.shield5);
                        break;
                    case 'centerFly':
                        playerMgr.addPlayerLevel();
                        playerMgr.addPlayerHP(1000);
                        playerMgr.addPlayerAttack(10);
                    case 'bigFly':
                        playerMgr.addPlayerLevel(4);
                        playerMgr.addPlayerHP(4000);
                        playerMgr.addPlayerAttack(40);
                        playerMgr.addPlayerDefense(40);
                    case 'bigKey':
                        playerMgr.addPlayerKey('yellow');
                        playerMgr.addPlayerKey('blue');
                        playerMgr.addPlayerKey('red');
                        playerMgr.addPlayerKey('green');
                        break;
                    case 'superPotion':
                        playerMgr.addPlayerHP(playerMgr.getPlayerHP());
                        break;
                    case 'coin':
                        playerMgr.addPlayerMoney(config.moneyPocket);
                        break;
                }
                break;
            default:
                playerMgr.addItem(itemId, itemNum);
                break;
        }
    }

    canUsePickaxe(): boolean {
        let ids = [];
        let blocks = getMapData().blocks;
        for (let i = 0; i < blocks.length!; i++) {
            let block = blocks[i];
            if (isset(block.event) && !(isset(block.enable) && !block.enable) &&
                (block.event?.id == 'yellowWall' || block.event?.id == 'whiteWall' || block.event?.id == 'blueWall')) // 能破哪些墙
            {
                if (config.pickaxeFourDirections) {
                    if (Math.abs(block.x - playerMgr.getPlayerLocX()) + Math.abs(block.y - playerMgr.getPlayerLocY()) <= 1) {
                        ids.push(i);
                    }
                }
                else {
                    if (block.x == playerMgr.getNextX() && block.y == playerMgr.getNextY()) {
                        ids.push(i);
                    }
                }
            }
        }
        if (ids.length > 0) {
            core.updateEventData('ids', ids);
            return true;
        }
        return false;
    }

    canUseIcePickaxe(): boolean {
        const blocks = getMapData().blocks;
        const nextX = playerMgr.getNextX();
        const nextY = playerMgr.getNextY();

        return blocks!.some((block, index) => {
            const res = block.event &&
                block.enable !== false &&
                block.x === nextX &&
                block.y === nextY &&
                block.event.id === 'ice';
            if (res) {
                core.updateEventData('ids', [index]);
            }
            return res;
        });
    }

    canUseBomb(): boolean {
        let ids = [];
        const blocks = getMapData().blocks;
        for (let i = 0; i < blocks!.length!; i++) {
            let block = blocks[i];
            if (isset(block.event) && !(isset(block.enable) && !(block.enable!)) && block.event?.type == 'enemys' && Math.abs(block.x - playerMgr.getPlayerLocX()) + Math.abs(block.y - playerMgr.getPlayerLocY()) <= 1) {
                let enemy = enemiesMgr.getEnemyByID(block.event!.id!);
                if (isset(enemy.bomb) && !(enemy.bomb!))
                    continue;
                if (config.bombFourDirections || (block.x == playerMgr.getNextX() && block.y == playerMgr.getNextY()))
                    ids.push(i);
            }
        }
        if (ids.length > 0) {
            core.updateEventData('ids', ids);
            return true;
        }
        return false;
    }

    canUseHammer(): boolean {
        const blocks = getMapData().blocks;
        for (let i = 0; i < blocks.length!; i++) {
            let block = blocks[i];
            if (isset(block.event) && !(isset(block.enable) && !(block.enable!)) && block.event?.type == 'enemys' && block.x == playerMgr.getNextX() && block.y == playerMgr.getNextY()) {
                let enemy = enemiesMgr.getEnemyByID(block.event!.id!);
                if (isset(enemy.bomb) && !(enemy.bomb!))
                    continue;
                core.updateEventData('ids', [i]);
                return true;
            }
        }
        return false;
    }

    canUseEarthquake(): boolean {
        let ids = []
        const blocks = getMapData().blocks;
        for (let i = 0; i < blocks.length!; i++) {
            let block = blocks[i];
            if (isset(block.event) && !(isset(block.enable) && !(block.enable!)) && (block.event?.id == 'yellowWall' || block.event?.id == 'blueWall' || block.event?.id == 'whiteWall'))
                ids.push(i);
        }
        if (ids.length > 0) {
            core.updateEventData('ids', ids);
            return true;
        }
        return false;
    }

    canUseCenterFly(): boolean {
        let toX = 12 - playerMgr.getPlayerLocX(), toY = 12 - playerMgr.getPlayerLocY();
        let block = getBlockAtPointOnFloor(toX, toY);
        if (!isset(block)) {
            core.updateEventData('x', toX);
            core.updateEventData('y', toY);
            return true;
        }
        return false;
    }

    canUseUpFly(): boolean {
        let curFloorId = playerMgr.getFloorId();
        if (curFloorId == getAllFloorIds().length - 1) {
            return false;
        }
        let toFloorId = curFloorId + 1;
        let toX = playerMgr.getPlayerLocX();
        let toY = playerMgr.getPlayerLocY();

        let block = getBlockAtPointOnFloor(toX, toY, toFloorId);
        if (!isset(block)) {
            core.updateEventData('floorId', toFloorId);
            core.updateEventData('x', toX);
            core.updateEventData('y', toY);
            return true;
        }
        return false;
    }

    canUseDownFly(): boolean {
        let curFloorId = playerMgr.getFloorId();
        if (curFloorId == 0) {
            return false;
        }
        let toFloorId = curFloorId - 1;
        let toX = playerMgr.getPlayerLocX();
        let toY = playerMgr.getPlayerLocY();

        let block = getBlockAtPointOnFloor(toX, toY, toFloorId);
        if (!isset(block)) {
            core.updateEventData('floorId', toFloorId);
            core.updateEventData('x', toX);
            core.updateEventData('y', toY);
            return true;
        }
        return false;
    }

    canUseSnow(): boolean {
        let ids = [];
        const blocks = getMapData().blocks;
        for (let i = 0; i < blocks.length!; i++) {
            let block = blocks[i];
            if (isset(block.event) && !(isset(block.enable) && !(block.enable!)) && block.event?.id == 'lava' && Math.abs(block.x - playerMgr.getPlayerLocX()) + Math.abs(block.y - playerMgr.getPlayerLocY()) <= 1) {
                ids.push(i);
            }
        }
        if (ids.length > 0) {
            core.updateEventData('ids', ids);
            return true;
        }
        return false;
    }

    canUseBigKey(): boolean {
        let ids = [];
        const blocks = getMapData().blocks;
        for (let i = 0; i < blocks.length!; i++) {
            let block = blocks[i];
            if (isset(block.event) && !(isset(block.enable) && !(block.enable!)) && block.event?.id == 'yellowDoor') {
                ids.push(i);
            }
        }
        if (ids.length > 0) {
            core.updateEventData('ids', ids);
            return true;
        }
        return false;
    }

    @log
    @callertrace
    canUseItem(itemId: string): boolean {
        if (!playerMgr.hasItem(itemId)) {
            return false;
        }

        switch (itemId) {
            case 'encyclopedia':
                return true;
            case 'fly':
                return playerMgr.getPlayerTransportEnabledRange().includes(playerMgr.getFloorId());
            case 'pickaxe':
                return this.canUsePickaxe();
            case 'icePickaxe':
                return this.canUseIcePickaxe();
            case 'bomb':
                return this.canUseBomb();
            case 'hammer':
                return this.canUseHammer();
            case 'earthquake':
                return this.canUseEarthquake();
            case 'centerFly':
                return this.canUseCenterFly();
            case 'upFly':
                return this.canUseUpFly();
            case 'downFly':
                return this.canUseDownFly();
            case 'snow':
                return this.canUseSnow();
            case 'bigKey':
                return this.canUseBigKey();
            case 'poisonWine':
                return core.hasFlag('poison');
            case 'weakWine':
                return core.hasFlag('weak');
            case 'curseWine':
                return core.hasFlag('curse');
            case 'superWine':
                return core.hasFlag('poison') || core.hasFlag('weak') || core.hasFlag('curse');
            default:
                return false;
        }
    }

    removeItem(itemId: string): boolean {
        if (!playerMgr.hasItem(itemId)) {
            return false;
        }
        let itemtype = this.items[itemId].type;
        playerMgr.getPlayerItems()[itemtype as keyof PlayerItems][itemId]--;
        statusBar.syncPlayerStatus();
        return true;
    }

    useToolBarItem(itemId: string) {
        canvasAnimate.closeUIPanel();

        if (itemId == 'encyclopedia') {
            drawOpenEncyclopedia(false);
            return;
        }
        if (itemId == 'fly') {
            eventManager.handleUseToolBarTransporter(false);
            return;
        }
        if (itemId == 'centerFly') {
            core.setFlag('usingCenterFly', true);
            let fillstyle = 'rgba(255,0,0,0.5)';
            if (this.canUseItem('centerFly')) {
                fillstyle = 'rgba(0,255,0,0.5)';
            }

            ui.fillRect((12 - playerMgr.getPlayerLocX()) * BLOCK_WIDTH, (12 - playerMgr.getPlayerLocY()) * BLOCK_WIDTH, BLOCK_WIDTH, BLOCK_WIDTH, fillstyle);
            canvas.drawTip(i18next.t('center_fly_failed'));
            return;
        }

        if (this.canUseItem(itemId))
            itemMgr.useItem(itemId);
        else
            canvas.drawTip(i18next.t('use_item_failed') + this.items[itemId].name);
    }

    useUpDownFly(itemName: string) {
        switchFloor(parseInt(core.getEventData('id')), undefined, { 'direction': playerMgr.getPlayerLocDirection(), x: core.getEventData('x'), y: core.getEventData('y') }, undefined, () => {
            canvas.drawTip(i18next.t('use_item') + itemName);
        });
    }

    useCenterFly(itemName: string) {
        player.clearRect();
        playerMgr.setPlayerLocX(core.getEventData('x'));
        playerMgr.setPlayerLocY(core.getEventData('y'));

        const playerLoc = playerMgr.getPlayerLoc();
        drawPlayer(playerLoc.direction, playerLoc.x, playerLoc.y);
        canvas.drawTip(i18next.t('use_item') + itemName);
    }

    @log
    @callertrace
    useItem(itemId: string, callback?: Function) {
        if (!this.canUseItem(itemId)) {
            console.log(`can not use item ${itemId}`);
            if (isset(callback)) {
                callback!();
            }
            return;
        }
        const item = this.items[itemId];
        const itemtype = item.type;
        console.log('item', item);
        console.log('item type', itemtype);

        switch (itemId) {
            case 'encyclopedia':
                drawEncyclopedia(0);
                break;
            case 'transporter':
                drawTransporter(playerMgr.getPlayerTransportEnabledRange().indexOf(playerMgr.getFloorId()));
                break;
            case 'earthquake':
            case 'bomb':
            case 'pickaxe':
            case 'icePickaxe':
            case 'snow':
            case 'hammer':
            case 'bigKey':
                removeBlockByIds(playerMgr.getFloorId(), core.getEventData('ids'));

                canvas.drawMap(playerMgr.getFloorId(), () => {
                    const playerLoc = playerMgr.getPlayerLoc();
                    drawPlayer(playerLoc.direction, playerLoc.x, playerLoc.y, 'stop');
                    updateDamageDisplay();
                    canvas.drawTip(i18next.t('use_item') + this.items[itemId].name);

                    if (itemId == 'bomb' || itemId == 'hammer') {
                        eventManager.handlePostUseBomb();
                    }
                });
                break;
            case 'centerFly':
                this.useCenterFly(item.name);
                break;
            case 'upFly':
            case 'downFly':
                this.useUpDownFly(item.name);
                break;
            case 'poisonWine':
                core.setFlag('poison', false);
                break;
            case 'weakWine':
                core.setFlag('weak', false);
                playerMgr.addPlayerAttack(config.weakValue);
                playerMgr.addPlayerDefense(config.weakValue);
                break;
            case 'curseWine':
                core.setFlag('curse', false);
                break;
            case 'superWine':
                core.setFlag('poison', false);
                if (core.getFlag('weak', false)) {
                    core.setFlag('weak', false);
                    playerMgr.addPlayerAttack(config.weakValue);
                    playerMgr.addPlayerDefense(config.weakValue);
                }
                core.setFlag('curse', false);
                break;
        }

        statusBar.syncPlayerStatus();
        if (itemId != 'encyclopedia' && itemId != 'fly') {
            route.push("item:" + itemId);
        }
        if (itemtype == 'tools') {
            playerMgr.addItem(itemId, -1);
        }

        if (isset(callback)) {
            callback!();
        }
    }

    getItemSortedIndex(itemId: string): number {
        return Object.keys(this.items).sort().indexOf(itemId);
    }

    getItemBySortedIndex(index: number) {
        Object.keys(this.items).sort().forEach((itemId, i) => {
            if (i == index) {
                return this.items[itemId];
            }
        });
        return undefined;
    }

    getNextItem() {
        if (playerMgr.isPlayerMoving())
            return;
        let nextX = playerMgr.getNextX(), nextY = playerMgr.getNextY();
        let block = getBlockAtPointOnFloor(nextX, nextY);
        if (!isset(block))
            return;

        if (block!.block.event?.trigger == 'getItem') {
            eventManager.handleGetItem(block!.block.event.id, 1, nextX, nextY);
            route.push("getNext");
        }
    }
}

export const itemMgr = new ItemManager();