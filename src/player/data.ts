import { GameLevel } from "../common/config";
import { DIRECTION_TO_POINT_MAP } from "../common/constants";
import { core } from "../common/global";
import { callertrace, isset, log } from "../common/util";
import { eventManager } from "../events/events";
import { getBlockAtPointOnFloor } from "../floor/block";
import i18next from "i18next";
import { itemMgr } from "../items/data";
import { PlayerItems } from "../items/playerItem";
import { canvasAnimate } from "../window/canvas/animates";
import { canvas } from "../window/canvas/canvas";

export interface PlayerLocation {
    // 面朝方向 | facing direction
    direction: string; // up/down/left/right
    // x坐标 | x coordinate
    x: number;
    // y坐标 | y coordinate
    y: number;
}

export interface PlayerData {
    // 是否是男性 | is man
    isMan: boolean;
    // 玩家名称 | player name
    name: string;

    // 玩家等级 | player level
    level: number;
    // 玩家生命值 | player hp
    hp: number;
    // 玩家攻击力 | player attack
    attack: number;
    // 玩家防御力 | player defense
    defense: number;
    // 玩家金币 | player money
    money: number;
    // 玩家经验 | player exp
    exp: number;

    // 玩家图片的高度 | player icon height
    iconHeight: number;
    // 玩家所在楼层ID | player floor ID
    floorId: number;
    // 玩家位置 | player location
    loc: PlayerLocation;
    // 当前移动中经过几次间隔 | current moving interval count
    movingIntervalCnt: number;
    // 玩家是否在移动中 | is moving
    isMoving: boolean;
    // 玩家物品 | player items
    items: PlayerItems;
    // 可使用传送器的楼层ID范围 | transport enabled floorIDs range
    transportEnabledRange: number[];

    // 玩家步数 | player step count
    steps: number;
}

export const base_player_data: PlayerData = {
    isMan: true,
    name: "Player",

    level: 1,
    hp: 1000,
    attack: 10,
    defense: 10,
    money: 0,
    exp: 0,
    movingIntervalCnt: 0,
    isMoving: false,
    iconHeight: 0,
    loc: {
        direction: "up",
        x: 6,
        y: 8,
    },
    items: {
        keys: {
            yellow: 0,
            blue: 0,
            red: 0,
            green: 0,
        },
        constants: {},
        tools: {}
    },
    floorId: 0,
    transportEnabledRange: [],
    steps: 0
};

class PlayerManager {
    private player_data: PlayerData = { ...base_player_data };

    // 根据选择的难度初始化玩家数据 | Init player data by selected difficulty
    @log
    setupPlayerDataByGameLevel(level: GameLevel): void {
        this.player_data = { ...base_player_data };
        switch (level) {
            case GameLevel.Easy:
                this.player_data.hp += 200;
                this.player_data.attack += 3;
                this.player_data.defense += 3;
                this.player_data.items.keys.yellow += 1;
                this.player_data.items.keys.blue += 1;
                this.player_data.items.keys.red += 1;
                break;
            case GameLevel.Normal:
                this.player_data.items.keys.yellow += 1;
                this.player_data.items.keys.blue += 1;
                break;
            case GameLevel.Hard:
                this.player_data.items.keys.yellow += 1;
                break;
        }
    }

    getPlayerData() {
        return this.player_data;
    }

    setPlayerData(playerData: PlayerData) {
        this.player_data = playerData;
    }

    resetPlayerData() {
        this.player_data = { ...base_player_data };
    }

    getPlayerProperty(propertyName: string) {
        return this.player_data[propertyName as keyof PlayerData];
    }
    setPlayerProperty(propertyName: string, value: any) {
        if (isset(this.player_data[propertyName as keyof PlayerData])) {
            (this.player_data as any)[propertyName] = value;
        }
    }

    addPlayerKey(keyColor: string, amount: number = 1) {
        this.player_data.items.keys[keyColor] += amount;
    }

    setPlayerKey(keyColor: string, amount: number = 1) {
        this.player_data.items.keys[keyColor] = amount;
    }

    removePlayerKey(keyColor: string, amount: number = 1) {
        this.player_data.items.keys[keyColor] -= amount;
    }

    getPlayerKeyCount(keyColor: string) {
        return this.player_data.items.keys[keyColor];
    }

    hasPlayerKey(keyColor: string) {
        return this.player_data.items.keys[keyColor] > 0;
    }

    setPlayerConstant(constantName: string, amount: number) {
        this.player_data.items.constants[constantName] = amount;
    }

    getPlayerConstantCount(constantName: string) {
        return this.player_data.items.constants[constantName];
    }

