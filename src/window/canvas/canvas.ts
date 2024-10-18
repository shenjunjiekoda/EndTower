import { getDomNodesByClass } from "../../common/client";
import { BLACK, BLOCK_WIDTH, CANVAS_BLOCK_WIDTH_CNT, CHOICE_TEXT_FONT, CHOICEBOX_FONT, CONFIRMBOX_CONFIRM_TEXT_FONT, CONFIRMBOX_TEXT_FONT, DARK_GRAY, DEFAULT_INTERVAL_MILLS, DEFAULT_TEXT_FONT, DEFAULT_TIMEOUT_MILLS, GOLD, GRAY, INIT_CANVAS_WIDTH, ITEM_TIP_TIMEOUT_MILLS, OPACITY_STEP, TIP_FONT, WHITE } from "../../common/constants";
import { callertrace, isset, log } from "../../common/util";
import { getAllFloorIds, getFloorById, getMapData } from "../../floor/data";
import { getPlayerIconLineOfDirection, getPlayerIconStillOfDirection, imageMgr } from "../../resource/images";
import { canvasAnimate } from "./animates";
import { config } from "../../common/config";
import { playerMgr } from "../../player/data";
import { core } from "../../common/global";
import { eventManager } from "events/events";
import { TextBoxResolver } from "./textBox";
import { autoRoute } from "../../player/autoroute";
import { enemiesMgr } from "../../enemies/data";
import i18next from "i18next";
import { drawThumbnail } from "./functionality";

class GameCanvas {
    private internal: CanvasRenderingContext2D;
    constructor(internal: CanvasRenderingContext2D) {
        this.internal = internal;
    }

    // @callertrace
    // @log
    clearRect(x: number = 0, y: number = 0, width: number = INIT_CANVAS_WIDTH, height: number = INIT_CANVAS_WIDTH) {
        this.internal.clearRect(x, y, width, height);
    }

    @callertrace
    @log
    setAlpha(alpha: number) {
        this.internal.globalAlpha = alpha;
    }

    @callertrace
    @log
    fill(fillRule?: CanvasFillRule) {
        this.internal.fill(fillRule);
    }

    // @callertrace
    // @log
    fillRect(x: number = 0, y: number = 0, width: number = INIT_CANVAS_WIDTH, height: number = INIT_CANVAS_WIDTH, fillStyle?: string | CanvasGradient | CanvasPattern) {
        if (isset(fillStyle)) {
            this.setFillStyle(fillStyle!);
        }
        this.internal.fillRect(x, y, width, height);
    }

    @callertrace
    @log
    fillPoint(x: number, y: number, fillStyle?: string | CanvasGradient | CanvasPattern) {
        this.fillRect(x * BLOCK_WIDTH + 12, y * BLOCK_WIDTH + 12, 8, 8, fillStyle);
    }

    @callertrace
    @log
    drawLine(x1: number, y1: number, x2: number, y2: number, style?: string, lineWidth?: number) {
        if (isset(style)) {
            this.setStrokeStyle(style!);
        }
        if (isset(lineWidth)) {
            this.setLineWidth(lineWidth!);
        }

        this.beginPath();
        this.moveTo(x1, y1);
        this.lineTo(x2, y2);
        this.closePath();
        this.stroke();
    }

    @callertrace
    @log
    drawText(text: string | number, x: number, y: number, style?: string, font?: string) {
        if (typeof text === 'number') {
            text = text.toString();
        }
        if (isset(style)) {
            this.setFillStyle(style!);
        }
        if (isset(font)) {
            this.setFont(font!);
        }
        this.internal.fillText(text, x, y);
    }

