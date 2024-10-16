import { getDomNode } from "../common/client";
import gameWindow, { ScreenMode } from "./gameWindow";
import { core } from "../common/global";
import { canvas, data, ui } from "./canvas/canvas";
import { autoRoute } from "player/autoroute";
import { BLOCK_WIDTH, CANVAS_BLOCK_WIDTH_CNT, DEFAULT_TIMEOUT_MILLS, GRAY, POINT_TO_DIRECTION_MAP } from "../common/constants";
import { callertrace, isset, log, setLocalStorage, toInt } from "../common/util";
import { PlayerLocation, playerMgr } from "player/data";
import { eventManager } from "events/events";
import { canvasAnimate } from "./canvas/animates";
import { drawAbout, drawBookDetail, drawCursor, drawEncyclopedia, drawHelp, drawOpenEncyclopedia, drawQuickShop, drawSettings, drawSLPanel, drawSwitchs, drawToolbox, drawTransport } from "./canvas/functionality";
import { movePlayer } from "./canvas/player";
import { route } from "player/route";
import { itemMgr } from "items/data";
import i18next from "i18next";
import statusBar from "./statusBar";
import { StairDirection, switchFloor } from "floor/switch";
import { config } from "../common/config";
import { updateDamageDisplay } from "./canvas/damage";
import menu from "./menu";
import { shopMgr } from "shops/shops";
import { getFloorById } from "floor/data";

interface ClickLoc {
    x: number;
    y: number;
    size: number;
}

class InteractManager {

    private downTime: Date | null = null;
    private holdingKeys: number[] = [];

    getClickLoc(x: number, y: number): ClickLoc {
        let statusBar = { x: 0, y: 0 };
        let size = BLOCK_WIDTH;

        size = size * gameWindow.getScale();

        switch (gameWindow.getScreenMode()) {
            case ScreenMode.MOBILE_VERTICAL:
                statusBar.x = 0;
                statusBar.y = getDomNode('statusBar').offsetHeight + 3;
                break;
            case ScreenMode.MOBILE_HORIZONTAL:
            case ScreenMode.PC:
                statusBar.x = getDomNode('statusBar').offsetWidth + 3;
                statusBar.y = 0;
                break;
        }

        let left = getDomNode('screenBox').offsetLeft + statusBar.x;
        let top = getDomNode('screenBox').offsetTop + statusBar.y;
        return {
            'x': x - left
            , 'y': y - top, 'size': size
        };
    }

    onDown(x: number, y: number) {
        console.log('on down', x, y);
        if (!core.isStarted() || core.isLocked()) {
            console.log('game not started or locked, use onclick instead');
            this.onClick(x, y);
            return;
        }

        this.downTime = new Date();
        ui.save();
        ui.clearRect();

        autoRoute.resetRoutePostEvent();
        autoRoute.pushRoutePostEvent(x, y);
        ui.fillPoint(x, y, GRAY);
    }

    @log
    @callertrace
    onUp() {
        if (autoRoute.getRoutePostEventLength() > 0) {
            let postRoute: { direction: string, x: number, y: number }[] = [];

            for (let i = 1; i < autoRoute.getRoutePostEventLength(); i++) {
                const pos0 = autoRoute.getRoutePostEvent()[i - 1];
                const pos = autoRoute.getRoutePostEvent()[i];
                console.log('on up tmp stepPostfix push', { direction: POINT_TO_DIRECTION_MAP[pos.x - pos0.x][pos.y - pos0.y], x: pos.x, y: pos.y });
                postRoute.push({ direction: POINT_TO_DIRECTION_MAP[pos.x - pos0.x][pos.y - pos0.y], x: pos.x, y: pos.y });
            }
            const posx = autoRoute.getRoutePostEvent()[0].x;
            const posy = autoRoute.getRoutePostEvent()[0].y;
            autoRoute.resetRoutePostEvent();
            if (!core.isLocked()) {
                ui.clearRect();
                ui.restore()
            }

            console.log('on up call onclick', posx, posy, postRoute);
            this.onClick(posx, posy, postRoute);

            this.downTime = null;
        }
    }

    mouseDownHandler(event: MouseEvent) {
        try {
            event.stopPropagation();
            const loc = this.getClickLoc(event.clientX, event.clientY);
            const x = toInt(loc.x / loc.size);
            const y = toInt(loc.y / loc.size);

            this.onDown(x, y);
        } catch (err) {
            console.error(err);
        }
    }

    mouseUpHandler(event: MouseEvent) {
        try {
            this.onUp();
        } catch (err) {
            console.error(err);
        }
    }

    touchStartHandler(event: TouchEvent) {
        try {
            event.preventDefault();
            let loc = this.getClickLoc(event.targetTouches[0].clientX, event.targetTouches[0].clientY);
            if (!isset(loc))
                return;
            let x = toInt(loc.x / loc.size);
            let y = toInt(loc.y / loc.size);
            this.onDown(x, y);
        } catch (err) {
            console.error(err);
        }
    }


    touchEndHandler(event: TouchEvent) {
        try {
            this.onUp();
        } catch (err) {
            console.error(err);
        }
    }

    // 按下Ctrl键时快捷跳过对话 | Press Ctrl to skip dialog
    keyDownCtrl() {
        switch (core.getEventId()) {
            case 'text':
                canvas.drawText();
                break;
            case 'action':
                if (core.getEventData('type') == 'text') {
                    eventManager.handleAction();
                }
                break;
            default:
                break;
        }
    }

    keyDownAction(keycode: number) {
        const data = core.getEventDataCurrent();
        if (data.type == 'choices') {
            const choices = data.choices;
            if (choices.length > 0) {
                if (keycode == 38) {
                    core.decEventDataSelection();
                    const ui = core.getEventDataUI();
                    canvas.drawChoices(ui.text, ui.choices);
                }
                if (keycode == 40) {
                    core.incEventDataSelection();
                    const ui = core.getEventDataUI();
                    canvas.drawChoices(ui.text, ui.choices);
                }
            }
        }
    }

    keyDownShop(keycode: number) {
        if (keycode == 38) {
            // 上
            core.decEventDataSelection();
            const ui = core.getEventDataUI();
            canvas.drawChoices(ui.text, ui.choices);
        }
        if (keycode == 40) {
            // 下
            core.incEventDataSelection();
            const ui = core.getEventDataUI();
            canvas.drawChoices(ui.text, ui.choices);
        }
    }

