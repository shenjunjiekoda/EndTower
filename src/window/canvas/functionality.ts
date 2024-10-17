import { BLACK, BLOCK_WIDTH, CANVAS_BLOCK_WIDTH_CNT, ENCYCLOPEDIA_TEXT_FONT, GOLD, GREEN, INIT_CANVAS_WIDTH, LIGHT_GRAY, MAX, PAGINATION_FONT, RED, WHITE, YELLOW } from "../../common/constants";
import { canvas, data, getCanvasContext, ui } from "./canvas";
import i18next from "i18next";
import { core } from "../../common/global";
import { enemiesMgr } from "../../enemies/data";
import { getPlayerIconLineOfDirection, getPlayerIconStillOfDirection, imageMgr } from "../../resource/images";
import { formatDate, getLocalStorage, isset, setLocalStorage, toInt } from "../../common/util";
import { canvasAnimate } from "./animates";
import { PlayerLocation, playerMgr } from "../../player/data";
import { TextBoxResolver } from "./textBox";
import { Block, blocksToNumberArray } from "../../floor/block";
import { getFloorById, getMapData, loadMap } from "../../floor/data";
import { shopMgr } from "../../shops/shops";
import { eventManager, SLData } from "../../events/events";
import { config, staticConfig } from "../../common/config";
import { hideDomNode } from "../../common/client";
import { itemMgr } from "../../items/data";
import { autoRoute } from "../../player/autoroute";
import { audioMgr } from "../../resource/audios";

export function drawPagination(page: number, totalPage: number) {
    ui.setFont(PAGINATION_FONT);
    ui.setFillStyle(LIGHT_GRAY);

    let length = ui.measureTextWidth(page + " / " + page);

    ui.setTextAlign('left');
    ui.fillText(page + " / " + totalPage, (INIT_CANVAS_WIDTH - length) / 2, INIT_CANVAS_WIDTH - 13);

    ui.setTextAlign('center');
    if (page > 1)
        ui.fillText(i18next.t('last_page'), INIT_CANVAS_WIDTH / 2 - 80, INIT_CANVAS_WIDTH - 13);
    if (page < totalPage)
        ui.fillText(i18next.t('next_page'), INIT_CANVAS_WIDTH / 2 + 80, INIT_CANVAS_WIDTH - 13);

    ui.fillText(i18next.t('return'), INIT_CANVAS_WIDTH - 46, INIT_CANVAS_WIDTH - 13);
}

export function drawEncyclopedia(index: number) {
    canvas.clearTipAnimate();
    data.clearRect();
    data.setOpacity(1);

    ui.clearRect();
    ui.setAlpha(1);
    ui.setFillStyle(ui.createPattern(imageMgr.getGround())!);
    ui.fillRect();

    ui.setAlpha(0.6);
    ui.setFillStyle(BLACK);
    ui.fillRect();

    ui.setAlpha(1);
    ui.setTextAlign('left');
    ui.setFont(ENCYCLOPEDIA_TEXT_FONT);

    let enemys = enemiesMgr.getCurrentEnemys(core.getEventDataSelection());
    if (enemys.length == 0) {
        ui.fillText(i18next.t('no_enemy'), 83, 222, GREEN, ENCYCLOPEDIA_TEXT_FONT);
        ui.setTextAlign('center');
        ui.fillText(i18next.t('return'), 370, 403, LIGHT_GRAY, ENCYCLOPEDIA_TEXT_FONT);
        return;
    }

    index = Math.max(index, 0);
    index = Math.min(index, enemys.length - 1);
    core.updateEventData('index', index);

    let perpage = 6;
    let page = toInt(index / perpage) + 1;
    let totalPage = toInt((enemys.length - 1) / perpage) + 1;

    let start = (page - 1) * perpage, end = Math.min(page * perpage, enemys.length);
    enemys = enemys.slice(start, end);

    canvasAnimate.resetBoxAnimate();

    for (let i = 0; i < enemys.length; i++) {
        let enemy = enemys[i];
        ui.strokeRect(22, 62 * i + 22, 42, 42, LIGHT_GRAY, 2);

        // 怪物
        canvasAnimate.pushBoxAnimateObj(
            22, 62 * i + 22, 42, 42,
            27, 62 * i + 27, imageMgr.getEnemyImages(enemy.id!)
        );

        ui.setTextAlign('center');

        if (!isset(enemy.special)) {
            ui.fillText(enemy.name, 115, 62 * i + 47, LIGHT_GRAY, 'bold 17px Verdana');
        }
        else {
            ui.fillText(enemy.name, 115, 62 * i + 40, LIGHT_GRAY, 'bold 17px Verdana');
            ui.fillText(enemy.special, 115, 62 * i + 62, '#FF6A6A', 'bold 15px Verdana');
        }

        ui.setTextAlign('left');
        ui.fillText(i18next.t('hp'), 165, 62 * i + BLOCK_WIDTH, LIGHT_GRAY, '13px Verdana');
        ui.fillText(enemy.hp, 195, 62 * i + BLOCK_WIDTH, LIGHT_GRAY, 'bold 13px Verdana');
        ui.fillText(i18next.t('attack'), 255, 62 * i + BLOCK_WIDTH, LIGHT_GRAY, '13px Verdana');
        ui.fillText(enemy.attack, 285, 62 * i + BLOCK_WIDTH, LIGHT_GRAY, 'bold 13px Verdana');
        ui.fillText(i18next.t('defense'), 335, 62 * i + BLOCK_WIDTH, LIGHT_GRAY, '13px Verdana');
        ui.fillText(enemy.defense, 365, 62 * i + BLOCK_WIDTH, LIGHT_GRAY, 'bold 13px Verdana');

        let expOffset = 165;
        ui.fillText(i18next.t('money'), 165, 62 * i + 50, LIGHT_GRAY, '13px Verdana');
        ui.fillText(enemy.money, 195, 62 * i + 50, LIGHT_GRAY, 'bold 13px Verdana');
        expOffset = 255;

        ui.setTextAlign('left');
        ui.fillText(i18next.t('exp'), expOffset, 62 * i + 50, LIGHT_GRAY, '13px Verdana');
        ui.fillText(enemy.experience, expOffset + 30, 62 * i + 50, LIGHT_GRAY, 'bold 13px Verdana');

        let damageOffet = 361;

        ui.setTextAlign('center');
        let damageNum = enemy.damage!;
        let damageStr = damageNum.toString();
        let color = YELLOW;
        if (damageNum >= playerMgr.getPlayerHP())
            color = RED;
        if (damageNum <= 0)
            color = GREEN;
        if (damageNum >= MAX)
            damageStr = i18next.t('try_beat_failed');

        ui.fillText(damageStr, damageOffet, 62 * i + 50, color, 'bold 13px Verdana');

        ui.setTextAlign('left');

        if (index == start + i) {
            ui.strokeRect(10, 62 * i + 13, INIT_CANVAS_WIDTH - 10 * 2, 62, GOLD);
        }

    }
    canvasAnimate.drawBoxAnimate();
    drawPagination(page, totalPage);
}