    /**
     * Draws an image onto the canvas.
     * 
     * @param image The image to draw into the canvas.
     * @param sx The x-coordinate of the top-left corner of the sub-rectangle of the source image to draw.
     * @param sy The y-coordinate of the top-left corner of the sub-rectangle of the source image to draw.
     * @param sw The width of the sub-rectangle of the source image to draw.
     * @param sh The height of the sub-rectangle of the source image to draw.
     * @param dx The x-coordinate of the top-left corner of the destination rectangle where the source image is drawn.
     * @param dy The y-coordinate of the top-left corner of the destination rectangle where the source image is drawn.
     * @param dw The width of the destination rectangle where the source image is drawn.
     * @param dh The height of the destination rectangle where the source image is drawn.
     */
    // @callertrace
    // @log
    drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number) {
        // sx: number、sy: number: 源图像的起始坐标（x、y），表示要从图像的哪个位置开始绘制。
        // sw: number、sh: number: 源图像的宽度和高度，表示要从图像中裁剪的区域的大小。
        // dx: number、dy: number: 目标绘制位置的坐标（x、y），表示在画布上绘制图像的起始点。
        // dw: number、dh: number: 目标宽度和高度，用于调整图像在画布上显示的大小。
        this.internal.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
    }

    drawCompleteImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void {
        // dx: number、dy: number: 目标绘制位置的坐标（x、y），表示在画布上绘制图像的起始点。
        // dw: number、dh: number: 目标宽度和高度，用于调整图像在画布上显示的大小。
        // 等价于drawImage(image, 0, 0, image.width, image.height, dx, dy, dw, dh);
        this.internal.drawImage(image, dx, dy, dw, dh);
    }


    /**
     * create a pattern on a canvas using a specified image and repetition style.
     * 
     * @param image The image to use for the pattern.
     * @param repetition The repetition style of the pattern.
     * @returns A canvas pattern object or null if the repetition style is not supported.
    */
    @callertrace
    @log
    createPattern(image: CanvasImageSource, repetition: string = 'repeat'): CanvasPattern | null {
        return this.internal.createPattern(image, repetition);
    }

    @callertrace
    @log
    fillText(text: string | number, x: number, y: number, style?: string, font?: string) {
        if (typeof text === 'number') {
            text = text.toString();
        }
        if (isset(style)) {
            this.setFillStyle(style!);
        }
        if (isset(font)) {
            this.setFont(font!);
        }
        this.internal.fillText(text, x, y);
    }

    @log
    @callertrace
    setFillStyle(style: string | CanvasGradient | CanvasPattern) {
        this.internal.fillStyle = style;
    }

    setStrokeStyle(style: string | CanvasGradient | CanvasPattern) {
        this.internal.strokeStyle = style;
    }

    setFont(font: string) {
        this.internal.font = font;
    }

    setTextAlign(align: CanvasTextAlign) {
        this.internal.textAlign = align;
    }

    setOpacity(opacity: number | string) {
        this.internal.canvas.style.opacity = opacity.toString();
    }

    setLineWidth(lineWidth: number) {
        this.internal.lineWidth = lineWidth;
    }

    stroke() {
        this.internal.stroke();
    }

    strokeRect(x: number, y: number, width: number, height: number, style?: string, lineWidth?: number) {
        if (isset(style)) {
            this.setStrokeStyle(style!);
        }
        if (isset(lineWidth)) {
            this.setLineWidth(lineWidth!);
        }
        this.internal.strokeRect(x, y, width, height);
    }

    save() {
        this.internal.save();
    }

    restore() {
        this.internal.restore();
    }

    translate(x: number, y: number) {
        this.internal.translate(x, y);
    }

    rotate(angle: number) {
        this.internal.rotate(angle);
    }

    scale(x: number, y: number) {
        this.internal.scale(x, y);
    }

    beginPath() {
        this.internal.beginPath();
    }

    closePath() {
        this.internal.closePath();
    }

    moveTo(x: number, y: number) {
        this.internal.moveTo(x, y);
    }

    lineTo(x: number, y: number) {
        this.internal.lineTo(x, y);
    }

    measureTextWidth(text: string) {
        return this.internal.measureText(text).width;
    }

    drawStar(cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        let step = Math.PI / spikes;
        this.beginPath();
        this.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            this.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            this.lineTo(x, y);
            rot += step;
        }
        this.lineTo(cx, cy - outerRadius);
        this.closePath();
        this.fill();
    }
}

let canvasContexts: Record<string, GameCanvas> = {};

export let data: GameCanvas;
export let ui: GameCanvas;
export let player: GameCanvas;
export let damage: GameCanvas;
export let bg: GameCanvas;
export let event: GameCanvas;
export let animate: GameCanvas;


export function initCanvasContexts() {
    Array.from(getDomNodesByClass("gameCanvas")).forEach(c => {
        const id = c.id;
        const canvas = document.getElementById(id) as HTMLCanvasElement;
        canvasContexts[id] = new GameCanvas(canvas.getContext("2d")!);
    });

    data = canvasContexts['data'];
    ui = canvasContexts['ui'];
    player = canvasContexts['player'];
    damage = canvasContexts['damage'];
    bg = canvasContexts['bg'];
    event = canvasContexts['event'];
    animate = canvasContexts['animate'];
}