    keyDownEncyclopedia(keycode: number) {
        console.log('key down encyclopedia: ', keycode, core.getEvent());
        if (keycode == 37)  // 37:左
            drawEncyclopedia(core.getEventData('index') - 6);
        if (keycode == 38)  // 38:上
            drawEncyclopedia(core.getEventData('index') - 1);
        if (keycode == 39)  // 39:右
            drawEncyclopedia(core.getEventData('index') + 6);
        if (keycode == 40)  // 40:下
            drawEncyclopedia(core.getEventData('index') + 1);
        if (keycode == 33)  // 33:PageUp
            drawEncyclopedia(core.getEventData('index') - 6);
        if (keycode == 34)  // 34:PageDown
            drawEncyclopedia(core.getEventData('index') + 6);
    }

    keyUpEncyclopedia(keycode: number) {
        console.log('key up encyclopedia: ', keycode, core.getEvent());
        if (keycode == 27 || keycode == 88) {
            if (!core.hasEventDataSelection())
                canvasAnimate.closeUIPanel();
            else {
                canvasAnimate.resetBoxAnimate();
                canvas.drawMaps(core.getEventDataSelection());
            }
            return;
        }
        if (keycode == 13 || keycode == BLOCK_WIDTH || keycode == 67) {
            const idx = core.getEventData('index');
            if (isset(idx)) {
                this.clickEncyclopedia(6, 2 * (idx! % 6));
            }
            return;
        }
    }

    clickEncyclopedia(x: number, y: number) {
        console.log('click encyclopedia: ' + x + ',' + y);
        const index = core.getEventData('index');
        if ((x == 3 || x == 4) && y == 12) {
            drawEncyclopedia(index - 6);
            return;
        }
        if ((x == 8 || x == 9) && y == 12) {
            drawEncyclopedia(index + 6);
            return;
        }
        if (x >= 10 && x <= 12 && y == 12) {
            if (!core.hasEventDataSelection())
                canvasAnimate.closeUIPanel();
            else {
                canvasAnimate.resetBoxAnimate();
                canvas.drawMaps(core.getEventDataSelection());
            }
            return;
        }
        if (isset(index) && y < 12) {
            let page = toInt(index / 6);
            let idx = 6 * page + toInt(y / 2);
            drawEncyclopedia(idx);
            drawBookDetail(idx);
        }
        return;
    }

    clickEncyclopediaDetail() {
        data.clearRect();
        core.setEventId('encyclopedia');
    }

    keyDownTransport(keyCode: number) {
        console.log('key down fly: ', keyCode);
        if ([37, 38].includes(keyCode))  // 37:左, 38:上
            drawTransport(core.getEventData('page') + 1);
        else if ([39, 40].includes(keyCode))  // 39:右, 40:下
            drawTransport(core.getEventData('page') - 1);
    }

    // 按下按键后的执行逻辑 | 按下按键
    keyDownImpl(keyCode: number) {
        console.log("key down: " + keyCode);
        if (core.isLocked()) {
            if (keyCode == 17) {
                this.keyDownCtrl();
                return;
            }
            console.log('keyDownImpl locked and eventId:', core.getEventId());
            switch (core.getEventId()) {
                case 'action':
                    this.keyDownAction(keyCode);
                    return;
                case 'encyclopedia':
                    this.keyDownEncyclopedia(keyCode);
                    return;
                case 'transport':
                    this.keyDownTransport(keyCode);
                    return;
                case 'viewMaps':
                    this.keyDownViewMaps(keyCode);
                    return;
                case 'shop':
                    this.keyDownShop(keyCode);
                    return;
                case 'selectShop':
                    this.keyDownQuickShop(keyCode);
                    return;
                case 'toolbox':
                    this.keyDownToolBox(keyCode);
                    return;
                case 'save':
                case 'load':
                    this.keyDownSL(keyCode);
                    return;
                case 'switchs':
                    this.keyDownSwitchs(keyCode);
                    return;
                case 'settings':
                    this.keyDownSettings(keyCode);
                    return;
                case 'syncSave':
                    this.keyDownSyncSave(keyCode);
                    return;
                case 'localSaveSelect':
                    this.keyDownLocalSaveSelect(keyCode);
                    return;
                case 'cursor':
                    this.keyDownCursor(keyCode);
                    return;
            }
            return;
        }

        if (!core.isStarted()) {
            return;
        }

        switch (keyCode) {
            case 37:
                movePlayer('left');
                break;
            case 38:
                movePlayer('up');
                break;
            case 39:
                movePlayer('right');
                break;
            case 40:
                movePlayer('down');
                break;
        }
        if (core.getFlag('usingCenterFly') && keyCode != 51) {
            const playerLoc = playerMgr.getPlayerLoc();
            ui.clearRect((12 - playerLoc.x) * BLOCK_WIDTH, (12 - playerLoc.y) * BLOCK_WIDTH, BLOCK_WIDTH, BLOCK_WIDTH);
            core.setFlag('usingCenterFly', false);
        }
    }

    // 按住按键时 | Pressing key down
    pressKey(keyCode: number) {
        console.log("press key: " + keyCode);
        if (keyCode === this.holdingKeys.slice(-1)[0]) {
            console.log("key hold: " + keyCode);
            this.keyDownImpl(keyCode);
            setTimeout(() => {
                this.pressKey(keyCode);
            }, DEFAULT_TIMEOUT_MILLS);
        }
    }

    keyDownHandler(event: KeyboardEvent) {
        if (!core.isStarted()) {
            return;
        }
        console.log("key down keycode: " + event.keyCode);
        console.log("key down str: " + event.key);
        const keyCode = event.keyCode;
        const isArrow = { 37: true, 38: true, 39: true, 40: true }[keyCode];
        if (isArrow && !core.isLocked()) {
            console.log('is arrow and not locked')
            for (let i = 0; i < this.holdingKeys.length; i++) {
                if (this.holdingKeys[i] === keyCode) {
                    return;
                }
            }
            this.holdingKeys.push(keyCode);
            this.pressKey(keyCode);
        } else {
            console.log('not arrow or locked');
            this.keyDownImpl(keyCode);
        }
    }

    keyUpAction(keyCode: number) {
        const data = core.getEventDataCurrent();
        const type = data.type;
        console.log('key up action type: ' + type);
        console.log('key up action keyCode: ' + keyCode);
        console.log('key up action event: ', core.getEvent());
        if (type == 'text' && [13, BLOCK_WIDTH, 67].includes(keyCode)) {
            eventManager.handleAction();
            return;
        }

        if (type == 'choices') {
            const choices = data?.choices;
            console.log('key up choices : ', choices);
            if (isset(choices) && choices.length > 0) {
                // 13: 确定 BLOCK_WIDTH:空格 67:C
                if ([13, BLOCK_WIDTH, 67].includes(keyCode)) {
                    route.push('choices:' + core.getEventDataSelection());
                    eventManager.doOrInsertAction(choices[core.getEventDataSelection()].action);
                    eventManager.handleAction();
                }
            }

        }
    }