// 绘制怪物属性的详细信息
export function drawBookDetail(index: number) {
    let enemys = enemiesMgr.getCurrentEnemys(core.getEventDataSelection());
    if (enemys.length == 0) {
        return;
    }

    index = Math.max(index, 0);
    index = Math.min(index, enemys.length - 1);

    let enemy = enemys[index];
    let enemyId = enemy.id!;
    let hints: string[] = enemiesMgr.getSpecialHint(enemiesMgr.getEnemyByID(enemyId)) as string[];

    if (hints.length == 0) {
        canvas.drawTip(i18next.t('no_special'));
        return;
    }

    let content = hints.join("\n");

    core.setEventId('encyclopedia-detail');
    canvas.clearTipAnimate();

    data.clearRect();
    data.setOpacity(1);

    let left = 10;
    let right = INIT_CANVAS_WIDTH - 2 * left;
    let content_left = left + 25;

    let validWidth = right - (content_left - left) - 13;
    let contents = TextBoxResolver.setFontAndGetSplitLines("data", content, validWidth, '16px Verdana');

    let height = INIT_CANVAS_WIDTH - 10 - Math.min(416 - 24 * (contents.length + 1) - 65, 250);
    let top = (INIT_CANVAS_WIDTH - height) / 2, bottom = height;

    data.setAlpha(0.9);
    data.fillRect(left, top, right, bottom, BLACK);
    data.setAlpha(1);
    data.strokeRect(left - 1, top - 1, right + 1, bottom + 1, WHITE, 2);

    data.setTextAlign('left');

    data.fillText(enemy.name, content_left, top + 30, GOLD, 'bold 22px Verdana');
    let content_top = top + 57;

    for (let i = 0; i < contents.length; i++) {
        let text = contents[i];
        let index = text.indexOf("：");
        if (index >= 0) {
            let x1 = text.substring(0, index + 1);
            data.fillText(x1, content_left, content_top, YELLOW, 'bold 16px Verdana');
            let len = data.measureTextWidth(x1);
            data.fillText(text.substring(index + 1), content_left + len, content_top, WHITE, '16px Verdana');
        }
        else {
            data.fillText(contents[i], content_left, content_top, WHITE, '16px Verdana');
        }
        content_top += 24;
    }

    data.fillText(`<${i18next.t('click_anywhere_to_continue')}>`, 270, top + height - 13, LIGHT_GRAY, '13px Verdana');
}