export function getCanvasContext(id: string): GameCanvas {
    return canvasContexts[id];
}


class CanvasManager {
    // 提示动画间隔 | Tip animate interval
    private tipAnimate: NodeJS.Timeout | undefined = undefined;
    // 开门动画间隔 | Open door animate interval
    private openDoorAnimate: NodeJS.Timeout | undefined = undefined;
    // 玩家移动间隔 | Player move interval
    private playerMoveInterval: NodeJS.Timeout | undefined = undefined;

    private static instance: CanvasManager;

    private constructor() {
        if (CanvasManager.instance) {
            throw new Error("Error: Instantiation failed: Use CanvasManager.getInstance() instead of new.");
        }
        CanvasManager.instance = this;
    }

    static getInstance(): CanvasManager {
        if (!CanvasManager.instance) {
            CanvasManager.instance = new CanvasManager();
        }
        return CanvasManager.instance;
    }

    clearAllCanvas() {
        Object.values(canvasContexts).forEach(c => c.clearRect());
    }

    clearPlayerMoveInterval() {
        clearInterval(this.playerMoveInterval);
    }

    issetPlayerMoveInterval() {
        return isset(this.playerMoveInterval);
    }

    setPlayerMoveInterval(playerMoveInterval?: NodeJS.Timeout) {
        this.playerMoveInterval = playerMoveInterval;
    }

    clearTipAnimate() {
        clearInterval(this.tipAnimate);
    }

    issetTipAnimate() {
        return isset(this.tipAnimate);
    }

    clearOpenDoorAnimate() {
        clearInterval(this.openDoorAnimate);
    }

    issetOpenDoorAnimate() {
        return isset(this.openDoorAnimate);
    }

    setTipAnimate(tipAnimate?: NodeJS.Timeout) {
        this.tipAnimate = tipAnimate;
    }

    setOpenDoorAnimate(openDoorAnimate?: NodeJS.Timeout) {
        this.openDoorAnimate = openDoorAnimate;
    }

    clearAllInterval() {
        this.clearTipAnimate();
        this.clearOpenDoorAnimate();
        this.clearPlayerMoveInterval();
    }

    @callertrace
    @log
    drawTip(tip: string, itemId?: string) {
        let opac = 0;
        this.clearTipAnimate();
        data.setFont(TIP_FONT);
        data.save();
        data.setOpacity(0);
        data.setTextAlign('left');

        let textX: number = 16;
        let textY: number = 30;

        let width: number = textX + data.measureTextWidth(tip) + 16;
        let height: number = 42;

        let topX = 5;
        let topY = 5;

        if (isset(itemId)) {
            textX += 28;
            textY += 4;
            width += 12;
        }

        let hide = false;
        let getItemTipTimeOut: NodeJS.Timeout | null = null;

        this.setTipAnimate(setInterval(() => {
            if (hide) {
                opac -= OPACITY_STEP;
            } else {
                opac += OPACITY_STEP;
            }
            data.setOpacity(opac);
            data.setFillStyle(BLACK);
            data.clearRect(topX, topY, INIT_CANVAS_WIDTH, height);
            data.fillRect(topX, topY, width, height);

            if (isset(itemId)) {
                data.drawImage(imageMgr.getItem(itemId!), 0, 0, BLOCK_WIDTH, BLOCK_WIDTH, 12, 12, BLOCK_WIDTH, BLOCK_WIDTH);
            }
            data.fillText(tip, textX, textY, "#FFF");

            if (opac > 1 || opac < 0) {
                if (hide) {
                    data.restore();
                    data.clearRect(topX, topY, INIT_CANVAS_WIDTH, height);
                    data.setOpacity(1);
                    clearInterval(this.tipAnimate);
                    return;
                }
                if (!isset(getItemTipTimeOut)) {
                    getItemTipTimeOut = setTimeout(() => {
                        hide = true;
                        getItemTipTimeOut = null;
                    }, ITEM_TIP_TIMEOUT_MILLS);
                    opac = 1;
                    data.setOpacity(opac);
                }
            }
        }, DEFAULT_INTERVAL_MILLS));
    }



    @log
    @callertrace
    drawTextBox(content: string): void {
        new TextBoxResolver(content).draw();
    }