    keyUpConfirmBox(keyCode: number) {
        console.log('key up confirm box: ', keyCode);
        if (keyCode == 37) {
            // 左
            console.log('set selection to 0 here1\n');
            core.setEventDataSelection(0);
            canvas.drawConfirmBox(core.getEventDataUI() as string, core.getEventData('yes'), core.getEventData('no'));
        }

        if (keyCode == 39) {
            // 右
            console.log('set selection to 1 here1\n');
            core.setEventDataSelection(1);
            canvas.drawConfirmBox(core.getEventDataUI() as string, core.getEventData('yes'), core.getEventData('no'));
        }

        console.log('coreStatus.event?.selection: ' + core.getEventDataSelection())
        if ([13, BLOCK_WIDTH, 67].includes(keyCode)) {
            // 13: 确定 BLOCK_WIDTH:空格 67:C
            const yes = core.getEventData('yes');
            const no = core.getEventData('no');
            if (core.getEventDataSelection() == 0 && isset(yes)) {
                console.log('confirm yes');
                console.log('set selection to undefined here1\n');
                core.setEventDataSelection(undefined);
                yes();
            }
            if (core.getEventDataSelection() == 1 && isset(no)) {
                console.log('confirm false');
                console.log('set selection to undefined here2\n');
                core.setEventDataSelection(undefined);
                no();
            }
        }
    }

    doEffect(expression: string) {
        console.log('do effect', expression);
        let arr = expression.split("+=");
        if (arr.length != 2) return;
        let name = arr[0];
        let value = eventManager.evalValue(arr[1]);
        if (name.startsWith("status:")) {
            let status = name.substring(7);
            playerMgr.setPlayerProperty(status, value);
        }
        else if (name.startsWith("item:")) {
            let itemId = name.substring(5);
            playerMgr.addItem(itemId, value);
        }
    }

    clickShop(x: number, y: number) {
        console.log('click shop', x, y);
        let shop = core.getEventData('shop');
        console.log('shop', shop);
        let choices = shop.choices;
        console.log('shop choices', choices);
        if (x >= 5 && x <= 7) {
            let topIndex = 6 - toInt(choices.length / 2);
            if (y >= topIndex && y < topIndex + choices.length) {
                console.log('set selection to y - topindx here', y - topIndex);
                core.setEventDataSelection(y - topIndex);

                let money = playerMgr.getPlayerMoney();
                let experience = playerMgr.getPlayerExp();
                let times = shop.times;
                let need = eval(shop.need);
                let use = shop.use;
                let use_text = use == 'money' ? i18next.t('money') : i18next.t('experience');

                let choice = choices[y - topIndex];
                if (isset(choice.need)) {
                    need = eval(choice.need!);
                }

                if (need > eval(use)) {
                    canvas.drawTip(`${i18next.t('not_enough')}${use_text}`);
                    return false;
                }

                core.getEventData('actions').push(y - topIndex);

                eval(use + '-=' + need);

                playerMgr.setPlayerMoney(money);
                playerMgr.setPlayerExp(experience);

                choice.effect.split(";").forEach(this.doEffect);
                statusBar.syncPlayerStatus();

                shop.times++;

                eventManager.handleOpenShop(core.getEventData('id'));
            }
            else if (y == topIndex + choices.length) {
                // 离开
                if (core.getEventData('actions').length > 0) {
                    route.push("shop:" + core.getEventData('id') + ":" + core.getEventData('actions')!.join(""));
                }

                core.updateEventData('actions', []);
                canvasAnimate.resetBoxAnimate();
                if (core.hasEventData('fromList'))
                    drawQuickShop();
                else
                    canvasAnimate.closeUIPanel();
            }
            else
                return false;
        }
        return true;
    }

    keyUpShop(keyCode: number) {
        if ([27, 88].includes(keyCode)) {
            // Esc/X
            if (core.getEventData('actions')!.length! > 0) {
                route.push("shop:" + core.getEventData('id') + ":" + core.getEventData('actions')!.join(""));
            }

            core.updateEventData('actions', []);
            canvasAnimate.resetBoxAnimate();
            if (core.hasEventData('fromList')) {
                drawQuickShop();
            }
            else {
                canvasAnimate.closeUIPanel();
            }
            return;
        }
        let shop = core.getEventData('shop');
        let choices = shop.choices;
        if ([13, BLOCK_WIDTH, 67].includes(keyCode)) {
            // 13: 确定 BLOCK_WIDTH:空格 67:C
            let topIndex = 6 - toInt(choices.length / 2);
            this.clickShop(6, topIndex + core.getEventDataSelection());
        }
    }

    clickTransport(x: number, y: number) {
        console.log('click transport', x, y);
        if ((x == 10 || x == 11) && y == 9)
            drawTransport(core.getEventData('page') - 1);

        if ((x == 10 || x == 11) && y == 5)
            drawTransport(core.getEventData('page') + 1);

        if (x >= 5 && x <= 7 && y == 12)
            canvasAnimate.closeUIPanel();

        if (x >= 0 && x <= 9 && y >= 3 && y <= 11) {
            let floorId = core.getEventData('page');
            let index = playerMgr.getPlayerTransportEnabledRange().indexOf(playerMgr.getFloorId());
            let stair = floorId < index ? StairDirection.UPFLOOR : StairDirection.DOWNFLOOR;
            let toFloor = playerMgr.getPlayerTransportEnabledRange()[floorId];
            route.push("fly:" + toFloor);
            canvasAnimate.closeUIPanel();
            switchFloor(toFloor, stair);
        }
    }

    keyUpTransport(keyCode: number) {
        console.log('key up transport', keyCode);
        if ([71, 27, 88].includes(keyCode)) {
            // 71: G 27: Esc 88: X
            canvasAnimate.closeUIPanel();
        }
        if ([13, BLOCK_WIDTH, 67].includes(keyCode)) {
            // 13: 确定 BLOCK_WIDTH:空格 67:C
            this.clickTransport(5, 5);
        }
    }

    openSettings(needCheckStatus: boolean = false) {
        if (!playerMgr.checkStatusSatisfiedAndSetEventId('settings', needCheckStatus)) {
            return;
        }
        drawSettings();
    }

