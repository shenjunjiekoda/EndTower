import { getDomNode, hideDomNode, showDomNode } from "../common/client";
import { config, GameLevel, parseGameLevel, staticConfig } from "../common/config";
import { BLACK, BLOCK_WIDTH, CANVAS_BLOCK_WIDTH_CNT, DIRECTION_TO_POINT_MAP, FPS, GREEN, MAX, PINK, RED, WHITE, YELLOW } from "../common/constants";
import { core } from "../common/global";
import { callertrace, clone, getLocalStorage, isset, log, setLocalStorage, toInt, unshift } from "../common/util";
import { addBlockEvent, addSwitchFloorBlockEvent, Block, createBlock, getBlockAtPointOnFloor, initBlockInfo } from "../floor/block";
import { existTerrain, getFloorById, getMapData, loadMaps, pushBlockToFloor, saveMaps } from "../floor/data";
import { switchFloor, toDirection } from "../floor/switch";
import i18next from "i18next";
import { itemMgr } from "../items/data";
import { autoRoute } from "../player/autoroute";
import { PlayerData, PlayerLocation, playerMgr } from "../player/data";
import { audioMgr } from "../resource/audios";
import { canvasAnimate } from "../window/canvas/animates";
import { canvas, damage, event, ui } from "../window/canvas/canvas";
import { removeBlock } from "../window/canvas/map";
import { drawBattleAnimate, drawQuickShop, drawSLPanel, drawToolbox, showBattleAnimateConfirm, showSexChoose } from "../window/canvas/functionality";
import { drawPlayer, stopPlayer } from "../window/canvas/player";
import menu from "../window/menu";
import statusBar from "../window/statusBar";
import { textAttribute } from "../window/textAttribute";
import { Shop, shopMgr } from "../shops/shops";
import { imageMgr } from "../resource/images";
import { route } from "../player/route";
import { notebook } from "../items/notebook";
import gameWindow from "../window/gameWindow";
import { blockingCtx } from "../window/canvas/damage";
import { enemiesMgr } from "../enemies/data";

export interface SLData {
    floorId: number;
    playerData: PlayerData;
    level: GameLevel;
    maps: Record<number, string>;
    flags: Record<string, any>;
    route: string;
    shops: Record<string, Shop>;
    notes: Record<string, string[]>;
    version: string;
    time: number;
};


export type TriggerEventHandler = (block: Block, callback?: Function) => void;

class EventsManager {
    static Instance: EventsManager;
    private openDoorInterval: NodeJS.Timeout | null = null;
    private triggerEvents: Record<string, TriggerEventHandler> = {};

    private constructor() {
        if (EventsManager.Instance) {
            throw new Error("Error: Instantiation failed: Use EventsManager.Instance instead of new.");
        }
        EventsManager.Instance = this;
    }

    static getInstance(): EventsManager {
        if (!EventsManager.Instance) {
            EventsManager.Instance = new EventsManager();
        }
        return EventsManager.Instance;
    }



    initTriggerEvents() {
        this.triggerEvents = {
            'battle': (block: Block, callback?: Function) => {
                const eventId = block.event?.id!;
                console.log('trigger battle event:', block, eventId);
                this.handleBattle(eventId, block.x, block.y);
                if (isset(callback)) {
                    callback!();
                }
            },
            'getItem': (block: Block, callback?: Function) => {
                console.log('trigger get item:', block);

                const itemId = block.event?.id!;
                console.log('item event id: ', itemId);
                this.handleGetItem(itemId, 1, block.x, block.y);
                if (isset(callback)) {
                    callback!();
                }
            },
            'openDoor': (block: Block, callback?: Function) => {
                console.log('trigger openDoor event:', block);
                this.handleOpenDoor(block.event?.id!, block.x, block.y, true);
                if (isset(callback)) {
                    callback!();
                }
            },
            'switchFloor': (block: Block, callback?: Function) => {
                console.log('trigger switch event:', block);
                console.log('switch floor event data:', block.event!.data);
                const info = block.event?.data instanceof Array ? block.event?.data[0] : block.event?.data;
                const playerLoc: PlayerLocation = playerMgr.getPlayerLoc();
                if (isset(info?.loc)) {
                    playerLoc.x = info!.loc![0];
                    playerLoc.y = info!.loc![1];
                }
                if (isset(info?.direction)) {
                    playerLoc.direction = info!.direction!;
                }
                switchFloor(info!.floorId!, toDirection(info?.stairDirection), playerLoc, info.interval, () => {
                    // console.log('lock here5\n');
                    // coreStatus.locked = true;
                    if (isset(callback)) {
                        callback!();
                    }
                });
            },
            'passNet': (block: Block, callback?: Function) => {
                // passNet(x, y);
                if (isset(callback)) {
                    callback!();
                }
            },
            'pushBox': (block: Block, callback?: Function) => {
                // pushBox(event.id, x, y);
                if (isset(callback)) {
                    callback!();
                }
            },
            'action': (block: Block, callback?: Function) => {
                this.handle(block.event!.data, block.x, block.y);
                if (isset(callback)) {
                    callback!();
                }
            },
        };
    }

    @log
    @callertrace
    handle(action: any, x?: number, y?: number, callback?: Function) {
        let list = action;
        if (!(action instanceof Array)) {
            list = [action];
        }

        const OnPlayerStop = () => {
            core.lock();

            core.setEventId('action');
            core.setNewEventData({
                list: clone(list),
                x: x,
                y: y,
            });
            core.setEventCallback(callback);
            this.handleAction();
        };

        stopPlayer(OnPlayerStop);
    }

    handleTextBoxEvent(elem: string) {
        core.updateEventData('type', 'text');
        canvas.drawTextBox(elem);
    }

    @log
    @callertrace
    doOrInsertAction(action: any, x?: number, y?: number, callback?: Function) {
        console.log('do or insert action event', core.getEvent());
        if (!core.isEventSet()) {
            console.log('do event here:', action, ' at', x, ',', y, 'callback:', callback);
            this.handle(action, x, y, callback);
            return;
        }

        console.log('insert action: ', action, ' at', x, ',', y, 'callback:', callback);
        core.unshiftEventDataList(action);
        if (isset(x)) {
            core.updateEventData('x', x!);
        }
        if (isset(y)) {
            core.updateEventData('y', y!)
        }
        if (isset(callback)) {
            core.setEventCallback(callback!);
        }
    }