// 缩略图绘制
export function drawThumbnail(floorId: number, canvasId: string, blocks: Block[], x: number, y: number, size: number, playerLoc?: PlayerLocation) {
    let c = getCanvasContext(canvasId);
    c.clearRect(x, y, size, size);
    const floor = getFloorById(floorId)!;
    let groundId = isset(floor.defaultGround) ? floor.defaultGround : "ground";
    let blockImage = imageMgr.getGround(groundId);

    let persize = size / CANVAS_BLOCK_WIDTH_CNT;
    for (let i = 0; i < CANVAS_BLOCK_WIDTH_CNT; i++) {
        for (let j = 0; j < CANVAS_BLOCK_WIDTH_CNT; j++) {
            c.drawImage(blockImage, 0, 0, BLOCK_WIDTH, BLOCK_WIDTH, x + i * persize, y + j * persize, persize, persize);
        }
    }

    let mapArray = blocksToNumberArray(blocks);
    for (let i = 0; i < blocks.length; i++) {
        let block: Block = blocks[i];
        if (isset(block.event) && !(isset(block.enable) && !(block.enable!))) {
            if (core.getEventId() != 'normalBlock') {
                let blockImage = imageMgr.get(block.event!.type, block.event!.id);
                c.drawImage(blockImage, 0, 0, BLOCK_WIDTH, BLOCK_WIDTH, x + block.x * persize, y + block.y * persize, persize, persize);
            }
        }
    }

    if (isset(playerLoc)) {
        let height = playerMgr.getPlayerIconHeight();
        let realHeight = persize * height / BLOCK_WIDTH;
        c.drawImage(imageMgr.getPlayer(), getPlayerIconStillOfDirection(playerLoc!.direction) * BLOCK_WIDTH, getPlayerIconLineOfDirection(playerLoc!.direction) * height, BLOCK_WIDTH, height, x + persize * playerLoc!.x, y + persize * playerLoc!.y + persize - realHeight, persize, realHeight);
    }
}

export function drawTransport(page: number) {
    console.log('draw transport', page);
    page = Math.max(page, 0);
    page = Math.min(page, playerMgr.getPlayerTransportEnabledRange().length - 1);
    core.updateEventData('page', page);

    let floorId = playerMgr.getPlayerTransportEnabledRange()[page];
    let mapData = getMapData(floorId);
    let title = i18next.t(mapData.title);

    ui.clearRect();
    ui.setAlpha(0.85);
    ui.setFillStyle(BLACK);
    ui.fillRect();
    ui.setAlpha(1);
    ui.setTextAlign('center');
    ui.fillText(i18next.t('transport_floor'), 208, 60, WHITE, "bold 28px Verdana");
    ui.fillText(i18next.t('return'), 208, 403, WHITE, "bold 15px Verdana")
    ui.fillText(title, 356, 247, WHITE, "bold 19px Verdana");
    if (page < playerMgr.getPlayerTransportEnabledRange().length - 1)
        ui.fillText('▲', 356, 247 - 64, WHITE, "17px Verdana");
    if (page > 0)
        ui.fillText('▼', 356, 247 + 64, WHITE, "17px Verdana");
    ui.strokeRect(20, 100, 273, 273, WHITE, 2);

    drawThumbnail(floorId, 'ui', mapData.blocks, 20, 100, 273);
}

export function drawSLPanel(index: number = 1) {
    console.log('draw sl panel', index);
    console.log('draw sl panel event', core.getEvent());

    let page = toInt(index! / 10);
    let offset = index! % 10;
    if (page >= 10)
        page = 9;
    if (offset > 5)
        offset = 5;
    index = 10 * page + offset;

    core.updateEventData('index', index);

    ui.clearRect();
    ui.setAlpha(0.85);
    ui.setFillStyle(BLACK);
    ui.fillRect();
    ui.setAlpha(1);
    ui.setTextAlign('center');

    let u = INIT_CANVAS_WIDTH / 6;
    let size = 117;

    let name = core.getEventId() == 'save' ? i18next.t('save') : i18next.t('load');
    for (let i = 0; i < 6; i++) {
        let id = 5 * page + i;
        let data = getLocalStorage(i == 0 ? "autoSave" : "save" + id) as SLData;
        console.log('sl data id', data)
        if (i < 3) {
            ui.fillText(i == 0 ? "自动存档" : name + id, (2 * i + 1) * u, 35, WHITE, "bold 17px Verdana");
            ui.strokeRect((2 * i + 1) * u - size / 2, 50, size, size, i == offset ? '#FFD700' : WHITE, i == offset ? 6 : 2);
            if (isset(data) && isset(data.floorId)) {
                drawThumbnail(data.floorId, 'ui', loadMap(data.maps, data.floorId).blocks, (2 * i + 1) * u - size / 2, 50, size, data.playerData.loc);
                ui.fillText(formatDate(new Date(data.time)), (2 * i + 1) * u, 65 + size, WHITE, '10px Verdana');
            }
            else {
                ui.fillRect((2 * i + 1) * u - size / 2, 50, size, size, '#333333');
                ui.fillText(i18next.t('empty'), (2 * i + 1) * u, 117, WHITE, 'bold 30px Verdana');
            }
        }
        else {
            ui.fillText(name + id, (2 * i - 5) * u, 230, WHITE, "bold 17px Verdana");
            ui.strokeRect((2 * i - 5) * u - size / 2, 245, size, size, i == offset ? '#FFD700' : WHITE, i == offset ? 6 : 2);
            if (isset(data) && isset(data.floorId)) {
                drawThumbnail(data.floorId, 'ui', loadMap(data.maps, data.floorId).blocks, (2 * i - 5) * u - size / 2, 245, size, data.playerData.loc);
                ui.fillText(formatDate(new Date(data.time)), (2 * i - 5) * u, 260 + size, WHITE, '10px Verdana');
            }
            else {
                ui.fillRect((2 * i - 5) * u - size / 2, 245, size, size, '#333333');
                ui.fillText(i18next.t('empty'), (2 * i - 5) * u, 245 + 70, WHITE, 'bold 30px Verdana');
            }
        }
    }
    drawPagination(page + 1, 30);

}