    keyDownSettings(keyCode: number) {
        console.log('key down settings', keyCode);
        if (keyCode == 38) {
            // 上
            core.decEventDataSelection();
            canvas.drawChoices(core.getEventDataUI().text, core.getEventDataUI().choices);
        }
        if (keyCode == 40) {
            // 下
            core.incEventDataSelection();
            canvas.drawChoices(core.getEventDataUI().text, core.getEventDataUI().choices);
        }
    }

    keyUpSettings(keyCode: number) {
        console.log('key up settings', keyCode);
        if ([27, 88].includes(keyCode)) {
            canvasAnimate.closeUIPanel();
            return;
        }
        let choices = core.getEventDataUI().choices;
        if ([13, BLOCK_WIDTH, 67].includes(keyCode)) {
            // 13: 确定 BLOCK_WIDTH:空格 67:C
            let topIndex = 6 - toInt((choices!.length - 1) / 2);
            this.clickSettings(6, topIndex + core.getEventDataSelection());
        }
    }

    keyDownSwitchs(keyCode: number) {
        console.log('key down switchs', keyCode);
        console.log('key down switch event: ', core.getEvent());
        if (keyCode == 38) {
            // 上
            core.decEventDataSelection();
            canvas.drawChoices(core.getEventDataUI().text, core.getEventDataUI().choices);
        }
        if (keyCode == 40) {
            // 下
            core.incEventDataSelection();
            canvas.drawChoices(core.getEventDataUI().text, core.getEventDataUI().choices);
        }
    }

    keyUpSwitchs(keyCode: number) {
        console.log('key up switchs', keyCode);
        console.log('key up switch event: ', core.getEvent());
        if ([27, 88].includes(keyCode)) {
            // 27: Esc 88: X
            core.setEventDataSelection(0);
            drawSettings();
            return;
        }
        let choices = core.getEventDataUI().choices as string[];
        if ([13, BLOCK_WIDTH, 67].includes(keyCode)) {
            let topIndex = 6 - toInt((choices.length - 1) / 2);
            console.log('keyup switches topIndex', topIndex)
            this.clickSwitchs(6, topIndex + core.getEventDataSelection());
        }
    }

    clickSwitchs(x: number, y: number) {
        console.log('click switchs', x, y);
        if (x < 5 || x > 7) return;
        let choices = core.getEventDataUI().choices as string[];
        let topIndex = 6 - toInt((choices.length - 1) / 2);
        console.log('topIndex', topIndex)
        if (y >= topIndex && y < topIndex + choices.length) {
            let selection = y - topIndex;
            console.log('selection', selection)
            switch (selection) {
                case 0:
                    break;
                case 1:
                    config.showBattleAnimate = !config.showBattleAnimate;
                    setLocalStorage('battleAnimate', config.showBattleAnimate);
                    drawSwitchs();
                    break;
                case 2:
                    config.displayEnemyDamage = !config.displayEnemyDamage;
                    updateDamageDisplay();
                    setLocalStorage('enemyDamage', config.displayEnemyDamage);
                    drawSwitchs();
                    break;
                case 3:
                    config.displayExtraDamage = !config.displayExtraDamage;
                    updateDamageDisplay();
                    setLocalStorage('extraDamage', config.displayExtraDamage);
                    drawSwitchs();
                    break;
                case 4:
                    core.setEventDataSelection(0);
                    drawSettings();
                    break;
            }
        }
    }

    clickSettings(x: number, y: number) {
        if (x < 5 || x > 7) return;
        let choices = core.getEventDataUI().choices as string[];
        let topIndex = 6 - toInt((choices.length - 1) / 2);
        if (y >= topIndex && y < topIndex + choices.length) {
            let selection = y - topIndex;

            switch (selection) {
                case 0:
                    core.setEventDataSelection(0);
                    drawSwitchs();
                    break;
                case 1:
                    core.setEventDataSelection(0);
                    drawQuickShop();
                    break;
                case 2:
                    if (!config.enableViewMaps) {
                        canvas.drawTip("本塔不可浏览地图！");
                    }
                    else {
                        canvas.drawText("\t[系统提示]即将进入浏览地图模式。\n\n点击地图上半部分，或按[↑]键可查看前一张地图\n点击地图下半部分，或按[↓]键可查看后一张地图\n点击地图中间，或按[ESC]键可离开浏览地图模式\n此模式下可以打开怪物手册以查看某层楼的怪物属性", () => {
                            canvas.drawMaps(playerMgr.getFloorId());
                        })
                    }
                    break;
                case 3:
                    canvas.drawText(i18next.t('unimplemented'));
                    break;
                case 4:
                    core.setEventDataSelection(1);
                    canvas.drawConfirmBox("你确定要重新开始吗？", () => {
                        eventManager.handleRestart();
                    }, () => {
                        core.setEventDataSelection(3);
                        drawSettings();
                    });
                    break;
                case 5:
                    canvas.drawText(i18next.t('unimplemented'));
                    break;
                case 6:
                    drawHelp();
                    break;
                case 7:
                    drawAbout();
                    break;
                case 8:
                    canvasAnimate.closeUIPanel();
                    break;
            }
        }
    }