    addPlayerConstant(constantName: string, amount: number) {
        if (constantName in this.player_data.items.constants) {
            this.player_data.items.constants[constantName] += amount;
        } else {
            this.player_data.items.constants[constantName] = amount;
        }
    }

    hasPlayerConstant(constantName: string) {
        return constantName in this.player_data.items.constants && this.player_data.items.constants[constantName] > 0;
    }

    getPlayerConstants() {
        return this.player_data.items.constants;
    }

    setPlayerTool(toolName: string, amount: number) {
        this.player_data.items.tools[toolName] = amount;
    }

    addPlayerTool(toolName: string, amount: number) {
        if (toolName in this.player_data.items.tools) {
            this.player_data.items.tools[toolName] += amount;
        } else {
            this.player_data.items.tools[toolName] = amount;
        }
    }

    getPlayerToolCount(toolName: string) {
        return this.player_data.items.tools[toolName];
    }

    getPlayerTools() {
        return this.player_data.items.tools;
    }
    
    hasPlayerTool(toolName: string) {
        return toolName in this.player_data.items.tools && this.player_data.items.tools[toolName] > 0;
    }

    @log
    @callertrace
    addItem(itemId: string, itemNum = 1) {
        if (this.getItemCount(itemId) + itemNum < 0) {
            return;
        }
        let itemData = itemMgr.getItemByID(itemId);
        let itemType: string = itemData.type;
        console.log('itemType', itemType);
        switch (itemType) {
            case 'keys':
                this.addPlayerKey(itemId.replace('Key', ''), itemNum);
                break;
            case 'tools':
                this.addPlayerTool(itemId, itemNum);
                break;
            case 'constants':
                this.addPlayerConstant(itemId, itemNum);
                break;
            default:
                break;
        }
    }

    @log
    @callertrace
    setItemAmount(itemId: string, itemNum = 1) {
        let itemData = itemMgr.getItemByID(itemId);
        let itemType: string = itemData.type;
        console.log('itemType', itemType);
        switch (itemType) {
            case 'keys':
                this.setPlayerKey(itemId.replace('Key', ''), itemNum);
                break;
            case 'tools':
                this.setPlayerTool(itemId, itemNum);
                break;
            case 'constants':
                this.setPlayerConstant(itemId, itemNum);
                break;
            default:
                break;
        }
    }

    @callertrace
    @log
    getItemCount(itemId: string) {
        const item = itemMgr.getItemByID(itemId);
        const itemType = item.type
        console.log('itemType', itemType);
        switch (itemType) {
            case 'keys':
                return this.getPlayerKeyCount(itemId.replace('Key', ''));
            case 'tools':
                return this.getPlayerToolCount(itemId);
            case 'constants':
                return this.getPlayerConstantCount(itemId);
            default:
                return 0;
        }
    }

    hasItem(itemId: string) {
        return this.getItemCount(itemId) > 0;
    }

    @log
    @callertrace
    checkStatusSatisfiedAndSetEventId(name: string, needCheckStatus: boolean, needItem?: boolean): boolean {
        console.log('checkStatusSatisfiedAndSetEventId', name, needCheckStatus, needItem);

        // 检查是否已经处理过相同事件
        const eventId = core.getEventId();
        console.log('cur event', core.getEvent());
        if (needCheckStatus && eventId == name) {
            canvasAnimate.closeUIPanel();
            return false;
        }

        // 验证状态是否锁定
        if (needCheckStatus && core.isLocked()) {
            return false;
        }

        // 验证是否有物品
        if (isset(needItem) && needItem && !this.hasItem(name)) {
            canvas.drawTip(`${i18next.t('have_no')}${itemMgr.getItemByID(name).name}`);
            return false;
        }

        if (playerMgr.isPlayerMoving()) {
            canvas.drawTip(i18next.t('stop_move'));
            return false;
        }

        core.lock();
        core.setEventId(name);
        return true;
    }

    getPlayerLoc() {
        return this.player_data.loc;
    }

    getPlayerLocDirection() {
        return this.player_data.loc.direction;
    }

    getPlayerLocX() {
        return this.player_data.loc.x;
    }

    getPlayerLocY() {
        return this.player_data.loc.y;
    }

    getNextX() {
        return this.getPlayerLocX() + DIRECTION_TO_POINT_MAP[this.getPlayerLocDirection()].x;
    }

    getNextY() {
        return this.getPlayerLocY() + DIRECTION_TO_POINT_MAP[this.getPlayerLocDirection()].y;
    }

    setPlayerLoc(loc: PlayerLocation) {
        this.player_data.loc = loc;
    }