export function drawQuickShop() {
    core.setEventId('selectShop');

    let keys = shopMgr.getShopIds();

    let choices = [];
    for (let i = 0; i < keys.length; i++) {
        choices.push(shopMgr.getShopById(keys[i]).textInFastList);
    }
    choices.push(i18next.t('return'));
    canvas.drawChoices(undefined, choices);
}


export function drawSettings() {
    core.setEventId('settings');
    canvas.drawChoices(undefined, [
        "系统设置", "快捷商店", "浏览地图", "同步存档", "重新开始", "数据统计", "操作帮助", "关于本塔", "返回游戏"
    ]);
}

export function drawSwitchs() {
    core.setEventId('switchs');

    let choices = [
        "背景音效：" + (config.soundEnabled ? "[ON]" : "[OFF]"),
        "战斗动画： " + (config.showBattleAnimate ? "[ON]" : "[OFF]"),
        "怪物显伤： " + (config.displayEnemyDamage ? "[ON]" : "[OFF]"),
        "领域显伤： " + (config.displayExtraDamage ? "[ON]" : "[OFF]"),
        "返回主菜单"
    ];
    canvas.drawChoices(undefined, choices);
}


export function drawHelp() {
    canvas.drawText([
        "\t[键盘快捷键列表]" +
        "[CTRL] 跳过对话\n" +
        "[X] 打开/关闭怪物手册\n" +
        "[G] 打开/关闭楼层传送器\n" +
        "[A] 读取自动存档（回退）\n" +
        "[S/D] 打开/关闭存/读档页面\n" +
        "[K] 打开/关闭快捷商店选择列表\n" +
        "[T] 打开/关闭工具栏\n" +
        "[ESC] 打开/关闭系统菜单\n" +
        "[E] 显示光标\n" +
        "[H] 打开帮助页面\n" +
        "\t[鼠标操作]" +
        "点状态栏中图标： 进行对应的操作\n" +
        "点任意块： 寻路并移动\n" +
        "点任意块并拖动： 指定寻路路线\n" +
        "单击勇士： 转向\n" +
        "双击勇士： 轻按（仅在轻按开关打开时有效）\n"
    ]);
}

export function drawAbout() {
    console.log('draw about');

    if (!core.isStarted()) {
        core.resetEvent();
        hideDomNode('menuBox');
    }

    core.lock();

    core.setEventId('about');

    ui.clearRect();
    let left = 48, top = 36, right = INIT_CANVAS_WIDTH - 2 * left, bottom = INIT_CANVAS_WIDTH - 2 * top;

    ui.setAlpha(0.85);
    ui.fillRect(left, top, right, bottom, BLACK);
    ui.setAlpha(1);
    ui.strokeRect(left - 1, top - 1, right + 1, bottom + 1, WHITE, 2);

    let text_start = left + 24;

    ui.setTextAlign('left');
    ui.fillText("致可尼：祝你玩得开心！", text_start, top + 35, GOLD, "bold 22px Verdana");
    ui.fillText("版本" + staticConfig.gameVersion, text_start, top + 80, WHITE, "bold 17px Verdana");
    ui.fillText("灵感来源于魔塔", text_start, top + 112, WHITE, "bold 17px Verdana");
}


export function drawOpenEncyclopedia(needCheckStatus: boolean = false) {
    const eventId = core.getEventId();
    console.log('open encyclopedia', eventId);

    if (eventId == 'encyclopedia' && core.hasEventDataSelection()) {
        canvasAnimate.resetBoxAnimate()
        canvas.drawMaps(core.getEventDataSelection());
        return;
    }

    if (eventId == 'viewMaps') {
        needCheckStatus = false;
        core.setEventDataSelection(core.getEventData('index'));
    }

    if (!playerMgr.checkStatusSatisfiedAndSetEventId('encyclopedia', needCheckStatus, true)) {
        return;
    }

    itemMgr.useItem('encyclopedia');
}


export function drawCursor() {
    if (!isset(autoRoute.getCursorX()))
        autoRoute.setCursorX(playerMgr.getPlayerLocX());

    if (autoRoute.getCursorX()! < 0)
        autoRoute.setCursorX(0);

    if (autoRoute.getCursorX()! >= CANVAS_BLOCK_WIDTH_CNT)
        autoRoute.setCursorX(CANVAS_BLOCK_WIDTH_CNT - 1);

    if (!isset(autoRoute.getCursorY()))
        autoRoute.setCursorY(playerMgr.getPlayerLocY());

    if (autoRoute.getCursorY()! < 0)
        autoRoute.setCursorY(0);

    if (autoRoute.getCursorY()! >= CANVAS_BLOCK_WIDTH_CNT)
        autoRoute.setCursorY(CANVAS_BLOCK_WIDTH_CNT - 1);

    core.setEventId('cursor');

    core.lock();

    ui.clearRect();
    ui.setAlpha(1);

    const width = 4;
    ui.strokeRect(BLOCK_WIDTH * autoRoute.getCursorX()! + width / 2, BLOCK_WIDTH * autoRoute.getCursorY()! + width / 2,
        BLOCK_WIDTH - width, BLOCK_WIDTH - width, GOLD, width);
}