    keyUp(keyCode: number) {
        console.log("key up locked: " + core.isLocked());
        const eventId = core.getEventId();
        console.log('key up event id: ' + eventId);

        if (core.isLocked()) {
            console.log('key up clear holding keys');
            this.holdingKeys = [];

            if (eventId == 'text' && [13, BLOCK_WIDTH, 67].includes(keyCode)) {
                // 13: 确定 BLOCK_WIDTH:空格 67:C
                canvas.drawText();
                return;
            }

            if (eventId == 'confirmBox') {
                this.keyUpConfirmBox(keyCode);
                return;
            }

            if (eventId == 'shop') {
                this.keyUpShop(keyCode);
                return;
            }

            if (eventId == 'action') {
                this.keyUpAction(keyCode);
                return;
            }

            if (eventId == 'encyclopedia') {
                this.keyUpEncyclopedia(keyCode);
                return;
            }

            if (eventId == 'transport') {
                this.keyUpTransport(keyCode);
                return;
            }

            if (eventId == 'switchs') {
                this.keyUpSwitchs(keyCode);
                return;
            }

            if (eventId == 'syncSave') {
                this.keyUpSyncSave(keyCode);
                return;
            }

            if (eventId == 'about' && ([13, BLOCK_WIDTH, 67].includes(keyCode))) {
                this.clickAbout();
                return;
            }

            if (eventId == 'localSaveSelect') {
                this.keyUpLocalSaveSelect(keyCode);
                return;
            }

            if (eventId == 'toolbox') {
                this.keyUpToolBox(keyCode);
                return;
            }

            if (eventId == 'settings') {
                this.keyUpSettings(keyCode);
                return;
            }

            if (eventId == 'viewMaps') {
                this.keyUpViewMaps(keyCode);
                return;
            }

            if (eventId == 'save' || eventId == 'load') {
                this.keyUpSL(keyCode);
                return;
            }

            if (eventId == 'selectShop') {
                this.keyUpQuickShop(keyCode);
                return;
            }

            if (eventId == 'cursor') {
                this.keyUpCursor(keyCode);
                return;
            }

            return;
        }

        if (!core.isStarted()) {
            return;
        }

        switch (keyCode) {
            case 27: // ESC
                if (!playerMgr.isPlayerMoving()) {
                    this.openSettings(true);
                }
                break;
            case 71: // G
                if (!playerMgr.isPlayerMoving()) {
                    eventManager.handleUseToolBarTransporter(true);
                }
                break;
            case 88: // X
                if (!playerMgr.isPlayerMoving()) {
                    drawOpenEncyclopedia(true);
                }
                break;
            case 65: // A
                eventManager.doSL("autoSave", "load");
                break;
            case 83: // S
                if (!playerMgr.isPlayerMoving())
                    eventManager.handleSaveGame(true);
                break;
            case 68: // D
                if (!playerMgr.isPlayerMoving())
                    eventManager.handleLoadGame(true);
                break;
            case 69: // E
                if (!playerMgr.isPlayerMoving())
                    drawCursor();
                break;
            case 84: // T
                if (!playerMgr.isPlayerMoving())
                    eventManager.handleOpenToolbox(true);
                break;
            case 90: // Z
                if (!playerMgr.isPlayerMoving())
                    eventManager.handleTurnPlayer();
                break;
            case 75: // K
                if (!playerMgr.isPlayerMoving())
                    eventManager.handleOpenQuickShop(true);
                break;
            case 72: // H
                if (!core.isLocked() && !playerMgr.isPlayerMoving())
                    drawHelp();
                break;
            case 37: // UP
                break;
            case 38: // DOWN
                break;
            case 39: // RIGHT
                break;
            case 40: // DOWN
                break;
        }

        if (autoRoute.isMoveEnabled()) {
            autoRoute.stop();
        }

        playerMgr.setPlayerIsMoving(false);
    }

    onKeyUp(event: KeyboardEvent) {
        console.log('on key up', event);
        console.log('on key up locked', core.isLocked());
        console.log('coreStatus.holdingKeys', this.holdingKeys);
        const keyCode = event.keyCode;
        let isArrow: boolean = [37, 38, 39, 40].includes(keyCode);
        if (isArrow && !core.isLocked()) {
            for (let i = 0; i < this.holdingKeys.length; i++) {
                const holdingKeyCode = this.holdingKeys[i];
                if (holdingKeyCode == keyCode) {
                    console.log('remove holding key: ', keyCode);
                    this.holdingKeys = this.holdingKeys.slice(0, i).concat(this.holdingKeys.slice(i + 1));
                    console.log('after remove holding keys: ', this.holdingKeys);
                    if (i == this.holdingKeys.length && this.holdingKeys.length !== 0) {
                        const key = this.holdingKeys.slice(-1)[0];
                        console.log('slice holding key: ', key);
                        this.pressKey(key);
                        break;
                    }
                }
            }
            this.keyUp(keyCode);
        } else {
            this.keyUp(keyCode);
        }
    }

    keyUpHandler(event: KeyboardEvent) {
        if (core.isStarted() || core.isLocked()) {
            this.onKeyUp(event);
        }
    }

    clickConfirmBox(x: number, y: number) {
        console.log('click confirm box', x, y);
        const yes = core.getEventData('yes');
        const no = core.getEventData('no');
        if ((x == 4 || x == 5) && y == 7 && isset(yes))
            yes();

        if ((x == 7 || x == 8) && y == 7 && isset(no))
            no();
    }

    @callertrace
    @log
    onClick(x: number, y: number, postRoute: PlayerLocation[] = []) {
        console.log("current event: ", core.getEvent());
        // 非游戏屏幕内
        if (x < 0 || y < 0 || x > CANVAS_BLOCK_WIDTH_CNT - 1 || y > CANVAS_BLOCK_WIDTH_CNT - 1) {
            return;
        }

        // 中心对称飞行器
        if (core.getFlag('usingCenterFly')) {
            const playerLoc = playerMgr.getPlayerLoc();
            if (x != CANVAS_BLOCK_WIDTH_CNT - 1 - playerLoc.x || y != CANVAS_BLOCK_WIDTH_CNT - 1 - playerLoc.y) {
                ui.clearRect((CANVAS_BLOCK_WIDTH_CNT - 1 - playerLoc.x) * BLOCK_WIDTH, (CANVAS_BLOCK_WIDTH_CNT - 1 - playerLoc.y) * BLOCK_WIDTH, BLOCK_WIDTH, BLOCK_WIDTH);
            } else {
                if (itemMgr.canUseItem('centerFly')) {
                    itemMgr.useItem('centerFly');
                    ui.clearRect(playerMgr.getPlayerLocX() * BLOCK_WIDTH, playerMgr.getPlayerLocY() * BLOCK_WIDTH, BLOCK_WIDTH, BLOCK_WIDTH);
                    return;
                }
                else {
                    canvas.drawTip('当前不能使用对称飞行器');
                    ui.clearRect((CANVAS_BLOCK_WIDTH_CNT - 1 - playerMgr.getPlayerLocX()) * BLOCK_WIDTH, (CANVAS_BLOCK_WIDTH_CNT - 1 - playerMgr.getPlayerLocY()) * BLOCK_WIDTH, BLOCK_WIDTH, BLOCK_WIDTH);
                }
            }
            core.setFlag('usingCenterFly', false);
        }

        // 寻路
        if (!core.isLocked()) {
            console.log('onclick control unlocked');
            autoRoute.set(x, y, postRoute);
            return;
        }

        console.log('onclick control locked');
        switch (core.getEventId()) {
            case 'encyclopedia':
                this.clickEncyclopedia(x, y);
                return;
            case 'encyclopedia-detail':
                this.clickEncyclopediaDetail();
                return;
            case 'transport':
                this.clickTransport(x, y);
                return;
            case 'viewMaps':
                this.clickViewMaps(x, y);
                return;
            case 'switchs':
                this.clickSwitchs(x, y);
                return;
            case 'settings':
                this.clickSettings(x, y);
                return;
            case 'shop':
                this.clickShop(x, y);
                return;
            case 'selectShop':
                this.clickQuickShop(x, y);
                return;
            case 'toolbox':
                this.clickToolbox(x, y);
                return;
            case 'save':
            case 'load':
                this.clickSL(x, y);
                return;
            case 'confirmBox':
                this.clickConfirmBox(x, y);
                return;
            case 'about':
                this.clickAbout(x, y);
                return;
            case 'action':
                this.clickAction(x, y);
                return;
            case 'text':
                canvas.drawText();
                return;
            case 'syncSave':
                alert('暂不支持');
                // clickSyncSave(x, y);
                return;
            case 'syncSelect':
                // clickSyncSelect(x, y);
                return;
            case 'localSaveSelect':
                this.clickLocalSaveSelect(x, y);
                return;
            case 'cursor':
                this.clickCursor(x, y);
                return;
        }
    }