    @callertrace
    @log
    drawMap(floorId: number, callback?: Function): void {

        const mapData = getMapData(floorId)!;
        const mapBlocks = mapData.blocks;

        playerMgr.setFloorId(floorId);

        this.clearAllCanvas();
        canvasAnimate.resetMapsAnimate();

        const groundId = getFloorById(floorId)!.defaultGround || "ground";
        const groundImage = imageMgr.getGround(groundId);

        for (let x = 0; x < CANVAS_BLOCK_WIDTH_CNT; x++) {
            for (let y = 0; y < CANVAS_BLOCK_WIDTH_CNT; y++) {
                bg.drawImage(groundImage, 0, 0, BLOCK_WIDTH, BLOCK_WIDTH, x * BLOCK_WIDTH, y * BLOCK_WIDTH, BLOCK_WIDTH, BLOCK_WIDTH);
            }
        }

        for (let i = 0; i < mapBlocks.length; i++) {
            const block = mapBlocks[i];
            // console.log('block', i, block);
            if (isset(block.event) && !(isset(block.enable) && !block.enable)) {
                const blkEvent = block.event!;
                if (isset(blkEvent.id)) {
                    const blockImages = imageMgr.getImages(blkEvent.type, blkEvent.id);
                    console.log('draw block images', blkEvent.type, blkEvent.id, blockImages);
                    console.log('draw block images src', blockImages[0].src);
                    event.drawImage(blockImages[0], 0, 0, BLOCK_WIDTH, BLOCK_WIDTH, block.x * BLOCK_WIDTH, block.y * BLOCK_WIDTH, BLOCK_WIDTH, BLOCK_WIDTH);
                    canvasAnimate.pushMapsAnimateObj(blkEvent.animateFrameCount!, block.x * BLOCK_WIDTH, block.y * BLOCK_WIDTH, blockImages);
                }
            }
        }

        canvasAnimate.enableMapsAnimate(config.pngAnimateSpeed);

        if (isset(callback)) {
            callback!();
        }
    }

    @callertrace
    @log
    drawText(text?: string | string[], callback?: Function) {
        if (isset(text)) {
            console.log('draw text: ', text, callback);
            if (core.isEventSet() && core.getEventId() == 'action') {
                eventManager.doOrInsertAction(text as string, undefined, undefined, callback);
                return;
            }

            let contents = typeof text === 'string' ? [text] : text as string[];
            console.log(contents);

            core.setEventId('text');
            core.setEventDataList(contents);
            if (isset(callback)) {
                core.setEventCallback(callback!);
            }

            core.lock();

            autoRoute.stop();

            setTimeout(() => {
                console.log('time out in drawText');
                this.drawText();
            }, DEFAULT_TIMEOUT_MILLS);
            return;
        }

        const eventDataListLen = core.getEventDataList().length;
        console.log('event data list length: ', eventDataListLen);

        if (eventDataListLen == 0) {
            console.log('text arg empty now');
            canvasAnimate.closeUIPanel();
            if (core.hasEventCallback()) {
                console.log('call callback for drawText');
                core.getEventCallback()();
            }
            return;
        }
        console.log('event id: ', core.getEventId());
        const content = core.shiftEventDataList();
        this.drawTextBox(content);
    }