export function drawToolbox(index?: number) {

    let tools = Object.keys(playerMgr.getPlayerTools()).sort();
    let constants = Object.keys(playerMgr.getPlayerConstants()).sort();

    if (!isset(index)) {
        if (tools.length > 0)
            index = 0;
        else if (constants.length > 0)
            index = 100;
        else
            index = 0;
    }

    core.updateEventData('selection', index);

    let selectId = undefined;
    if (index! < 100)
        selectId = tools[index!];
    else
        selectId = constants[index! - 100];

    if (!playerMgr.hasItem(selectId))
        selectId = undefined;

    core.updateEventData('id', selectId);

    const ui = getCanvasContext('ui');
    ui.clearRect();
    ui.setAlpha(0.85);
    ui.setFillStyle(BLACK);
    ui.fillRect();
    ui.setAlpha(1);
    ui.setFillStyle(LIGHT_GRAY);
    ui.setStrokeStyle(LIGHT_GRAY);
    ui.setLineWidth(2);

    // 画线
    ui.beginPath();
    ui.moveTo(0, 130);
    ui.lineTo(INIT_CANVAS_WIDTH, 130);
    ui.stroke();
    ui.beginPath();
    ui.moveTo(0, 129);
    ui.lineTo(0, 105);
    ui.lineTo(72, 105);
    ui.lineTo(102, 129);
    ui.fill();

    ui.beginPath();
    ui.moveTo(0, 290);
    ui.lineTo(INIT_CANVAS_WIDTH, 290);
    ui.stroke();
    ui.beginPath();
    ui.moveTo(0, 289);
    ui.lineTo(0, 265);
    ui.lineTo(72, 265);
    ui.lineTo(102, 289);
    ui.fill();

    // 文字
    ui.setTextAlign('left');
    ui.fillText("消耗道具", 5, 124, '#333333', "bold 16px Verdana");
    ui.fillText("永久道具", 5, 284);

    // 描述
    if (isset(selectId)) {
        let item = itemMgr.getItemByID(selectId!);
        ui.fillText(item.name, 10, BLOCK_WIDTH, '#FFD700', "bold 20px Verdana")
        ui.fillText(item.desc!, 10, 62, WHITE, '17px Verdana');
        ui.fillText('<点击道具使用>', 10, 89, '#CCCCCC', '14px Verdana');
    }

    ui.setTextAlign('right');
    for (let i = 0; i < tools.length; i++) {
        let tool = tools[i];
        let image = imageMgr.getItem(tool);
        if (i < 6) {
            ui.drawImage(image, 0, 0, BLOCK_WIDTH, BLOCK_WIDTH, BLOCK_WIDTH / 2 * (4 * i + 1) + 5, 144 + 5, BLOCK_WIDTH, BLOCK_WIDTH);
            ui.fillText(playerMgr.getItemCount(tool), BLOCK_WIDTH / 2 * (4 * i + 1) + 40, 144 + 38, WHITE, "bold 14px Verdana");
            if (selectId == tool)
                ui.strokeRect(BLOCK_WIDTH / 2 * (4 * i + 1) + 1, 144 + 1, 40, 40, GOLD);
        }
        else {
            ui.drawImage(image, 0, 0, BLOCK_WIDTH, BLOCK_WIDTH, BLOCK_WIDTH / 2 * (4 * (i - 6) + 1) + 5, 144 + 64 + 5, BLOCK_WIDTH, BLOCK_WIDTH);
            ui.fillText(playerMgr.getItemCount(tool), BLOCK_WIDTH / 2 * (4 * (i - 6) + 1) + 40, 144 + 64 + 38, WHITE, "bold 14px Verdana");
            if (selectId == tool)
                ui.strokeRect(BLOCK_WIDTH / 2 * (4 * (i - 6) + 1) + 1, 144 + 64 + 1, 40, 40, GOLD);

        }
    }

    for (let i = 0; i < constants.length; i++) {
        let constant = constants[i];
        let image = imageMgr.getItem(constant);
        if (i < 6) {
            ui.drawImage(image, 0, 0, BLOCK_WIDTH, BLOCK_WIDTH, BLOCK_WIDTH / 2 * (4 * i + 1) + 5, 304 + 5, BLOCK_WIDTH, BLOCK_WIDTH)
            if (selectId == constant)
                ui.strokeRect(BLOCK_WIDTH / 2 * (4 * i + 1) + 1, 304 + 1, 40, 40, GOLD);
        }
        else {
            ui.drawImage(image, 0, 0, BLOCK_WIDTH, BLOCK_WIDTH, BLOCK_WIDTH / 2 * (4 * (i - 6) + 1) + 5, 304 + 64 + 5, BLOCK_WIDTH, BLOCK_WIDTH)
            if (selectId == constant)
                ui.strokeRect(BLOCK_WIDTH / 2 * (4 * (i - 6) + 1) + 1, 304 + 64 + 1, 40, 40, GOLD);
        }
    }

    ui.setTextAlign('center');
    ui.fillText(i18next.t('remove_item'), 370, BLOCK_WIDTH, LIGHT_GRAY, 'bold 15px Verdana');
    ui.fillText(i18next.t('return'), 370, 403, LIGHT_GRAY, 'bold 15px Verdana');
}