    clickAction(x: number, y: number) {
        console.log('clickAction: (' + x + ',' + y + ')');
        console.log('clickAction event', core.getEvent());
        if (core.getEventData('type') == 'text') {
            // 文字
            console.log('clickAction find event text, do action');
            eventManager.handleAction();
            return;
        }
        let data = core.getEventDataCurrent();
        if (data.type == 'choices') {
            let choices = data.choices;
            if (choices.length == 0)
                return;

            console.log('clickAction find event choices', choices);

            if (x >= 5 && x <= 7) {
                y = toInt(y);
                let topIndex = 6 - toInt((choices.length - 1) / 2);
                if (y >= topIndex && y < topIndex + choices.length) {
                    // 选择
                    route.push("choices:" + (y - topIndex));
                    console.log('y - topIndex: ', y - topIndex);
                    eventManager.doOrInsertAction(choices[y - topIndex].action);
                    eventManager.handleAction();
                }
            }
        }
    }

    bookOnClickHandler() {
        console.log('bookOnClickHandler');
        if (core.isStarted()) {
            drawOpenEncyclopedia(true);
        }
    }

    keyDownSyncSave(keyCode: number) {
        if (keyCode == 38) {
            // 上
            core.decEventDataSelection();
            const ui = core.getEventDataUI();
            canvas.drawChoices(ui.text, ui.choices);
        }
        if (keyCode == 40) {
            // 下
            core.incEventDataSelection();
            const ui = core.getEventDataUI();
            canvas.drawChoices(ui.text, ui.choices);
        }
    }

    keyUpSyncSave(keyCode: number) {
        if ([27, 88].includes(keyCode)) {
            // ESC/X
            core.updateEventData('selection', 2);
            drawSettings();
            return;
        }
        const ui = core.getEventDataUI();
        let choices = ui.choices as string[];
        if ([13, BLOCK_WIDTH, 67].includes(keyCode)) {
            // 13/空格/C
            let topIndex = 6 - toInt((choices.length - 1) / 2);
            this.clickSyncSave(6, topIndex + core.getEventData('selection'));
        }
    }

    clickSyncSave(x: number, y: number) {
        if (x < 5 || x > 7)
            return;

        alert('unimplemented');
    }

    clickAbout(x?: number, y?: number) {
        if (core.isStarted()) {
            canvasAnimate.closeUIPanel();
        } else {
            menu.show();
        }
    }

    keyDownLocalSaveSelect(keyCode: number) {

    }

    keyUpLocalSaveSelect(keyCode: number) {

    }

    clickLocalSaveSelect(x: number, y: number) {
        if (x < 5 || x > 7)
            return;
    }

    toolBoxOnClickHandler() {
        if (core.isStarted()) {
            eventManager.handleOpenToolbox(true);
        }

    }



    keyDownToolBox(keyCode: number) {
        console.log('keyDownToolBox', keyCode);
        console.log('keyDownToolBox event', core.getEvent());
        if (!isset(core.getEventData('id')))
            return;

        let tools = Object.keys(playerMgr.getPlayerTools()).sort();
        let constants = Object.keys(playerMgr.getPlayerConstants()).sort();
        let index = core.getEventData('selection')!;

        console.log('tool box index: ', index);

        if (keyCode == 37) {
            // left
            if ((index > 0 && index < 100) || index > 100) {
                this.clickToolboxIndex(index - 1);
                return;
            }
            if (index == 100 && tools.length > 0) {
                this.clickToolboxIndex(tools.length - 1);
                return;
            }
        }
        if (keyCode == 38) {
            // up
            if ((index > 5 && index < 100) || index > 105) {
                this.clickToolboxIndex(index - 6);
                return;
            }
            if (index >= 100 && index <= 105) {
                if (tools.length > 6) {
                    this.clickToolboxIndex(Math.min(tools.length - 1, index - 100 + 6));
                }
                else if (tools.length > 0) {
                    this.clickToolboxIndex(Math.min(tools.length - 1, index - 100));
                }
                return;
            }
        }
        if (keyCode == 39) {
            // right
            if ((index < tools.length - 1) || (index >= 100 && index < constants.length + 100)) {
                this.clickToolboxIndex(index + 1);
                return;
            }
            if (index == tools.length - 1 && constants.length > 0) {
                this.clickToolboxIndex(100);
                return;
            }
        }
        if (keyCode == 40) {
            // down
            if (index <= 5) {
                if (tools.length > 6) {
                    this.clickToolboxIndex(Math.min(tools.length - 1, index + 6));
                }
                else if (constants.length > 0) {
                    this.clickToolboxIndex(100 + Math.min(constants.length - 1, index));
                }
                return;
            }
            if (index > 5 && index < 100 && constants.length > 0) {
                this.clickToolboxIndex(100 + Math.min(constants.length - 1, index - 6));
                return;
            }
            if (index >= 100 && index <= 105 && constants.length > 6) {
                this.clickToolboxIndex(Math.min(100 + constants.length - 1, index + 6));
                return;
            }
        }
    }

    keyUpToolBox(keyCode: number) {
        console.log('keyUpToolBox', keyCode);
        console.log('keyUpToolBox event', core.getEvent());
        if ([27, 84, 88].includes(keyCode)) {
            // 27: esc, 84: t, 88: x
            canvasAnimate.closeUIPanel();
            return;
        }

        if (!isset(core.getEventData('id')))
            return;

        if ([13, BLOCK_WIDTH, 67].includes(keyCode)) {
            // 13: enter, BLOCK_WIDTH: space, 67: c
            this.clickToolboxIndex(core.getEventData('selection')!);
            return;
        }

        if (keyCode == 46) {
            // delete
            if (!isset(core.getEventData('id')))
                return;
            itemMgr.removeItem(core.getEventData('id')!);
            core.updateEventData('id', undefined);
            drawToolbox();
            return;
        }
    }