    @log
    @callertrace
    drawChoices(content?: string, choices: any[] = []) {
        const background = ui.createPattern(imageMgr.getGround())!;

        ui.clearRect();
        ui.setAlpha(1);
        ui.setFillStyle(background);

        core.setEventDataUI({ text: content, choices });

        const length = choices.length;
        const left = 85;
        // 宽度
        const width = INIT_CANVAS_WIDTH - 2 * left;
        // 高度
        let height = BLOCK_WIDTH * (length + 2);
        let bottom = INIT_CANVAS_WIDTH / 2 + height / 2;
        if (length % 2 == 0) {
            bottom += 16;
        }
        const choice_top = bottom - height + 56;

        let id = null;
        let name = null;
        let images = null;

        let contents = null;
        let content_left = left + 15;

        if (isset(content)) {
            if (content!.indexOf("\t[") == 0) {
                const index = content!.indexOf("]");
                if (index >= 0) {
                    let str = content!.substring(2, index);
                    content = content!.substring(index + 1);
                    let ss = str.split(",");
                    if (ss.length == 1) {
                        id = ss[0];
                        if (id != 'player') {
                            const enemy = enemiesMgr.getEnemyByID(id);
                            if (isset(enemy)) {
                                name = enemy.name;
                                images = imageMgr.getEnemyImages(name);
                            }
                            else {
                                name = id;
                                id = 'npc';
                            }
                        }
                    }
                    else {
                        id = 'npc';
                        name = ss[0];
                        images = imageMgr.getNPCImages(ss[1]);
                    }
                }
            }

            console.log('eventManager', eventManager);
            content = eventManager.resolveText(content!);

            if (id == 'player' || isset(images)) {
                content_left = left + 60;
            }

            contents = TextBoxResolver.setFontAndGetSplitLines('ui', content, width - (content_left - left) - 10, CHOICE_TEXT_FONT);

            // content部分高度
            let cheight = 0;
            // 如果含有标题，标题高度
            if (isset(name)) {
                cheight += 25;
            }

            cheight += contents.length * 20;
            height += cheight;
        }
        let top = bottom - height;

        ui.fillRect(left, top, width, height, background);
        ui.strokeRect(left - 1, top - 1, width + 1, height + 1, WHITE, 2);

        // 如果有内容
        if (isset(contents)) {

            let content_top = top + 35;

            if (isset(id)) {
                ui.setTextAlign('center');

                content_top = top + 55;
                let title_offset = left + width / 2;
                if (id == 'player' || isset(images)) {
                    title_offset += 22;
                }

                if (id == 'player') {
                    let playerHeight = playerMgr.getPlayerIconHeight();
                    ui.strokeRect(left + BLOCK_WIDTH / 2 - 2, top + BLOCK_WIDTH - 3, BLOCK_WIDTH + 2, playerHeight + 2, DARK_GRAY, 2);
                    ui.fillText(playerMgr.getPlayerName(), title_offset, top + 27, '#FFD700', DEFAULT_TEXT_FONT);
                    ui.clearRect(left + BLOCK_WIDTH / 2 - 1, top + BLOCK_WIDTH - 2, BLOCK_WIDTH, playerHeight);
                    ui.fillRect(left + BLOCK_WIDTH / 2 - 1, top + BLOCK_WIDTH - 2, BLOCK_WIDTH, playerHeight, background);
                    const playerDownIconLine = getPlayerIconLineOfDirection('down');
                    const playerDownIconStill = getPlayerIconStillOfDirection('down');
                    ui.drawImage(imageMgr.getPlayer(), playerDownIconStill * BLOCK_WIDTH, playerDownIconLine * playerHeight, BLOCK_WIDTH, playerHeight, left + BLOCK_WIDTH / 2 - 1, top + BLOCK_WIDTH - 2, BLOCK_WIDTH, playerHeight);
                }
                else {
                    ui.fillText(name!, title_offset, top + 27, GOLD, DEFAULT_TEXT_FONT);
                    if (isset(images)) {
                        ui.strokeRect(left + BLOCK_WIDTH / 2 - 2, top + BLOCK_WIDTH - 3, BLOCK_WIDTH + 2, BLOCK_WIDTH + 2, DARK_GRAY, 2);
                        canvasAnimate.resetRegionAnimate();

                        canvasAnimate.pushRegionAnimateObj(
                            left + BLOCK_WIDTH / 2 - 1,
                            top + BLOCK_WIDTH - 2,
                            BLOCK_WIDTH,
                            BLOCK_WIDTH,
                            left + BLOCK_WIDTH / 2 - 1,
                            top + BLOCK_WIDTH - 2,
                            images!
                        );
                        canvasAnimate.drawRegionAnimate();
                    }
                }
            }

            ui.setTextAlign('left');
            for (let i = 0; i < contents!.length; i++) {
                ui.fillText(contents![i], content_left, content_top, WHITE, CHOICE_TEXT_FONT);
                content_top += 20;
            }
        }

        // 选项
        ui.setTextAlign('center');
        for (let i = 0; i < choices.length; i++) {
            let text = isset(choices[i].text) ? choices[i].text : choices[i];
            ui.fillText(eventManager.resolveText(text), INIT_CANVAS_WIDTH / 2, choice_top + BLOCK_WIDTH * i, WHITE, CHOICEBOX_FONT);
        }

        if (choices.length > 0) {
            if (!core.hasEventDataSelection() || core.getEventDataSelection() < 0) {
                core.setEventDataSelection(0);
            }
            const selection = core.getEventDataSelection();
            if (selection! >= choices.length) {
                core.setEventDataSelection(choices.length - 1);
            }
            const c = choices[selection];
            let text = isset(c.text) ? c.text : c;
            const len = ui.measureTextWidth(eventManager.resolveText(text));
            ui.strokeRect(INIT_CANVAS_WIDTH - len / 2 - 5, choice_top + BLOCK_WIDTH * selection - 20, len + 10, 28, GOLD, 2);
        }
    }