export function drawBattleAnimate(enemyId: string, callback?: Function) {
    core.lock();

    if (!core.isEventSet()) {
        core.setEventId('battle');
    }

    let player_hp = playerMgr.getPlayerHP();
    let player_attack = playerMgr.getPlayerAttack();
    let player_defense = playerMgr.getPlayerDefense();

    const enemy = enemiesMgr.getEnemyByID(enemyId);
    let enemy_hp = enemy.hp;
    let enemy_attack = enemy.attack
    let enemy_defense = enemy.defense;
    let enemy_money = enemy.money;
    let enemy_exp = enemy.experience;
    let enemy_special = enemy.special;

    let initDamage = 0;

    // 吸血 | Vampire
    if (enemiesMgr.isSpecialEnemy(enemy_special, 11)) {
        let vampireDamage = toInt(player_hp * enemy.suckBloodRate!);

        enemy_hp += vampireDamage;
        initDamage += vampireDamage;
    }

    // 模仿 | Mimic
    if (enemiesMgr.isSpecialEnemy(enemy_special, 10)) {
        enemy_attack = player_attack;
        enemy_defense = player_defense;
    }

    // 魔法攻击 | Magic Attack
    if (enemiesMgr.isSpecialEnemy(enemy_special, 2)) {
        player_defense = 0;
    }

    // 坚固 | Sturdy
    if (enemiesMgr.isSpecialEnemy(enemy_special, 3) && enemy_defense < player_attack) {
        enemy_defense = player_attack - 1;
    }

    // Actual battle
    let turn = 0; // Player's turn
    if (enemiesMgr.isSpecialEnemy(enemy_special, 1)) {
        turn = 1; // Enemy's turn
    }

    let turns = 2;
    if (enemiesMgr.isSpecialEnemy(enemy_special, 4)) {
        turns = 3;
    } else if (enemiesMgr.isSpecialEnemy(enemy_special, 5)) {
        turns = 4;
    } else if (enemiesMgr.isSpecialEnemy(enemy_special, 6)) {
        turns = 1 + (enemy.n || 4);
    }

    if (enemiesMgr.isSpecialEnemy(enemy_special, 7)) {
        initDamage += toInt(config.breakDefenseRate * player_defense);
    }


    let specialTexts = enemiesMgr.getSpecialText(enemyId);

    let bg = ui.createPattern(imageMgr.getGround());

    ui.clearRect();
    let left = 10;
    let right = INIT_CANVAS_WIDTH - 2 * left;

    let lines = 5;
    let lineHeight = 60;
    let height = lineHeight * lines + 50;
    let top = (INIT_CANVAS_WIDTH - height) / 2;
    let bottom = height;

    ui.setAlpha(0.85);
    ui.fillRect(left, top, right, bottom, BLACK);
    ui.setAlpha(1.0);
    ui.strokeRect(left - 1, top - 1, right + 1, bottom + 1, WHITE, 2);


    data.clearRect();
    canvas.clearTipAnimate()
    data.setAlpha(1.0);
    data.setOpacity(1);

    canvasAnimate.resetBoxAnimate();

    let margin = 35;
    let boxWidth = 40;

    // 方块
    let playerHeight = playerMgr.getPlayerIconHeight();
    ui.strokeRect(left + margin - 1, top + margin - 1, boxWidth + 2, playerHeight + boxWidth - BLOCK_WIDTH + 2, GOLD, 2);
    ui.strokeRect(left + right - margin - boxWidth - 1, top + margin - 1, boxWidth + 2, boxWidth + 2);

    // 名称
    ui.setTextAlign('center');
    ui.fillText(playerMgr.getPlayerName(), left + margin + boxWidth / 2, top + margin + playerHeight + 40, GOLD, 'bold 22px Verdana');
    ui.fillText(i18next.t('monster'), left + right - margin - boxWidth / 2, top + margin + BLOCK_WIDTH + 40);
    for (let i = 0, j = 0; i < specialTexts.length; i++) {
        if (specialTexts[i] != '') {
            ui.fillText(specialTexts[i], left + right - margin - boxWidth / 2, top + margin + BLOCK_WIDTH + 44 + 20 * (++j), RED, '15px Verdana');
        }
    }
    player_hp -= initDamage;
    if (player_hp <= 0) {
        player_hp = 0;
        eventManager.handleGameover('battle');
        return;
    }

    // 图标
    ui.clearRect(left + margin, top + margin, boxWidth, playerHeight + boxWidth - BLOCK_WIDTH);
    ui.fillRect(left + margin, top + margin, boxWidth, playerHeight + boxWidth - BLOCK_WIDTH, bg!);
    ui.drawImage(imageMgr.getPlayer(), getPlayerIconStillOfDirection('down') * BLOCK_WIDTH, getPlayerIconLineOfDirection('down') * playerHeight, BLOCK_WIDTH, playerHeight, left + margin + (boxWidth - BLOCK_WIDTH) / 2, top + margin + (boxWidth - BLOCK_WIDTH) / 2, BLOCK_WIDTH, playerHeight);

    // 怪物的
    canvasAnimate.resetBoxAnimate();
    canvasAnimate.pushBoxAnimateObj(
        left + right - margin - 40, top + margin, boxWidth, boxWidth,
        left + right - margin - 40 + (boxWidth - BLOCK_WIDTH) / 2, top + margin + (boxWidth - BLOCK_WIDTH) / 2, imageMgr.getEnemyImages(enemyId)
    );
    canvasAnimate.drawBoxAnimate();

    let lineWidth = 80;

    let left_start = left + margin + boxWidth + 10;
    let left_end = left_start + lineWidth;

    let right_end = left + right - margin - boxWidth - 10;
    let right_start = right_end - lineWidth;

    // 勇士线
    ui.setTextAlign('left')
    let textTop = top + margin + 10;
    ui.fillText(i18next.t('hp'), left_start, textTop, LIGHT_GRAY, '16px Verdana');
    ui.drawLine(left_start, textTop + 8, left_end, textTop + 8, WHITE, 2);
    data.setTextAlign('right');
    data.fillText(player_hp.toString(), left_end, textTop + 26, LIGHT_GRAY, 'bold 16px Verdana');

    textTop += lineHeight;
    ui.setTextAlign('left');
    ui.fillText(i18next.t('attack'), left_start, textTop, LIGHT_GRAY, '16px Verdana');
    ui.drawLine(left_start, textTop + 8, left_end, textTop + 8, WHITE, 2);
    ui.setTextAlign('right');
    ui.fillText(player_attack.toString(), left_end, textTop + 26, LIGHT_GRAY, 'bold 16px Verdana');

    textTop += lineHeight;
    ui.setTextAlign('left');
    ui.fillText(i18next.t('defense'), left_start, textTop, LIGHT_GRAY, '16px Verdana');
    ui.drawLine(left_start, textTop + 8, left_end, textTop + 8, WHITE, 2);
    ui.setTextAlign('right');
    ui.fillText(player_defense.toString(), left_end, textTop + 26, LIGHT_GRAY, 'bold 16px Verdana');

    // 怪物的线
    ui.setTextAlign('right');
    textTop = top + margin + 10;
    ui.fillText(i18next.t('hp'), right_end, textTop, LIGHT_GRAY, '16px Verdana');
    ui.drawLine(right_start, textTop + 8, right_end, textTop + 8, WHITE, 2);
    data.setTextAlign('left');
    data.fillText(enemy_hp.toString(), right_start, textTop + 26, LIGHT_GRAY, 'bold 16px Verdana');

    textTop += lineHeight;
    ui.setTextAlign('right');
    ui.fillText(i18next.t('attack'), right_end, textTop, LIGHT_GRAY, '16px Verdana');
    ui.drawLine(right_start, textTop + 8, right_end, textTop + 8, WHITE, 2);
    ui.setTextAlign('left');
    ui.fillText(enemy_attack.toString(), right_start, textTop + 26, LIGHT_GRAY, 'bold 16px Verdana');

    textTop += lineHeight;
    ui.setTextAlign('right');
    ui.fillText(i18next.t('defense'), right_end, textTop, LIGHT_GRAY, '16px Verdana');
    ui.drawLine(right_start, textTop + 8, right_end, textTop + 8, WHITE, 2);
    ui.setTextAlign('left');
    ui.fillText(enemy_defense.toString(), right_start, textTop + 26, LIGHT_GRAY, 'bold 16px Verdana');

    textTop += lineHeight;
    ui.setTextAlign('right');
    ui.fillText(i18next.t('money'), right_end, textTop, LIGHT_GRAY, '16px Verdana');
    ui.drawLine(right_start, textTop + 8, right_end, textTop + 8, WHITE, 2);
    ui.setTextAlign('left');
    ui.fillText(enemy_money.toString(), right_start, textTop + 26, LIGHT_GRAY, 'bold 16px Verdana');

    textTop += lineHeight;
    ui.setTextAlign('right');
    ui.fillText(i18next.t('exp'), right_end, textTop, LIGHT_GRAY, '16px Verdana');
    ui.drawLine(right_start, textTop + 8, right_end, textTop + 8, WHITE, 2);
    ui.setTextAlign('left');
    ui.fillText(enemy_exp.toString(), right_start, textTop + 26, LIGHT_GRAY, 'bold 16px Verdana');

    // VS
    ui.setTextAlign('left');
    ui.fillText("V", left_end + 8, INIT_CANVAS_WIDTH / 2 - 15, WHITE, "italic bold 40px Verdana");
    ui.setTextAlign('right');
    ui.fillText("S", right_start - 8, INIT_CANVAS_WIDTH / 2 + 15, WHITE, "italic bold 40px Verdana");


    let battleInterval = setInterval(() => {
        audioMgr.play('attack.ogg');

        if (turn == 0) {
            // 勇士攻击
            data.drawLine(left + right - margin - boxWidth + 6, top + margin + boxWidth - 6,
                left + right - margin - 6, top + margin + 6, RED, 4);
            setTimeout(() => {
                data.clearRect(left + right - margin - boxWidth, top + margin,
                    boxWidth, boxWidth);
            }, 250);

            if (player_attack - enemy_defense > 0)
                enemy_hp -= toInt(player_attack - enemy_defense);
            if (enemy_hp < 0) enemy_hp = 0;

            // 更新怪物伤害
            data.clearRect(right_start, top + margin + 10, lineWidth, 40);
            data.setTextAlign('left');
            data.fillText(enemy_hp.toString(), right_start, top + margin + 10 + 26, LIGHT_GRAY, 'bold 16px Verdana');

        }
        else {
            // 怪物攻击
            data.drawLine(left + margin + 6, top + margin + playerHeight + (boxWidth - BLOCK_WIDTH) - 6,
                left + margin + boxWidth - 6, top + margin + 6, RED, 4);
            setTimeout(() => {
                data.clearRect(left + margin, top + margin, boxWidth, playerHeight + boxWidth - BLOCK_WIDTH);
            }, 250);

            let per_damage = enemy_attack - player_defense;
            if (per_damage < 0) {
                per_damage = 0;
            }

            // 更新勇士数据
            data.clearRect(left_start, top + margin + 10, lineWidth, 40);
            data.setTextAlign('right');
            data.fillText(player_hp.toString(), left_end, top + margin + 10 + 26, LIGHT_GRAY, 'bold 16px Verdana');

        }

        turn++;
        if (turn >= turns)
            turn = 0;

        if (player_hp <= 0 || enemy_hp <= 0) {
            // 战斗结束
            clearInterval(battleInterval);
            canvasAnimate.resetBoxAnimate();
            ui.clearRect();
            ui.setAlpha(1.0);
            data.clearRect();
            if (core.getEventId() == 'battle') {
                core.unlock();
                core.resetEvent();
            }
            if (isset(callback))
                callback!();
            return;
        }

    }, 500);
}