    clickToolbox(x: number, y: number) {
        // 返回
        if (x >= 10 && x <= 12 && y == 12) {
            canvasAnimate.closeUIPanel();
            return;
        }
        if (x >= 10 && x <= 12 && y <= 1) {
            if (!isset(core.getEventData('id')))
                return;
            itemMgr.removeItem(core.getEventData('id')!);
            core.updateEventData('id', undefined);
            drawToolbox();
            return;
        }

        let index = 0;
        if (y == 4 || y == 5 || y == 9 || y == 10)
            index = toInt(x / 2);
        else
            index = 6 + toInt(x / 2);
        if (y >= 9) index += 100;
        this.clickToolboxIndex(index);
    }


    // 选择工具栏界面中某个Index后的操作
    clickToolboxIndex(index: number) {
        console.log('clickToolboxIndex', index);
        let items = undefined;
        let ii = index;
        if (ii < 100)
            items = Object.keys(playerMgr.getPlayerTools()).sort();
        else {
            ii -= 100;
            items = Object.keys(playerMgr.getPlayerConstants()).sort();
        }
        console.log('items', items);
        if (items == undefined) {
            return;
        }

        if (ii >= items.length)
            return;

        let itemId = items[ii];
        if (itemId == core.getEventData('id')) {
            itemMgr.useToolBarItem(itemId);
        }
        else {
            drawToolbox(index);
        }
    }

    settingsOnClickHandler() {
        if (core.isStarted()) {
            this.openSettings(true);
        }
    }

    keyUpViewMaps(keyCode: number) {
        console.log('keyUpViewMaps', keyCode);
        console.log('keyUpViewMaps event', core.getEvent());

        if ([13, 27, BLOCK_WIDTH, 67].includes(keyCode)) {
            // 13: enter, 27: esc, BLOCK_WIDTH: space, 67: c
            data.clearRect();
            data.setOpacity(1);
            canvasAnimate.closeUIPanel();
        }

        if (keyCode == 88) {
            // x
            drawOpenEncyclopedia(false);
        }
    }

    keyDownViewMaps(keyCode: number) {
        console.log('keyDownViewMaps', keyCode);
        console.log('keyDownViewMaps event', core.getEvent());

        if ([33, 37, 38].includes(keyCode))
            canvas.drawMaps(core.getEventData('index') + 1);
        else if ([34, 39, 40].includes(keyCode))
            canvas.drawMaps(core.getEventData('index') - 1);
        return;
    }

    clickViewMaps(x: number, y: number) {
        console.log('clickViewMaps', x, y);
        console.log('clickViewMaps event', core.getEvent());

        if (y <= 4) {
            canvas.drawMaps(core.getEventData('index') + 1);
        }
        else if (y >= 8) {
            canvas.drawMaps(core.getEventData('index') - 1);
        }
        else {
            data.clearRect();
            data.setOpacity(1);
            canvasAnimate.closeUIPanel();
        }
    }


    keyDownSL(keyCode: number) {
        console.log('keyDownSL', keyCode);
        console.log('keyDownSL event', core.getEvent());

        let index = core.getEventData('index')!;
        let page = toInt(index / 10)
        let offset = index % 10;

        if (keyCode == 37) {
            // left
            if (offset == 0) {
                drawSLPanel(10 * (page - 1) + 5);
            }
            else {
                drawSLPanel(index - 1);
            }
            return;
        }
        if (keyCode == 38) { // up
            if (offset < 3) {
                drawSLPanel(10 * (page - 1) + offset + 3);
            }
            else {
                drawSLPanel(index - 3);
            }
            return;
        }
        if (keyCode == 39) { // right
            if (offset == 5) {
                drawSLPanel(10 * (page + 1) + 1);
            }
            else {
                drawSLPanel(index + 1);
            }
            return;
        }
        if (keyCode == 40) { // down
            if (offset >= 3) {
                drawSLPanel(10 * (page + 1) + offset - 3);
            }
            else {
                drawSLPanel(index + 3);
            }
            return;
        }
        if (keyCode == 33) { // PAGEUP
            drawSLPanel(10 * (page - 1) + offset);
            return;
        }
        if (keyCode == 34) { // PAGEDOWN
            drawSLPanel(10 * (page + 1) + offset);
            return;
        }
    }

    keyUpSL(keyCode: number) {
        console.log('keyUpSL', keyCode);
        console.log('keyUpSL event', core.getEvent());

        let index = core.getEventData('index')!;
        let page = toInt(index / 10), offset = index % 10;

        if ([27, 88].includes(keyCode) || (core.getEventId() == 'save' && keyCode == 83) || (core.getEventId() == 'load' && keyCode == 68)) {
            canvasAnimate.closeUIPanel();
            if (!core.isStarted()) {
                menu.show();
            }
            return;
        }
        if ([13, BLOCK_WIDTH, 67].includes(keyCode)) {
            // 13: enter, BLOCK_WIDTH: space, 67: c
            if (offset == 0) {
                eventManager.doSL("autoSave", core.getEventId()!);
            }
            else {
                eventManager.doSL(5 * page + offset, core.getEventId()!);
            }
            return;
        }
    }

    clickSL(x: number, y: number) {
        console.log('clickSL', x, y);
        console.log('clickSL event', core.getEvent());

        let index = core.getEventData('index');
        let page = toInt(index / 10);
        let offset = index % 10;

        if ((x == 3 || x == 4) && y == 12) {
            // 上一页
            drawSLPanel(10 * (page - 1) + offset);
        }
        if ((x == 8 || x == 9) && y == 12) {
            // 下一页
            drawSLPanel(10 * (page + 1) + offset);
        }
        // 返回
        if (x >= 10 && x <= 12 && y == 12) {
            canvasAnimate.closeUIPanel();
            if (!core.isStarted()) {
                menu.show();
            }
            return;
        }

        index = 6 * page + 1;
        if (y >= 1 && y <= 4) {
            if (x >= 1 && x <= 3)
                eventManager.doSL("autoSave", core.getEventId()!);
            if (x >= 5 && x <= 7)
                eventManager.doSL(5 * page + 1, core.getEventId()!);
            if (x >= 9 && x <= 11)
                eventManager.doSL(5 * page + 2, core.getEventId()!);
        }
        if (y >= 7 && y <= 10) {
            if (x >= 1 && x <= 3)
                eventManager.doSL(5 * page + 3, core.getEventId()!);
            if (x >= 5 && x <= 7)
                eventManager.doSL(5 * page + 4, core.getEventId()!);
            if (x >= 9 && x <= 11)
                eventManager.doSL(5 * page + 5, core.getEventId()!);
        }
    }