    handleAction() {
        canvasAnimate.resetRegionAnimate();

        ui.clearRect()
        ui.setAlpha(1);

        if (!core.hasEventDataList()) {
            if (core.hasEventCallback()) {
                core.getEventCallback()();
            }
            canvasAnimate.closeUIPanel();
            return;
        }

        const elem = core.shiftEventDataList();

        console.log('handle cur elem:', elem);
        core.updateEventData('current', elem);

        if (typeof elem == 'string') {
            this.handleTextBoxEvent(elem);
            return;
        }

        let x = core.getEventData('x');
        let y = core.getEventData('y');

        const data = elem as { data: string, type: string, [key: string]: any };
        console.log('data:', data);
        console.log('data.type:', data.type);
        switch (data.type) {
            case 'text':
                canvas.drawTextBox(data.data);
                break;
            case 'setText':
                const pos = data.position as string;
                if (['up', 'down', 'center'].includes(pos)) {
                    textAttribute.position = pos;
                }
                ["background", "title", "text"].forEach((t) => {
                    if (isset(data[t]) && (data[t] instanceof Array) && data[t].length >= 3) {
                        if (data[t].length == 3) {
                            data[t].push(1);
                        }
                        (textAttribute as any).t = data[t];
                    }
                });
                this.handleAction();
                break;
            case 'move':
                if (isset(data.loc)) {
                    x = data.loc[0] as number;
                    y = data.loc[1] as number;
                }
                canvasAnimate.moveBlockAnimate(x!, y!, data.steps, data.time, data.immediateHide,
                    eventMgr.handleAction);
                break;
            case 'show':
                console.log('show action data:', data);
                if (typeof data.loc[0] == 'number' && typeof data.loc[1] == 'number') {
                    data.loc = [data.loc];
                }
                if (isset(data.time) && data.time > 0 && (!isset(data.floorId) || data.floorId == playerMgr.getFloorId())) {
                    data.loc.forEach((loc: number[]) => {
                        canvasAnimate.showBlockAnimate(loc[0], loc[1], data.floorId);
                    });
                    eventMgr.handleAction();
                } else {
                    data.loc.forEach((loc: number[]) => {
                        canvasAnimate.showBlockAnimate(loc[0], loc[1], data.floorId);
                    });
                    eventMgr.handleAction();
                }
                break;
            case 'hide':
                if (!isset(data.loc)) {
                    data.loc = [x, y];
                }
                if (typeof data.loc[0] == 'number' && typeof data.loc[1] == 'number') {
                    data.loc = [data.loc];
                }
                data.loc.forEach((t: number[]) => {
                    removeBlock(t[0], t[1], data.floorId);
                })
                if (isset(data.time) && data.time > 0 && (!isset(data.floorId) || data.floorId == playerMgr.getFloorId())) {
                    canvasAnimate.blockHideShowAnimate(data.loc, false, data.time, this.handleAction);
                }
                else {
                    this.handleAction();
                }

                break;
            case 'setValue':
                console.log('setValue data:', data);
                const value = eventMgr.evalValue(data.value);
                console.log('setValue:', value);

                if ((data.name as string).startsWith("status:")) {
                    let val = toInt(value);
                    playerMgr.setPlayerProperty(data.name.substring("status:".length), val);
                }

                if ((data.name as string).startsWith('item:')) {
                    const itemId = data.name.slice(5);
                    console.log('setItem ', itemId, ': ', value);
                    playerMgr.setItemAmount(itemId, value);
                }

                if (data.name.indexOf("flag:") == 0) {
                    core.setFlag(data.name.substring(5), value);
                }

                if (playerMgr.getPlayerHP() <= 0) {
                    playerMgr.setPlayerHP(0);
                    statusBar.syncPlayerStatus();
                    this.handleGameover('damaged');
                    return;
                } else {
                    statusBar.syncPlayerStatus();
                    this.handleAction();
                }
                break;
            case 'if':
                console.log('if data:', data);
                const condition = eventMgr.evalValue(data.condition) as boolean;
                console.log('condition:', condition);
                if (condition) {
                    eventMgr.doOrInsertAction(data.true);
                } else {
                    eventMgr.doOrInsertAction(data.false);
                }
                this.handleAction();
                break;
            case 'switchFloor':
                console.log('doaction switchFloor data:', data);
                let playerLoc: PlayerLocation = { "x": data.loc[0], "y": data.loc[1], direction: data.direction };
                // if (isset(data.direction))  {
                //     playerLoc.direction=data.direction;
                // }
                switchFloor(data.floorId || getFloorById(), undefined, playerLoc, data.time, () => {
                    core.lock();
                    this.handleAction();
                });
                break;
            case 'setBlock':
                {
                    if (isset(data.loc)) {
                        x = data.loc[0];
                        y = data.loc[1];
                    }
                    let floorId = data.floorId || playerMgr.getFloorId();
                    let floor = getFloorById(floorId)!;
                    let originBlock = getBlockAtPointOnFloor(x!, y!, data.floorId, false);
                    let block = getBlockAtPointOnFloor(x!, y!, data.number)!.block;
                    initBlockInfo(block);
                    addBlockEvent(block, x!, y!, floor.pointTriggerEvents[x + "," + y]);
                    addSwitchFloorBlockEvent(floorId, block, x!, y!, floor.switchFloorEvent[x + "," + y]);
                    if (isset(block.event)) {
                        if (!isset(originBlock)) {
                            pushBlockToFloor(floorId, block);
                        }
                        else {
                            originBlock!.block.id = data.number;
                            originBlock!.block.event = block.event;
                        }
                        if (floorId == playerMgr.getFloorId()) {
                            canvas.drawMap(floorId);
                            drawPlayer();
                            statusBar.syncPlayerStatus();
                        }
                    }
                    this.handleAction();
                    break;
                }
            case 'openShop':
                console.log('doaction openShop data:', data);
                this.handleOpenShop(data.id);
                break;
            case 'win':
                console.log('doaction win data:', data);
                this.handleWin(data.reason, () => {
                    this.handleAction();
                })
            case 'openDoor':
                let floorId = data.floorId || getFloorById();
                if (!isset(data?.loc)) {
                    return;
                }
                let openDoorBlock = getBlockAtPointOnFloor(data.loc[0], data.loc[1], floorId);
                if (isset(openDoorBlock)) {
                    if (floorId == getFloorById())
                        eventMgr.handleOpenDoor(openDoorBlock!.block.event!.id, openDoorBlock!.block.x, openDoorBlock!.block.y, false, () => {
                            this.handleAction();
                        })
                    else {
                        removeBlock(openDoorBlock!.block.x, openDoorBlock!.block.y, floorId);
                        this.handleAction();
                    }
                    break;
                }
                this.handleAction();
                break;
            case 'animate':
                if (isset(data.loc)) {
                    if (data.loc == 'player') {
                        x = playerMgr.getPlayerLoc().x;
                        y = playerMgr.getPlayerLoc().y;
                    }
                    else if (data.loc instanceof Array) {
                        x = data.loc[0];
                        y = data.loc[1];
                    }
                }
                canvasAnimate.draw(data.name, x!, y!, this.handleAction);
                break;
            case 'choices':
                canvas.drawChoices(data.text, data.choices);
                break;
            case 'revisit':
                let revisitBlock = getBlockAtPointOnFloor(x!, y!);
                if (isset(revisitBlock)) {
                    let revisitBB = revisitBlock!.block;
                    if (isset(revisitBB!.event) && revisitBB!.event!.trigger == 'action') {
                        core.setEventDataList(clone(revisitBB!.event!.data));
                    }
                }
                this.handleAction();
                break;
            case "exit":
                core.clearEventDataList();
                this.handleAction();
                break;
            default:
                core.updateEventData('type', 'text');
                canvas.drawTextBox("\t[警告]出错啦！\n" + data.type + " 事件不被支持...");

        }

    }