export function drawTransporter(page: number) {
    console.log('draw Transporter', page);
    page = Math.max(page, 0);
    page = Math.min(page, playerMgr.getPlayerTransportEnabledRange().length - 1);
    core.updateEventData('page', page);

    let floorId = playerMgr.getPlayerTransportEnabledRange()[page];
    let mapData = getMapData(floorId);
    let title = i18next.t(mapData.title);

    const ui = getCanvasContext('ui');
    ui.clearRect();
    ui.setAlpha(0.85);
    ui.setFillStyle(BLACK);
    ui.fillRect();
    ui.setAlpha(1);
    ui.setTextAlign('center');
    ui.fillText(i18next.t('transport_floor'), 208, 60, WHITE, "bold 28px Verdana");
    ui.fillText(i18next.t('return'), 208, 403, WHITE, "bold 15px Verdana")
    ui.fillText(title, 356, 247, WHITE, "bold 19px Verdana");
    if (page < playerMgr.getPlayerTransportEnabledRange().length - 1)
        ui.fillText('▲', 356, 247 - 64, WHITE, "17px Verdana");
    if (page > 0)
        ui.fillText('▼', 356, 247 + 64, WHITE, "17px Verdana");
    ui.strokeRect(20, 100, 273, 273, WHITE, 2);

    drawThumbnail(floorId, 'ui', mapData.blocks, 20, 100, 273);
}