    keyDownQuickShop(keyCode: number) {
        console.log('keyDownQuickShop', keyCode);
        console.log('keyDownQuickShop event', core.getEvent());

        if (keyCode == 38) {
            core.decEventDataSelection();
            const ui = core.getEventDataUI();
            canvas.drawChoices(ui.text, ui.choices);
        }
        if (keyCode == 40) {
            core.incEventDataSelection();
            const ui = core.getEventDataUI();
            canvas.drawChoices(ui.text, ui.choices);
        }
    }

    keyUpQuickShop(keyCode: number) {
        console.log('keyUpQuickShop', keyCode);
        console.log('keyUpQuickShop event', core.getEvent());
        if ([27, 75, 88].includes(keyCode)) {
            // 27: esc, 75: k, 88: x
            canvasAnimate.closeUIPanel();
            return;
        }
        const shopIds = shopMgr.getShopIds();
        if ([13, BLOCK_WIDTH, 67].includes(keyCode)) {
            let topIndex = 6 - toInt(shopIds.length / 2);
            this.clickQuickShop(6, topIndex + core.getEventData('selection')!);
        }
    }

    canUseQuickShop(): string | null {
        const floor = getFloorById();
        if (isset(floor) && isset(floor!.quickShopEnabled) && !(floor!.quickShopEnabled!))
            return '当前不能使用快捷商店。';

        return null;
    }


    clickQuickShop(x: number, y: number) {
        console.log('clickQuickShop', x, y);
        console.log('clickQuickShop event', core.getEvent());

        const shopIds = shopMgr.getShopIds();
        if (x >= 5 && x <= 7) {
            let topIndex = 6 - toInt(shopIds.length / 2);
            if (y >= topIndex && y < topIndex + shopIds.length) {
                let reason = this.canUseQuickShop();
                if (isset(reason)) {
                    canvas.drawText(reason!);
                    return;
                }
                eventManager.handleOpenShop(shopIds[y - topIndex], true);
                if (core.getEventId() == 'shop')
                    core.updateEventData('fromList', true);
            }
            // 离开
            else if (y == topIndex + shopIds.length)
                canvasAnimate.closeUIPanel();
        }
    }

    onmove(x: number, y: number) {
        if (autoRoute.getRoutePostEventLength() == 0) {
            return;
        }
        let pos: { x: number, y: number } | undefined = { 'x': x, 'y': y };
        let pos0 = autoRoute.getRoutePostEvent()[autoRoute.getRoutePostEventLength() - 1];
        let directionDistance = [pos!.y - pos0.y, pos0.x - pos!.x, pos0.y - pos!.y, pos!.x - pos0.x];
        let max = 0, index = 4;
        for (let ii = 0; ii < 4; ii++) {
            if (directionDistance[ii] > max) {
                index = ii;
                max = directionDistance[ii];
            }
        }
        pos = [{ 'x': 0, 'y': 1 }, { 'x': -1, 'y': 0 }, { 'x': 0, 'y': -1 }, { 'x': 1, 'y': 0 }, undefined][index]
        if (isset(pos)) {
            pos!.x += pos0.x;
            pos!.y += pos0.y;
            autoRoute.pushRoutePostEvent(pos!.x, pos!.y);
            canvas.fillPos(pos!);
        }
    }

    onMouseMoveHandler(event: MouseEvent) {
        console.log('onmousemove started: ', core.isStarted());
        console.log('onmousemove event: ', core.getEvent());

        try {
            // 阻止事件向上冒泡，确保这个事件不会被其他
            // 父级DOM元素的事件处理程序捕获。
            // Prevent event bubbling up, ensure this event 
            // will not be captured by event handlers of 
            // parent DOM elements.
            event.stopPropagation();

            let loc = this.getClickLoc(event.clientX, event.clientY);
            if (!isset(loc))
                return;

            let x = toInt(loc.x / loc.size);
            let y = toInt(loc.y / loc.size);
            this.onmove(x, y);
        } catch (err) {
            console.error(err);
        }
    }

    onTouchMoveHandler(e: TouchEvent) {
        try {
            e.preventDefault();
            let loc = this.getClickLoc(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
            if (!isset(loc))
                return;
            let x = toInt(loc.x / loc.size), y = toInt(loc.y / loc.size);
            this.onmove(x, y);
        } catch (err) {
            console.error(err);
        }
    }

    noteBookOnClickHandler() {
        if (core.isStarted()) {
            // drawNotes();
            canvas.drawText(i18next.t('unimplemented'));
        }
    }



    keyDownCursor(keyCode: number) {
        if (keyCode == 37) { // left
            autoRoute.setCursorX(autoRoute.getCursorX()! - 1);
            drawCursor();
            return;
        }
        if (keyCode == 38) { // up
            autoRoute.setCursorY(autoRoute.getCursorY()! - 1);
            drawCursor();
            return;
        }
        if (keyCode == 39) { // right
            autoRoute.setCursorX(autoRoute.getCursorX()! + 1);
            drawCursor();
            return;
        }
        if (keyCode == 40) { // down
            autoRoute.setCursorY(autoRoute.getCursorY()! + 1);
            drawCursor();
            return;
        }
    }

    keyUpCursor(keyCode: number) {
        if ([27, 88].includes(keyCode)) {
            // 27: esc, 88: x
            canvasAnimate.closeUIPanel();
            return;
        }
        if ([13, BLOCK_WIDTH, 67, 69].includes(keyCode)) {
            // 13: enter, BLOCK_WIDTH: space, 67: c, 69: e
            canvasAnimate.closeUIPanel();
            this.onClick(autoRoute.getCursorX()!, autoRoute.getCursorY()!, []);
            return;
        }
    }


    clickCursor(x: number, y: number) {
        console.log('clickCursor', x, y);
        console.log('clickCursor event', core.getEvent());

        if (x == autoRoute.getCursorX() && y == autoRoute.getCursorY()) {
            canvasAnimate.closeUIPanel();
            this.onClick(x, y, []);
            return;
        }
        autoRoute.setCursorX(x);
        autoRoute.setCursorY(y);
        drawCursor();
    }

}

export let interact = new InteractManager();