    setPlayerLocDirection(direction: string) {
        this.player_data.loc.direction = direction;
    }

    setPlayerLocX(x: number) {
        this.player_data.loc.x = x;
    }

    setPlayerLocY(y: number) {
        this.player_data.loc.y = y;
    }

    addPlayerSteps(amount: number) {
        this.player_data.steps += amount;
    }

    getPlayerHP() {
        return this.player_data.hp;
    }

    getPlayerAttack() {
        return this.player_data.attack;
    }

    getPlayerDefense() {
        return this.player_data.defense;
    }

    getPlayerMoney() {
        return this.player_data.money;
    }

    getPlayerExp() {
        return this.player_data.exp;
    }

    getPlayerLevel() {
        return this.player_data.level;
    }

    getPlayerMovingIntervalCnt() {
        return this.player_data.movingIntervalCnt;
    }

    getPlayerItems() {
        return this.player_data.items;
    }

    getPlayerTransportEnabledRange() {
        return this.player_data.transportEnabledRange;
    }

    addPlayerTransportEnabledFloor(destFloorId: number, consideringCurrentFloorOrder: boolean = true) {
        if (consideringCurrentFloorOrder && destFloorId > this.getFloorId()) {
            this.player_data.transportEnabledRange.push(destFloorId);
        } else {
            this.player_data.transportEnabledRange.unshift(destFloorId);
        }
    }

    isPlayerMoving() {
        return this.player_data.isMoving;
    }

    setPlayerHP(hp: number) {
        this.player_data.hp = hp;
    }

    addPlayerHP(hp: number) {
        this.player_data.hp += hp;
    }

    setPlayerLevel(level: number) {
        this.player_data.level = level;
    }

    addPlayerLevel(level: number = 1) {
        this.player_data.level += level;
    }

    setPlayerAttack(attack: number) {
        this.player_data.attack = attack;
    }

    addPlayerAttack(attack: number) {
        this.player_data.attack += attack;
    }

    setPlayerDefense(defense: number) {
        this.player_data.defense = defense;
    }

    addPlayerDefense(defense: number) {
        this.player_data.defense += defense;
    }

    setPlayerMoney(money: number) {
        this.player_data.money = money;
    }

    addPlayerMoney(money: number) {
        this.player_data.money += money;
    }

    setPlayerExp(exp: number) {
        this.player_data.exp = exp;
    }

    addPlayerExp(exp: number) {
        this.player_data.exp += exp;
    }

    setPlayerMovingIntervalCnt(cnt: number) {
        this.player_data.movingIntervalCnt = cnt;
    }

    addPlayerMovingIntervalCnt(cnt: number = 1) {
        this.player_data.movingIntervalCnt += cnt;
    }

    resetPlayerMovingIntervalCnt() {
        this.setPlayerMovingIntervalCnt(0);
    }

    setPlayerIsMoving(isMoving: boolean) {
        this.player_data.isMoving = isMoving;
    }

    setPlayerStop() {
        this.setPlayerIsMoving(false);
    }

    setFloorId(floorId: number) {
        this.player_data.floorId = floorId;
    }

    getFloorId() {
        return this.player_data.floorId;
    }

    setPlayerIconHeight(height: number) {
        this.player_data.iconHeight = height;
    }

    getPlayerIconHeight() {
        return this.player_data.iconHeight;
    }

    setPlayerIsMan(isMan: boolean) {
        this.player_data.isMan = isMan;
    }

    isPlayerMan() {
        return this.player_data.isMan;
    }

    setPlayerName(name: string) {
        this.player_data.name = name;
    }

    getPlayerName() {
        return this.player_data.name;
    }

    stairExists(x: number, y: number, floorId?: number) {
        let block = getBlockAtPointOnFloor(x, y, floorId);
        return isset(block) && block!.block.event?.type == 'terrains' && (block!.block.event?.id == 'upFloor' || block!.block.event?.id == 'downFloor');
    }

    isNearStair(): boolean {
        let x = this.getPlayerLocX();
        let y = this.getPlayerLocY();
        return this.stairExists(x, y) || this.stairExists(x - 1, y) || this.stairExists(x, y - 1) || this.stairExists(x + 1, y) || this.stairExists(x, y + 1);
    }

    getPlayerSteps() {
        return this.player_data.steps;
    }

    resetPlayerSteps() {
        this.player_data.steps = 0;
    }

    incPlayerSteps() {
        this.player_data.steps++;
    }

    setPlayerSteps(steps: number) {
        this.player_data.steps = steps;
    }
}

export const playerMgr = new PlayerManager();