export function showBattleAnimateConfirm(callBack?: Function): void {
    console.log('showBattleAnimateConfirm', callBack);
    if (config.showBattleAnimateConfirm) {

        core.updateEventData('selection', config.showBattleAnimate ? 0 : 1);

        const toggleBattleAnimate = (isShow: boolean) => {
            console.log('showBattleAnimate', isShow);
            config.showBattleAnimate = isShow;
            setLocalStorage('battleAnimate', isShow);
            canvasAnimate.closeUIPanel();
            if (isset(callBack)) {
                callBack!();
            }
        };

        const show = () => toggleBattleAnimate(true);
        const hide = () => toggleBattleAnimate(false);

        canvas.drawConfirmBox(i18next.t('show_battle_animate_confirm'), show, hide);

    }
}


export function showSexChoose(callBack?: Function): void {
    console.log('showSexChoose', callBack);
    core.updateEventData('selection', 0);

    const toggleSexAnimate = (isMan: boolean) => {
        console.log('showSexChoose is man', isMan);
        playerMgr.setPlayerIsMan(isMan);
        setLocalStorage('isMan', isMan);
        canvasAnimate.closeUIPanel();
        if (isset(callBack)) {
            callBack!();
        }
    };

    const isMan = () => toggleSexAnimate(true);
    const isWoman = () => toggleSexAnimate(false);

    canvas.drawConfirmBox(i18next.t('show_sex_confirm'), isMan, isWoman);
}