    drawMaps(floorId: number = playerMgr.getFloorId()) {
        floorId = Math.max(floorId!, 0);
        floorId = Math.min(floorId!, getAllFloorIds().length - 1);

        core.lock();
        core.setEventId('viewMaps');
        core.updateEventData('index', floorId);

        clearTimeout(this.tipAnimate);

        ui.clearRect();
        ui.setAlpha(1);
        drawThumbnail(floorId, 'ui', getMapData(floorId).blocks, 0, 0, 416);

        data.clearRect();
        data.setOpacity(0.2);

        data.setTextAlign('left');
        data.setFont('16px Arial');

        let text = i18next.t(getFloorById(floorId)!.title);

        let textX = 16
        let textY = 18;
        let width = textX + data.measureTextWidth(text) + 16;
        let height = 42;

        data.fillRect(5, 5, width, height, BLACK);
        data.setOpacity(0.5);
        data.fillText(text, textX + 5, textY + 15, WHITE);
    }

    @log
    @callertrace
    drawConfirmBox(text: string, yesCallback: Function, noCallback: Function, confirmText?: string, cancelText?: string) {
        console.log('core status event:', core.getEvent());

        core.lock();

        core.setEventId('confirmBox');
        core.setEventDataUI(text);
        core.updateEventData('yes', yesCallback);
        core.updateEventData('no', noCallback);

        console.log('core status event after update:', core.getEvent());
        if (!core.hasEventDataSelection() || core.getEventDataSelection() > 1) {
            core.setEventDataSelection(1)
        }
        if (core.getEventDataSelection()! < 0) {
            core.setEventDataSelection(0);
        }

        let bg = ui.createPattern(imageMgr.getGround(), 'repeat')!;
        ui.clearRect();
        ui.setAlpha(1);
        ui.setFillStyle(bg);
        ui.setFont(CONFIRMBOX_TEXT_FONT);

        console.log('text', text);
        const contents = text.split('\n');
        let lines = contents.length;
        let max_length = 0;
        for (let i = 0; i < contents.length; i++) {
            max_length = Math.max(max_length, ui.measureTextWidth(contents[i]));
        }

        const left = Math.min(INIT_CANVAS_WIDTH / 2 - 40 - max_length / 2, 100);
        const top = 140 - (lines - 1) * 30;
        const right = INIT_CANVAS_WIDTH - 2 * left;
        const bottom = INIT_CANVAS_WIDTH - 140 - top;

        if (core.isStarted()) {
            ui.fillRect(left, top, right, bottom, bg);
            ui.strokeRect(left - 1, top - 1, right + 1, bottom + 1, WHITE, 2);
        }

        ui.setTextAlign('center');

        for (let i = 0; i < contents.length; i++) {
            ui.fillText(contents[i], INIT_CANVAS_WIDTH / 2, top + 50 + i * 30, WHITE);
        }

        if (!isset(confirmText)) {
            confirmText = 'yes';
        }
        confirmText = i18next.t(confirmText!);

        if (!isset(cancelText)) {
            cancelText = 'no';
        }
        cancelText = i18next.t(cancelText!);

        ui.fillText(confirmText, INIT_CANVAS_WIDTH / 2 - 38, top + bottom - 35, WHITE, CONFIRMBOX_CONFIRM_TEXT_FONT);
        ui.fillText(cancelText, INIT_CANVAS_WIDTH / 2 + 38, top + bottom - 35);

        const len1 = ui.measureTextWidth(confirmText);
        const len2 = ui.measureTextWidth(cancelText);
        if (core.getEventDataSelection() == 0) {
            ui.strokeRect(INIT_CANVAS_WIDTH / 2 - 38 - len1 / 2 - 5, top + bottom - 35 - 20, len1 + 10, 28, GOLD, 2);
        }
        if (core.getEventDataSelection() == 1) {
            ui.strokeRect(INIT_CANVAS_WIDTH / 2 + 38 - len2 / 2 - 5, top + bottom - 35 - 20, len2 + 10, 28, GOLD, 2);
        }
    }

    fillPos(pos: { x: number, y: number }) {
        ui.fillRect(pos.x * BLOCK_WIDTH + 12, pos.y * BLOCK_WIDTH + 12, 8, 8, GRAY);
    }

}

export let canvas = CanvasManager.getInstance();