    evalValue(value: string): any {
        console.log('eval value:', value);
        value = value.replace(/status:([\w\d_]+)/g, "this.getPlayerProperty('\$1')");
        value = value.replace(/item:([\w\d_]+)/g, "this.getItemCount('\$1')");
        value = value.replace(/flag:([\w\d_]+)/g, "this.getFlag('\$1')");
        return eval(value);
    }

    getPlayerProperty(name: string): any {
        return playerMgr.getPlayerProperty(name);
    }

    getItemCount(itemId: string): number {
        return playerMgr.getItemCount(itemId);
    }

    getFlag(name: string): any {
        return core.getFlag(name);
    }

    @log
    @callertrace
    resolveText(text: string): string {
        console.log('resolve text:', text);
        text = text.replace(/{player\}/g, playerMgr.getPlayerName());
        return text.replace(/\${([^}]+)}/g, (word, value) => {
            return this.evalValue(value);
        });
    }

    handleGetItem(itemId: string, itemNum: number, x: number, y: number, callback?: Function) {
        audioMgr.play('item.ogg');
        if (!itemMgr.existItem(itemId)) {
            if (isset(callback)) {
                callback!();
            }
            return;
        }
        const item = itemMgr.getItemByID(itemId);

        itemMgr.useItemEffectDirectly(itemId, itemNum);

        removeBlock(x, y);

        let text: string = i18next.t('get_item') + itemMgr.getItemByID(itemId).name;
        if (itemNum > 1) {
            text += " x " + itemNum;
        }
        if (item.type === 'trigger') {
            text += itemMgr.getItemDirectEffectTip(itemId);
        }

        canvas.drawTip(text, itemId);

        event.clearRect(x * BLOCK_WIDTH, y * BLOCK_WIDTH, BLOCK_WIDTH, BLOCK_WIDTH);
        statusBar.syncPlayerStatus();

        // Post event of item
        const point: string = x + "," + y;
        const postEvents = getFloorById()?.postGetItemEvent;
        if (isset(postEvents) && point in postEvents!) {
            const event = postEvents![point];
            this.handle(event, x, y, callback);
        } else if (isset(callback)) {
            callback!();
        }
    }

    handleGameover(reason: string, win: boolean = false) {
        canvasAnimate.closeUIPanel();
        stopPlayer(() => {
            canvas.drawText([
                win ?
                    `\t${i18next.t('gameover_ending2')}\n${i18next.t(reason)}` :
                    `\t${i18next.t('gameover_ending1')}\n${i18next.t(reason)}`
            ], () => {
                menu.show();
            });
        })
    }

    handleSaveGame(needCheckStatus: boolean = false) {
        if (!playerMgr.checkStatusSatisfiedAndSetEventId('save', needCheckStatus))
            return;

        let saveIndex = core.getFlag('saveIndex', 1);
        console.log('save index:', saveIndex)
        let page = toInt((saveIndex - 1) / 5), offset = saveIndex - 5 * page;

        drawSLPanel(10 * page + offset);
    }

    handleLoadGame(needCheckStatus: boolean = false) {
        let saveIndex = getLocalStorage('saveIndex2', 1);
        let page = toInt((saveIndex - 1) / 5);
        let offset = saveIndex - 5 * page;

        console.log('load game: ', saveIndex, page, offset);

        // 游戏开始前读档
        if (!core.isStarted) {
            console.log('load game before start');
            core.setEventId('load');

            core.lock();
            hideDomNode('menuBox');
            drawSLPanel(10 * page + offset);
            return;
        }

        if (!playerMgr.checkStatusSatisfiedAndSetEventId('load', needCheckStatus))
            return;

        drawSLPanel(10 * page + offset);
    }

    handleWin(reason?: string, callback?: Function) {
        canvasAnimate.closeUIPanel();
        const IsTrueEnd = playerMgr.getPlayerLevel() >= 120;
        const onStop = () => {
            canvasAnimate.resetMapsAnimate();
            canvas.clearAllCanvas();
            let contents = ["你赢了！"];
            if (IsTrueEnd) {
                contents.push("真结局");
            }
            if (reason) {
                contents.push(reason);
            }
            canvas.drawText();
        };
        stopPlayer(onStop);

    }

    handleOpenShop(shopId: string, needVisited = false) {
        const shop = shopMgr.getShopById(shopId);
        console.log('openShopHand\ler: ', shopId, shop);
        if (needVisited && !shopMgr.shopVisitedBefore(shopId)) {
            if (shop.times == 0) {
                canvas.drawTip(i18next.t('shop_not_opened'));
            } else {
                canvas.drawTip(i18next.t('shop_not_available'));
            }
            return;
        }
        shopMgr.setShopVisited(shopId);

        let selection = core.getEventDataSelection();
        let actions: any[] = [];
        if (core.hasEventData('actions'))
            actions = core.getEventData('actions');

        let fromList = undefined;
        if (core.hasEventData('fromList'))
            fromList = core.getEventData('fromList');

        canvasAnimate.closeUIPanel();

        core.lock();

        core.setEventId('shop');
        core.updateEventData('id', shopId);
        core.updateEventData('shop', shop);
        core.updateEventData('actions', actions);
        core.updateEventData('fromList', fromList);
        core.setEventDataSelection(selection);

        let content: string = `\t[${shop.name},${shop.icon}]`;
        let times: number = shop.times;
        let need: number = eval(shop.need);

        console.log('need: ', need, ' times: ', times);

        content = content + shop.text.replace(/\${([^}]+)}/g, function (word: any, value: string) {
            return eval(value);
        });

        const use: string = shop.use == 'experience' ? i18next.t('exp') : i18next.t('money');

        let choices = [];
        for (let i = 0; i < shop.choices.length; i++) {
            let choice = shop.choices[i];
            let text = choice.text;
            if (isset(choice.need)) {
                text += "（" + eval(choice.need!) + use + "）"
            }
            choices.push(text);
        }
        choices.push(i18next.t('leave'));
        canvas.drawChoices(content, choices);
    }

    @log
    @callertrace
    handleOpenDoor(id: string, x: number, y: number, needKey: boolean = true, callback?: Function) {
        console.log('handleOpenDoor: ', id, x, y, needKey, callback);
        if (isset(this.openDoorInterval)) {
            console.log('handleOpenDoor: interval exist');
            return;
        }

        if (!existTerrain(x, y, id)) {
            console.log('handleOpenDoor: not exist terrain');
            if (isset(callback)) {
                callback!();
            }
            return;
        }

        if (autoRoute.getRemainingRoutesLength() == 0) {
            autoRoute.setRemainingRoutes(autoRoute.getRoutes().slice(autoRoute.getDirectionDestSteps() - 1, autoRoute.getRoutesLength()));

            if (autoRoute.getRemainingRoutesLength() > 0) {
                autoRoute.getRemainingRoutes()[0].steps -= autoRoute.getDirectionMovedSteps();
            }
        }

        autoRoute.stop();

        let speed = 30;
        if (needKey) {
            let key = id.replace("Door", "Key");
            console.log('need key:', key);
            console.log('has key:', playerMgr.hasItem(key));
            if (!playerMgr.hasItem(key)) {
                if (key != "specialKey") {
                    canvas.drawTip(i18next.t('have_no') + itemMgr.getItemByID(key).name);
                }
                else {
                    canvas.drawTip(i18next.t('open_door_failed'));
                }
                autoRoute.clearRemainingRoutes();
                return;
            }
            this.handleAutosave(true);
            itemMgr.removeItem(key);
        }

        // open
        audioMgr.play("door.ogg");
        let state = 0;
        let doorId = id;
        if (!(doorId.substring(doorId.length - 4) == "Door")) {
            doorId = doorId + "Door";
            speed = 100;
        }
        this.openDoorInterval = setInterval(() => {
            state++;
            if (state == 4) {
                clearInterval(this.openDoorInterval!);
                this.openDoorInterval = null;
                removeBlock(x, y);
                this.handlePostOpenDoor(id, x, y, callback);
                return;
            }
            event.clearRect(BLOCK_WIDTH * x, BLOCK_WIDTH * y, BLOCK_WIDTH, BLOCK_WIDTH);
            event.drawImage(imageMgr.getAnimateImages(doorId)[state], 0, 0, BLOCK_WIDTH, BLOCK_WIDTH, BLOCK_WIDTH * x, BLOCK_WIDTH * y, BLOCK_WIDTH, BLOCK_WIDTH);
        }, speed)

    }

    handleRestart() {
        canvasAnimate.closeUIPanel();
        menu.show();
    }

    handleTriggerPointEvent(x: number, y: number) {
        console.log('trigger pointer event cur floorid: ', playerMgr.getFloorId());
        const mapBlocks = getMapData().blocks;
        console.log('trigger pointer event, cur mapblocks:', mapBlocks)
        let noPass;
        for (let i = 0; i < mapBlocks.length; i++) {
            const block = mapBlocks[i];
            if (block.x == x && block.y == y && !(isset(block.enable) && !(block.enable!))) {
                // 启用事件
                noPass = block.event && block.event.noPass;
                if (noPass) {
                    autoRoute.clearUINode(x, y);
                }
                console.log('trigger event at', x, ',', y, 'event:', block.event);

                if (isset(block.event) && isset(block.event!.trigger)) {

                    const trigger: string = block.event!.trigger!;

                    console.log('event trigger:', trigger);

                    autoRoute.setCanMove(false);
                    const eventHandler = this.triggerEvents[trigger]!;
                    eventHandler(block);
                }
            }
        }
    }


    handleUseToolBarTransporter(needCheckStatus: boolean = false) {
        if (!playerMgr.checkStatusSatisfiedAndSetEventId('transporter', needCheckStatus, true)) {
            return;
        }

        if (config.transportNearStair && !playerMgr.isNearStair()) {
            canvas.drawTip(i18next.t('use_transporter_neer_floor'));
            core.unlock();
            core.resetEvent();
            return;
        }
        if (!itemMgr.canUseItem('transporter')) {
            canvas.drawTip(i18next.t('failed_to_use_transporter'));
            core.unlock();
            core.resetEvent();
            return;
        }
        itemMgr.useItem('transporter');
    }

    handleAutosave(removeLastRouteInSaveData: boolean) {
        console.log('autosave: ', removeLastRouteInSaveData)
        let x = undefined;
        if (removeLastRouteInSaveData) {
            x = route.pop();
        }

        this.handleSaveData('autosave');
        if (removeLastRouteInSaveData && isset(x)) {
            route.push(x!);
        }
    }


    handleSaveData(dataId: string) {
        let data: SLData = {
            'floorId': playerMgr.getFloorId(),
            'playerData': clone(playerMgr.getPlayerData()),
            'level': core.getGameLevel(),
            'maps': saveMaps(),
            'flags': core.getFlags(),
            'route': this.encodeRoute(route.intern()),
            'shops': {},
            'notes': notebook.getNotes(),
            'version': staticConfig.gameVersion,
            "time": new Date().getTime()
        };
        // set shop times
        let shopIds = Object.keys(shopMgr.getShopVisited());
        for (let i = 0; i < shopIds.length; i++) {
            let shopId = shopIds[i];
            data.shops[shopId] = clone(shopMgr.getShopById(shopId));
        }

        console.log('saveData: ', data);
        return setLocalStorage(dataId, data);
    }


    decodeRoute(route?: string): string[] {

        if (!isset(route))
            return [];

        let ans = [];
        let index = 0;

        let getNumber = (noparse: any = undefined): string | number => {
            let num = "";
            while (index < route!.length && !isNaN(parseInt(route!.charAt(index)))) {
                num += route!.charAt(index++);
            }
            if (num.length == 0)
                num = "1";
            return isset(noparse) ? num : parseInt(num);
        }

        while (index < route!.length) {
            let c = route!.charAt(index++);
            let number = getNumber() as number;

            switch (c) {
                case "U": for (let i = 0; i < number; i++) ans.push("up"); break;
                case "D": for (let i = 0; i < number; i++) ans.push("down"); break;
                case "L": for (let i = 0; i < number; i++) ans.push("left"); break;
                case "R": for (let i = 0; i < number; i++) ans.push("right"); break;
                case "I": ans.push("item:" + itemMgr.getItemBySortedIndex(number)!); break;
                case "F": ans.push("fly:" + getFloorById(number)); break;
                case "C": ans.push("choices:" + number); break;
                case "S": ++index; ans.push("shop:" + shopMgr.getShopBySortedIndex(number)! + ":" + getNumber(true)); break;
                case "T": ans.push("turn"); break;
                case "G": ans.push("getNext"); break;
                case "P": ans.push("input:" + number); break;
                case "N": ans.push("no"); break;
                case "M": ++index; ans.push("move:" + number + ":" + getNumber()); break;
            }
        }
        return ans;
    }

    encodeRoute(route: string[]): string {
        let ans = "";
        let lastMove = "";
        let cnt = 0;

        route.forEach((t) => {
            if (t == 'up' || t == 'down' || t == 'left' || t == 'right') {
                if (t != lastMove && cnt > 0) {
                    ans += lastMove.substring(0, 1).toUpperCase();
                    if (cnt > 1) ans += cnt;
                    cnt = 0;
                }
                lastMove = t;
                cnt++;
            }
            else {
                if (cnt > 0) {
                    ans += lastMove.substring(0, 1).toUpperCase();
                    if (cnt > 1) ans += cnt;
                    cnt = 0;
                }
                if (t.indexOf('item:') == 0)
                    ans += "I" + itemMgr.getItemSortedIndex(t.substring(5));
                else if (t.indexOf('fly:') == 0)
                    ans += "F" + t.substring(4);
                else if (t.indexOf('choices:') == 0)
                    ans += "C" + t.substring(8);
                else if (t.indexOf('shop:') == 0) {
                    let sp = t.substring(5).split(":");
                    ans += "S" + shopMgr.getShopSortedIndex(sp[0]) + ":" + sp[1];
                }
                else if (t == 'turn')
                    ans += 'T';
                else if (t == 'getNext')
                    ans += 'G';
                else if (t.indexOf('input:') == 0)
                    ans += "P" + t.substring(6);
                else if (t == 'no')
                    ans += 'N';
                else if (t.indexOf('move:') == 0) {
                    ans += "M" + t.substring(5);
                }
            }
        });
        if (cnt > 0) {
            ans += lastMove.substring(0, 1).toUpperCase();
            if (cnt > 1) ans += cnt;
        }
        return ans;
    }

    handlePostOpenDoor(id: string, x?: number, y?: number, callback?: Function) {
        let todo: any[] = [];
        if (isset(x) && isset(y)) {
            let events = getFloorById()?.postOpenDoorEvent;
            let point = x + ',' + y;
            if (isset(events) && point in events!) {
                const event = events![point];
                unshift(todo, event);
            }
        }

        if (todo.length > 0) {
            this.doOrInsertAction(todo, x, y);
        }
        if (!core.isEventSet()) {
            autoRoute.completeRemaining();
        }
        else {
            autoRoute.clearRemainingRoutes();
        }
        if (isset(callback)) {
            callback!();
        }
    }


    doSL(id: string | number, type: string) {
        if (type == 'save') {
            if (id == 'autoSave') {
                canvas.drawTip('不能覆盖自动存档！');
                return;
            }
            if (this.handleSaveData("save" + id)) {
                canvasAnimate.closeUIPanel();
                canvas.drawTip('存档成功！');
                if (id != "autoSave") {
                    core.setFlag('saveIndex', id);
                    setLocalStorage('saveIndex2', core.getFlag('saveIndex'));
                }
            }
            else {
                canvas.drawTip('存储空间不够，可覆盖已有的存档或在菜单栏中进行清理');
            }
            return;
        }
        else if (type == 'load') {
            let data = getLocalStorage(id == 'autoSave' ? id : "save" + id);
            if (!isset(data)) {
                canvas.drawTip("无效的存档");
                return;
            }
            if (data.version != staticConfig.gameVersion) {
                canvas.drawTip("存档版本不匹配");
                return;
            }
            canvasAnimate.closeUIPanel();
            this.handleLoadData(data, () => {
                canvas.drawTip("读档成功");
                if (id != "autoSave") {
                    core.setFlag('saveIndex', id);
                    setLocalStorage('saveIndex2', core.getFlag('saveIndex'));
                }
            });
            return;
        }
    }

    handleLoadData(data: SLData, callback?: Function) {
        console.log('loadData: ', data, callback);

        loadMaps(data.maps);
        this.handleResetData(data.playerData, data.level, data.floorId, data.flags, this.decodeRoute(data.route), data.notes);

        // load shop times
        let shopIds = Object.keys(data.shops);
        for (let i = 0; i < shopIds.length; i++) {
            let shopId = shopIds[i];
            const shop = data.shops[shopId];
            if (shop.times > 0) {
                shopMgr.setShopVisited(shopId);
                console.log('load shop visited: ', shopId);
            }
            shopMgr.setShopById(shopId, clone(shop));
        }

        switchFloor(data.floorId, undefined, data.playerData.loc, 100, () => {
            console.log('switch floor after load data!');
            if (isset(callback)) {
                callback!();
            }
        });
    }

    @log
    @callertrace
    handleResetData(playerData: PlayerData, level: GameLevel, floorId: number, flags?: Record<string, any>, route_?: string[], notes?: Record<string, string[]>) {
        canvas.clearAllInterval();
        console.log('before set playerdata:', playerMgr.getPlayerData());
        playerMgr.setPlayerData(clone(playerData));
        console.log('after set playerdata:', playerMgr.getPlayerData());
        imageMgr.setPlayerImage();
        core.setStarted(true);

        playerMgr.setFloorId(floorId);

        core.setGameLevel(level);

        if (isset(flags)) {
            core.setFlags(clone(flags!));
        }
        if (isset(route_)) {
            route.set(clone(route_!));
        }
        if (isset(notes)) {
            notebook.setNotes(clone(notes!));
        }

        core.setFlag('saveIndex', getLocalStorage('saveIndex2', 1));

        gameWindow.resize();
    }

    handleOpenToolbox(need: boolean = false) {
        if (!playerMgr.checkStatusSatisfiedAndSetEventId('toolbox', need)) {
            return;
        }
        drawToolbox();
    }

    handleTurnPlayer() {
        let playeLoc = playerMgr.getPlayerLoc();
        if (playeLoc.direction == 'up')
            playeLoc.direction = 'right';
        else if (playeLoc.direction == 'right')
            playeLoc.direction = 'down';
        else if (playeLoc.direction == 'down')
            playeLoc.direction = 'left';
        else if (playeLoc.direction == 'left')
            playeLoc.direction = 'up';
        drawPlayer(playeLoc.direction, playeLoc.x, playeLoc.y);
        ui.clearRect();
        route.push('turn');
    }

    handleOpenQuickShop(needCheckStatus: boolean = false) {
        if (!playerMgr.checkStatusSatisfiedAndSetEventId('selectShop', needCheckStatus)) {
            return;
        }

        drawQuickShop();
    }

    checkAndHandleBlockEvent() {
        const playerLoc = playerMgr.getPlayerLoc();
        let x = playerLoc.x;
        let y = playerLoc.y;
        const damage = blockingCtx.damage[CANVAS_BLOCK_WIDTH_CNT * x + y];
        if (damage > 0) {
            playerMgr.setPlayerHP(playerMgr.getPlayerHP() - damage);

            // 检查阻击事件
            let snipe: PlayerLocation[] = [];

            for (const direction in DIRECTION_TO_POINT_MAP) {
                const nx = x + DIRECTION_TO_POINT_MAP[direction].x, ny = y + DIRECTION_TO_POINT_MAP[direction].y;
                if (nx < 0 || nx >= CANVAS_BLOCK_WIDTH_CNT || ny < 0 || ny >= CANVAS_BLOCK_WIDTH_CNT) {
                    continue;
                }

                const id = blockingCtx.map[CANVAS_BLOCK_WIDTH_CNT * nx + ny];
                if (isset(id)) {
                    const enemy = enemiesMgr.getEnemyByID(id);
                    if (isset(enemy) && enemiesMgr.isSpecialEnemy(enemy.special, 18)) {
                        snipe.push({ 'direction': direction, 'x': nx, 'y': ny });
                    }
                }
            }

            if (blockingCtx.hasBlock[CANVAS_BLOCK_WIDTH_CNT * x + y] && damage > 0) {
                canvas.drawTip(i18next.t('blocking_attack_half_hp'));
            }

            // 阻击
            else if (snipe.length > 0 && damage > 0) {
                canvas.drawTip(`${i18next.t('blocking_attack')}: ${damage}`);
            }
            else if (damage > 0) {
                canvas.drawTip(`${i18next.t('zone_attack')}: ${damage}`);
            }

            audioMgr.play('zone.ogg');
            canvasAnimate.draw("zone", x, y);

            if (playerMgr.getPlayerHP() <= 0) {
                playerMgr.setPlayerHP(0);
                statusBar.syncPlayerStatus();
                this.handleGameover('zone');
                return;
            }
            snipe = snipe.filter(function (t) {
                const x = t.x, y = t.y, direction = t.direction;
                const nx = x + DIRECTION_TO_POINT_MAP[direction].x, ny = y + DIRECTION_TO_POINT_MAP[direction].y;

                return nx >= 0 && nx <= 12 && ny >= 0 && ny <= 12 && !isset(getBlockAtPointOnFloor(nx, ny, playerMgr.getFloorId(), false));
            });
            statusBar.syncPlayerStatus();
            if (snipe.length > 0) {
                this.handleSnipe(snipe);
            }
        }
    }

    handleSnipe(snipes: { direction: string, x: number, y: number, nx?: number, ny?: number, blockIcon?: number, blockImages?: HTMLImageElement[], damage?: string, color?: string, block?: Block }[]) {

        snipes.forEach(function (snipe: { direction: string, x: number, y: number, nx?: number, ny?: number, blockIcon?: number, blockImage?: HTMLImageElement, damage?: string, color?: string, block?: Block }) {
            let x = snipe.x, y = snipe.y, direction = snipe.direction;
            snipe.nx = x + DIRECTION_TO_POINT_MAP[snipe.direction].x;
            snipe.ny = y + DIRECTION_TO_POINT_MAP[snipe.direction].y;

            canvasAnimate.removeMapAnimateBlock(x, y);

            const block: Block = getBlockAtPointOnFloor(x, y)!.block;
            snipe.blockIcon = 0;
            snipe.blockImage = imageMgr.get(block.event!.type, block.event!.id);
            let damageNum: number = enemiesMgr.getDamage(block.event!.id);

            const player_hp = playerMgr.getPlayerHP();
            let color: string = BLACK;
            if (damageNum <= 0) {
                color = GREEN;
            }
            else if (damageNum < player_hp / 3) {
                color = WHITE;
            }
            else if (damageNum < player_hp * 2 / 3) {
                color = YELLOW;
            }
            else if (damageNum < player_hp) {
                color = PINK;
            }
            else {
                color = RED;
            }
            let damageStr: string = damageNum.toString();
            if (damageNum >= MAX) {
                damageStr = "???";
            }
            else if (damageNum > 100000) {
                damageStr = (damageNum / 10000).toFixed(1) + "w";
            }

            snipe.damage = damageStr;
            snipe.color = color;
            snipe.block = clone(block);
        })

        const finishSnipe = () => {
            snipes.forEach((t) => {
                removeBlock(t.x, t.y);
                let nBlock: Block = clone(t.block!);
                nBlock.x = t.nx!; nBlock.y = t.ny!;
                getMapData().blocks.push(nBlock);
                canvasAnimate.pushMapsAnimateObj(2, BLOCK_WIDTH * t.nx!, BLOCK_WIDTH * t.ny!, t.blockImages!, t.blockIcon);
                event.drawImage(t.blockImages![0], 0, t.blockIcon! * BLOCK_WIDTH, BLOCK_WIDTH, BLOCK_WIDTH, BLOCK_WIDTH * t.nx!, BLOCK_WIDTH * t.ny!, BLOCK_WIDTH, BLOCK_WIDTH);
            });
            canvasAnimate.syncMapsAnimate();
            statusBar.syncPlayerStatus();
            return;
        }

        const onPlayerStop = () => {
            core.lock();

            let time = 500, step = 0;

            let animateValue = 2;
            let animateCurrent = 0;
            let animateTime = 0;

            damage.setTextAlign('left');

            let animate = setInterval(() => {
                step++;
                animateTime += time / FPS;
                if (animateTime >= config.pngAnimateSpeed * 2 / animateValue) {
                    animateCurrent++;
                    animateTime = 0;
                    if (animateCurrent >= animateValue) animateCurrent = 0;
                }

                snipes.forEach(function (snipe) {
                    let x = snipe.x, y = snipe.y, direction = snipe.direction;

                    let nowX = BLOCK_WIDTH * x + DIRECTION_TO_POINT_MAP[direction].x * 2 * step, nowY = BLOCK_WIDTH * y + DIRECTION_TO_POINT_MAP[direction].y * 2 * step;

                    // 清空上一次
                    event.clearRect(nowX - 2 * DIRECTION_TO_POINT_MAP[direction].x, nowY - 2 * DIRECTION_TO_POINT_MAP[direction].y, BLOCK_WIDTH, BLOCK_WIDTH);
                    damage.clearRect(nowX - 2 * DIRECTION_TO_POINT_MAP[direction].x, nowY - 2 * DIRECTION_TO_POINT_MAP[direction].y, BLOCK_WIDTH, BLOCK_WIDTH);

                    event.drawImage(snipe.blockImages![0], animateCurrent * BLOCK_WIDTH, snipe.blockIcon! * BLOCK_WIDTH, BLOCK_WIDTH, BLOCK_WIDTH, nowX, nowY, BLOCK_WIDTH, BLOCK_WIDTH);

                    if (playerMgr.hasItem('encyclopedia')) {
                        damage.setFillStyle(WHITE);
                        damage.fillText(snipe.damage!, nowX + 2, nowY + BLOCK_WIDTH - 2);
                        damage.fillText(snipe.damage!, nowX, nowY + BLOCK_WIDTH - 2);
                        damage.fillText(snipe.damage!, nowX + 2, nowY + BLOCK_WIDTH);
                        damage.fillText(snipe.damage!, nowX, nowY + BLOCK_WIDTH);

                        damage.setFillStyle(snipe.color!);
                        damage.fillText(snipe.damage!, nowX + 1, nowY + BLOCK_WIDTH - 1);
                    }

                })

                if (step == 16) {
                    clearInterval(animate);
                    finishSnipe();
                    if (!core.isEventSet()) {
                        core.unlock();
                    }
                }
            }, time / FPS);
        };

        stopPlayer(onPlayerStop);
    }

    handleBattle(enemyId: string, x: number, y: number, force: boolean = false, callback?: Function) {
        if (autoRoute.getRemainingRoutesLength() == 0) {
            autoRoute.setRemainingRoutes(autoRoute.getRemainingRoutes().slice(autoRoute.getIdx() - 1, autoRoute.getRoutesLength()));

            if (autoRoute.getRemainingRoutesLength() > 0) {
                let remainingRoutes = autoRoute.getRemainingRoutes();
                remainingRoutes[0].steps -= autoRoute.getDirectionMovedSteps();
            }
        }

        stopPlayer();
        autoRoute.stop();

        const damage: number = enemiesMgr.getDamage(enemyId);
        if (damage >= playerMgr.getPlayerHP() && !force) {
            canvas.drawTip(i18next.t('try_beat_failed'));
            autoRoute.clearRemainingRoutes();
            return;
        }

        if (!core.isEventSet()) {
            this.handleAutosave(true);
        }

        if (config.showBattleAnimate) {
            stopPlayer(() => {
                drawBattleAnimate(enemyId, () => {
                    this.handlePostBattle(enemyId, x, y, callback);
                });
            });
            return;
        }

        if (config.equipmentDirectly && core.hasFlag('sword')) {
            audioMgr.play('zone.ogg');
            canvasAnimate.draw('sword', x, y);
        } else {
            audioMgr.play('attack.ogg');
            canvasAnimate.draw('hand', x, y);
        }
        this.handlePostBattle(enemyId, x, y, callback);
    }

    handlePostBattle(enemyId: string, x?: number, y?: number, callback?: Function) {
        playerMgr.setPlayerHP(playerMgr.getPlayerHP() - enemiesMgr.getDamage(enemyId));
        if (playerMgr.getPlayerHP() <= 0) {
            playerMgr.setPlayerHP(0);
            this.handleGameover('battle');
            return;
        }

        const enemy = enemiesMgr.getEnemyByID(enemyId);
        let money: number = enemy.money;

        if (playerMgr.hasItem('coin')) {
            money *= 2;
        }

        if (core.getFlag('curse', false)) {
            money = 0;
        }

        playerMgr.addPlayerMoney(money);

        let experience: number = enemy.experience;
        if (core.getFlag('curse', false)) {
            experience = 0;
        }

        playerMgr.addPlayerExp(experience);

        if (isset(x) && isset(y)) {
            removeBlock(x!, y!);
            event.clearRect(x! * BLOCK_WIDTH, y! * BLOCK_WIDTH, BLOCK_WIDTH, BLOCK_WIDTH);
        }

        let hint = i18next.t('battle_success') + enemy.name;
        hint += ", " + i18next.t('money') + " + " + money;
        hint += ", " + i18next.t('exp') + " + " + experience;
        canvas.drawTip(hint);

        // post event of beat enemy
        let special = enemy.special;
        // 中毒 | poison
        if (enemiesMgr.isSpecialEnemy(special, 12) && !core.getFlag('poison', false)) {
            core.setFlag('poison', true);
        }
        // 衰弱 | weak
        if (enemiesMgr.isSpecialEnemy(special, 13) && !core.getFlag('weak', false)) {
            core.setFlag('weak', true);
            playerMgr.setPlayerAttack(playerMgr.getPlayerAttack() - config.weakValue);
            playerMgr.setPlayerDefense(playerMgr.getPlayerDefense() - config.weakValue);
        }
        // 诅咒 | curse
        if (enemiesMgr.isSpecialEnemy(special, 14) && !core.getFlag('curse', false)) {
            core.setFlag('curse', true);
        }
        // 自爆 | self-destruction
        if (enemiesMgr.isSpecialEnemy(special, 19)) {
            playerMgr.setPlayerHP(6);
        }
        // 退化 | degenerate
        if (enemiesMgr.isSpecialEnemy(special, 21) && core.getFlag('degenerate', false)) {
            playerMgr.setPlayerAttack(playerMgr.getPlayerAttack() - (enemy.attack));
            playerMgr.setPlayerDefense(playerMgr.getPlayerDefense() - (enemy.defense));
            if (playerMgr.getPlayerAttack() < 0) {
                playerMgr.setPlayerAttack(0);
            }
            if (playerMgr.getPlayerAttack() < 0) {
                playerMgr.setPlayerDefense(0);
            }
        }

        statusBar.syncPlayerStatus();

        let todo: any[] = [];
        // 非阻击时间，且该点存在事件
        if (!enemiesMgr.isSpecialEnemy(special, 18) && isset(x) && isset(y)) {
            const postEvents = getFloorById()!.postBattleEvent;
            const point: string = x + "," + y;
            if (isset(postEvents) && point in postEvents!) {
                unshift(todo, postEvents![point]);
            }
        }

        if (todo.length > 0) {
            this.doOrInsertAction(todo, x, y);
        }

        if (!core.isEventSet()) {
            autoRoute.completeRemaining();
        }

        if (isset(callback)) {
            callback!();
        }
    }

    handlePostUseBomb() {
        console.log('handlePostUseBomb unimplemented!');
    }

    hanleStartGameEvent(level: string) {
        const gameLevel = parseGameLevel(level);
        if (gameLevel !== null) {
            core.setGameLevel(gameLevel);
        } else {
            console.error(`Invalid level: ${gameLevel}`);
            return;
        }

        console.log(`start game level: ${level}`);

        menu.hideMenu();
        const nameInput = getDomNode('nameInput') as HTMLInputElement;
        const submitButton = getDomNode('submitName') as HTMLButtonElement;

        showDomNode('nameInput');
        showDomNode('submitName');
        nameInput.placeholder = i18next.t('input_name_tip');

        nameInput.style.transform = `translate()`;
        let playerName = "";
        const onNameSubmit = () => {
            playerName = nameInput.value.trim();
            if (playerName.length > 0) {
                // 隐藏输入框
                hideDomNode('nameInput');
                hideDomNode('submitName');

                playerMgr.setPlayerName(playerName);
                console.log('player name: ', playerMgr.getPlayerName());
            } else {
                alert('Please input your name!');
                return;
            }
            console.log('start text: ', staticConfig.startText);
            const onDrawTextComplete = () => {
                const postShowBattleConfirm = () => {
                    switchFloor(staticConfig.initFloorId, undefined, playerMgr.getPlayerLoc());
                }
                showBattleAnimateConfirm(postShowBattleConfirm);
            };

            const afterChooseSexText = () => {
                showSexChoose(() => {
                    playerMgr.resetPlayerData();
                    playerMgr.setupPlayerDataByGameLevel(gameLevel)
                    playerMgr.setPlayerName(playerName);
                    playerMgr.setPlayerIsMan(getLocalStorage('isMan', true));
                    eventMgr.handleResetData(playerMgr.getPlayerData(), gameLevel, staticConfig.initFloorId);
                    canvas.drawText(staticConfig.startText, onDrawTextComplete);
                });
            };
            console.log('call drawtext', i18next.t('choose_sex'), afterChooseSexText);
            canvas.drawText(i18next.t('choose_sex'), afterChooseSexText);
        };
        submitButton.addEventListener('click', onNameSubmit);
        submitButton.addEventListener('touchend', onNameSubmit);
        nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                onNameSubmit();
            }
        });
    }

    handleClickStartGameButtonEvent() {
        hideDomNode('menuButtons');
        showDomNode('levelButtons');
    }
}

let eventMgr: EventsManager = EventsManager.getInstance();

export function initEventsManager() {
    eventMgr = EventsManager.getInstance();
}

export default eventMgr;
