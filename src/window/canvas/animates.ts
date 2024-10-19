import { hideDomNode, setOpacity, showDomNode } from "../../common/client";
import { BLOCK_WIDTH, DIRECTION_TO_POINT_MAP, FPS, OPACITY_STEP } from "../../common/constants";
import { callertrace, isset, log } from "../../common/util";
import { animate, event, ui } from "./canvas";
import { core } from "../../common/global";
import { Block, getBlockAtPointOnFloor } from "../../floor/block";
import { removeBlock } from "./map";
import { imageMgr } from "../../resource/images";
import { playerMgr } from "../../player/data";
import statusBar from "../../window/statusBar";
import { animates, AnimateSingleFrame } from "../../resource/animates";
import { drawPlayer } from "./player";
import { config } from "../../common/config";

interface BlockAnimateFrame {
    x: number;
    y: number;

    index: number;
    line: number;
    images: HTMLImageElement[];
}

class MapsAnimateContext {
    twoAnimateObjs: BlockAnimateFrame[] = [];
    fourAnimateObjs: BlockAnimateFrame[] = [];
}

export interface RegionAnimateObj {
    bgx: number;
    bgy: number;
    bgheight: number;
    bgwidth: number;

    x: number
    y: number;

    status?: number;

    images: HTMLImageElement[];
    line: number;
};

class AnimateFrameContext {
    // 背景 | Background 
    background: string | CanvasGradient | CanvasPattern | null = null;
    // 地图动画 | Show map animate 
    showMap: boolean = false;
    // 两帧时间
    twoTime: number = 0;
    // 四帧时间
    fourTime: number = 0;
    // 区域时间 
    regionTime: number = 0;
    // 移动时间
    moveTime: number = 0;
    // 速度
    speed: number = 0;
}

class CanvasAnimateManager {
    private ctx: AnimateFrameContext = new AnimateFrameContext();
    private mapsAnimateCtx: MapsAnimateContext = new MapsAnimateContext();
    private regionAnimateObjs: RegionAnimateObj[] = [];
    private animateInterval: NodeJS.Timeout | undefined = undefined;
    private static instance: CanvasAnimateManager;

    constructor() {
        if (CanvasAnimateManager.instance) {
            throw new Error("Error: Instantiation failed: Use CanvasAnimateManager.getInstance() instead of new.");
        }
        CanvasAnimateManager.instance = this;
    }

    static getInstance() {
        if (!CanvasAnimateManager.instance) {
            CanvasAnimateManager.instance = new CanvasAnimateManager();
        }
        return CanvasAnimateManager.instance;
    }

    getCtx() {
        return this.ctx;
    }

    setCtxSpeed(speed: number) {
        this.ctx.speed = speed;
    }

    setCtxBackground(background: string | CanvasGradient | CanvasPattern | null) {
        this.ctx.background = background;
    }

    draw(name: string, x: number, y: number, callback?: Function) {

        console.log('canvasAnimate.draw:', name, x, y);
        const a = animates.get(name);
        // 清空animate层
        clearInterval(this.animateInterval);
        animate.clearRect();

        // 开始绘制
        const ratio = a.ratio;
        const centerX = BLOCK_WIDTH * x + 16, centerY = BLOCK_WIDTH * y + 16;
        let index = 0;

        let draw = (index: number) => {
            animate.clearRect();

            const frame = a.frames[index];
            frame.forEach((t: AnimateSingleFrame) => {
                const image = a.images[t.index] as HTMLImageElement;
                if (!isset(image)) {
                    return;
                }
                const realWidth = image!.width * ratio * t.zoom / 100;
                const realHeight = image!.height * ratio * t.zoom / 100;
                animate.setAlpha(t.opacity / 255);

                let cx = centerX + t.x, cy = centerY + t.y;

                if (!t.mirror && !t.angle) {
                    animate.drawCompleteImage(image!, cx - realWidth / 2, cy - realHeight / 2, realWidth, realHeight);
                }
                else {
                    animate.save();
                    animate.translate(cx, cy);
                    if (t.angle) {
                        animate.rotate(-t.angle * Math.PI / 180);
                    }

                    if (t.mirror) {
                        animate.scale(-1, 1);
                    }

                    animate.drawCompleteImage(image as HTMLImageElement, -realWidth / 2, -realHeight / 2, realWidth, realHeight);
                    animate.restore();
                }
            })
        }

        draw(index++);

        this.animateInterval = setInterval(() => {
            if (index == a.frames.length) {
                clearInterval(this.animateInterval);
                animate.clearRect();
                animate.setAlpha(1);
                if (isset(callback)) {
                    callback!();
                }
                return;
            }
            draw(index++);
        }, 50);
    }

    resetRegionAnimate() {
        this.regionAnimateObjs = [];
    }

    @log
    @callertrace
    pushRegionAnimateObj(bgx: number, bgy: number, bgheight: number, bgwidth: number, x: number, y: number, images: HTMLImageElement[], line: number = 0) {
        this.regionAnimateObjs.push({ bgx, bgy, bgheight, bgwidth, x, y, images, line });
    }

    removeMapAnimateBlock(x: number, y: number) {
        for (let i = 0; i < this.mapsAnimateCtx.twoAnimateObjs.length; i++) {
            if (this.mapsAnimateCtx.twoAnimateObjs[i].x == x * BLOCK_WIDTH && this.mapsAnimateCtx.twoAnimateObjs[i].y == y * BLOCK_WIDTH) {
                this.mapsAnimateCtx.twoAnimateObjs.splice(i, 1);
                return;
            }
        }
        for (let i = 0; i < this.mapsAnimateCtx.fourAnimateObjs.length; i++) {
            if (this.mapsAnimateCtx.fourAnimateObjs[i].x == x * BLOCK_WIDTH && this.mapsAnimateCtx.fourAnimateObjs[i].y == y * BLOCK_WIDTH) {
                this.mapsAnimateCtx.fourAnimateObjs.splice(i, 1);
                return;
            }
        }
    }


    resetMapsAnimate() {
        this.mapsAnimateCtx.twoAnimateObjs = [];
        this.mapsAnimateCtx.fourAnimateObjs = [];
    }

    pushMapsAnimateObj(frameCnt: number, x: number, y: number, images: HTMLImageElement[], line: number = 0) {
        const animateObj: BlockAnimateFrame = { x, y, index: 0, line, images };
        if (frameCnt === 2) {
            this.mapsAnimateCtx.twoAnimateObjs.push(animateObj);
            return;
        }
        if (frameCnt === 4) {
            this.mapsAnimateCtx.fourAnimateObjs.push(animateObj);
        }
    }


    syncMapsAnimate() {
        const resetObjIdx = (obj: BlockAnimateFrame) => {
            obj.index = 0;
        };
        this.mapsAnimateCtx.twoAnimateObjs.forEach(resetObjIdx);
        this.mapsAnimateCtx.fourAnimateObjs.forEach(resetObjIdx);
    }

    enableMapsAnimate(speed: number) {
        this.syncMapsAnimate();
        this.ctx.speed = speed;
        this.ctx.showMap = true;
    }

    showDomAsAnimate(element: string, timemills?: number, callback?: Function) {
        if (!isset(timemills)) {
            showDomNode(element);
            return;
        }

        showDomNode(element);
        setOpacity(element, 0);

        let opac = 0;
        const interval = setInterval(() => {
            opac += OPACITY_STEP;
            setOpacity(element, opac);
            if (opac > 1) {
                clearInterval(interval);
                if (callback) {
                    callback();
                }
            }
        }, timemills);
    }

    hideDomAsAnimate(element: string, timemills?: number, callback?: Function) {
        if (!isset(timemills)) {
            hideDomNode(element);
            return;
        }

        hideDomNode(element);
        setOpacity(element, 1);

        let opac = 1;
        const interval = setInterval(() => {
            opac -= OPACITY_STEP;
            setOpacity(element, opac);
            if (opac < 0) {
                clearInterval(interval);
                if (callback) {
                    callback();
                }
            }
        }, timemills);
    }

    @log
    @callertrace
    closeUIPanel() {
        this.regionAnimateObjs = [];
        ui.clearRect();
        ui.setAlpha(1);
        core.unlock();
        core.resetEvent();
    }

    drawRegionAnimate() {
        for (let i = 0; i < this.regionAnimateObjs.length; i++) {
            let obj = this.regionAnimateObjs[i];
            obj.status = ((obj.status || 0) + 1) % 2;
            ui.clearRect(obj.bgx, obj.bgy, obj.bgheight, obj.bgwidth);
            ui.fillRect(obj.bgx, obj.bgy, obj.bgheight, obj.bgwidth, this.ctx.background!);
            // console.log('draw region animate image: ', obj.images, obj.status)
            ui.drawImage(obj.images[obj.status], 0, obj.line * BLOCK_WIDTH, BLOCK_WIDTH, BLOCK_WIDTH, obj.x, obj.y, BLOCK_WIDTH, BLOCK_WIDTH);
        }
    }


    moveBlockAnimate(x: number, y: number, steps: any[], timemills: number = 500, immediateHide: boolean, callback?: Function) {
        console.log('move block animate: ', x, y, steps, timemills, immediateHide);

        animate.save();
        animate.clearRect();

        const blockOpt: { index: number, block: Block } | null = getBlockAtPointOnFloor(x, y, playerMgr.getFloorId(), false);

        if (!isset(blockOpt)) {
            if (isset(callback)) {
                callback!();
            }
            return;
        }

        console.log('remove block', 'x:', x, ' y:', y);
        removeBlock(x, y);

        ui.clearRect();
        ui.setAlpha(1);

        const block = blockOpt!.block;
        console.log('block: ', block);
        const blockImages = imageMgr.getImages(block.event!.type, block.event!.id);

        let opac = 1;
        animate.setOpacity(opac);

        let moveSteps: string[] = [];
        steps.forEach((e) => {
            if (typeof e == 'string') {
                moveSteps.push(e);
            } else {
                if (!isset(e.value)) {
                    moveSteps.push(e.direction);
                } else {
                    for (let i = 0; i < e.value; i++) {
                        moveSteps.push(e.direction);
                    }
                }
            }
        });

        console.log('move steps: ', moveSteps);

        let nowX = BLOCK_WIDTH * x;
        let nowY = BLOCK_WIDTH * y;
        let step = 0;

        let animateFrameCount: number = block.event?.animateFrameCount || 1;
        let animateCurrent: number = 0;
        let animateTime: number = 0;

        let animateInterval = setInterval(() => {
            animateTime += timemills / FPS;
            if (animateTime >= this.ctx.speed * 2 / animateFrameCount) {
                animateCurrent++;
                animateTime = 0;
                if (animateCurrent >= animateFrameCount) {
                    animateCurrent = 0;
                }
            }

            // move finished, clear
            if (moveSteps.length == 0) {
                if (immediateHide) {
                    opac = 0;
                } else {
                    opac -= OPACITY_STEP * 2;
                }

                animate.setOpacity(opac);
                animate.clearRect(nowX, nowY, BLOCK_WIDTH, BLOCK_WIDTH);

                animate.drawImage(blockImages[animateCurrent], 0, 0, BLOCK_WIDTH, BLOCK_WIDTH, nowX, nowY, BLOCK_WIDTH, BLOCK_WIDTH);
                if (opac <= 0) {
                    clearInterval(animateInterval);
                    animate.restore();
                    animate.clearRect();
                    animate.setOpacity(1);
                    if (isset(callback)) {
                        callback!();
                    }
                }
            } else {
                // still moving
                step++;
                nowX += DIRECTION_TO_POINT_MAP[moveSteps[0]].x * 2;
                nowY += DIRECTION_TO_POINT_MAP[moveSteps[0]].y * 2;
                animate.clearRect(nowX - BLOCK_WIDTH, nowY - BLOCK_WIDTH, BLOCK_WIDTH * 3, BLOCK_WIDTH * 3);

                animate.drawImage(blockImages[animateCurrent], 0, 0, BLOCK_WIDTH, BLOCK_WIDTH, nowX, nowY, BLOCK_WIDTH, BLOCK_WIDTH);
                if (step == BLOCK_WIDTH / 2) {
                    // move complete, continue
                    step = 0;
                    moveSteps.shift();
                }
            }
        }, timemills / FPS);
    }

    showBlockAnimate(x: number, y: number, floorId?: number) {
        floorId = floorId || playerMgr.getFloorId();
        const blockOpt = getBlockAtPointOnFloor(x, y, floorId, false);
        if (!isset(blockOpt)) {
            return;
        }

        const block: Block = blockOpt!.block;
        if (isset(block.enable) && !(block.enable)) {
            block.enable = true;
            if (floorId == playerMgr.getFloorId() && isset(block.event)) {
                const blkEvent = block.event!;
                const blockImages = imageMgr.getImages(blkEvent.type, blkEvent.id);
                if (blockImages.length > 0) {
                    event.drawImage(blockImages[0], 0, 0, BLOCK_WIDTH, BLOCK_WIDTH, BLOCK_WIDTH * block.x, BLOCK_WIDTH * block.y, BLOCK_WIDTH, BLOCK_WIDTH);
                    canvasAnimate.pushMapsAnimateObj(blkEvent.animateFrameCount!, block.x * BLOCK_WIDTH, block.y * BLOCK_WIDTH, blockImages, 0);
                    canvasAnimate.syncMapsAnimate();
                } else {
                    console.log('block image not found: ', blkEvent.type, blkEvent.id);
                }
            }
            statusBar.syncPlayerStatus();
        }
    }

    blockHideShowAnimate(loc: any, show: boolean = true, timemills: number = 500, callback?: Function) {
        animate.save();
        animate.clearRect();

        let locs: any[] = [];
        if (typeof loc[0] == 'number' && typeof loc[1] == 'number') {
            locs = [loc];
        } else {
            locs = loc;
        }

        let list: {
            x: number,
            y: number,
            blockIcon: number,
            blockImage: HTMLImageElement
        }[] = [];
        locs.forEach(loc => {
            let block = getBlockAtPointOnFloor(loc[0], loc[1], playerMgr.getFloorId(), false);
            if (!isset(block)) {
                return;
            }
            const blkEvent = block!.block.event!;
            list.push({
                x: loc[0],
                y: loc[1],
                blockIcon: 0,
                blockImage: imageMgr.get(blkEvent.type, blkEvent.id)
            });
        });

        if (list.length == 0) {
            if (isset(callback)) {
                callback!();
            }
        }

        let draw = () => {
            list.forEach(e => {
                animate.drawImage(e.blockImage, 0, e.blockIcon * BLOCK_WIDTH, BLOCK_WIDTH, BLOCK_WIDTH, BLOCK_WIDTH * e.x, BLOCK_WIDTH * e.y, BLOCK_WIDTH, BLOCK_WIDTH);
            });
        };

        let opac = show ? 0 : 1;
        setOpacity('animate', opac);
        draw();

        let animateInterval = setInterval(() => {
            if (show) {
                opac += OPACITY_STEP * 3;
            } else {
                opac -= OPACITY_STEP * 5;
            }

            animate.setOpacity(opac);
            animate.clearRect();

            draw();

            if (opac >= 1 || opac <= 0) {
                clearInterval(animateInterval);
                animate.restore();
                animate.restore();
                animate.setOpacity(1);

                if (isset(callback)) {
                    callback!();
                }
            }

        }, timemills / 10);
    }

    setRequestAnimationFrame() {
        console.log('set requestAnimationFrame');
        // 兼容不同浏览器的 requestAnimationFrame 和 cancelAnimationFrame
        (() => {
            let lastTime = 0;
            const vendors: string[] = ['webkit', 'moz'];
            for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                window.requestAnimationFrame = (window as any)[vendors[x] + 'RequestAnimationFrame'] as typeof window.requestAnimationFrame;
                window.cancelAnimationFrame = (window as any)[vendors[x] + 'CancelAnimationFrame'] || (window as any)[vendors[x] + 'CancelRequestAnimationFrame'] as typeof window.cancelAnimationFrame;
            }

            // 如果浏览器不支持 requestAnimationFrame，则使用 setTimeout 模拟
            if (!window.requestAnimationFrame) {
                window.requestAnimationFrame = (callback: FrameRequestCallback): number => {
                    const currTime = new Date().getTime();
                    const timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
                    const id = window.setTimeout(() => {
                        callback(currTime + timeToCall);
                    }, timeToCall);
                    lastTime = currTime + timeToCall;
                    return id;
                };
            }

            // 如果浏览器不支持 cancelAnimationFrame，则使用 clearTimeout 模拟
            if (!window.cancelAnimationFrame) {
                window.cancelAnimationFrame = (id: number) => {
                    clearTimeout(id);
                };
            }
        })();

        // 设置动画速度和背景图案
        this.setCtxSpeed(config.pngAnimateSpeed);

        const groundImg = imageMgr.getGround();
        this.setCtxBackground(ui.createPattern(groundImg, "repeat"));

        // 主绘制函数
        const draw = (timestamp: number) => {
            this.ctx.twoTime = this.ctx.twoTime || timestamp;
            this.ctx.fourTime = this.ctx.fourTime || timestamp;
            this.ctx.regionTime = this.ctx.regionTime || timestamp;
            this.ctx.moveTime = this.ctx.moveTime || timestamp;

            // 是全局动画
            if (this.ctx.showMap && core.isStarted()) {
                // 两帧动画
                if (timestamp - this.ctx.twoTime > this.ctx.speed && isset(this.mapsAnimateCtx.twoAnimateObjs)) {
                    this.mapsAnimateCtx.twoAnimateObjs.forEach((obj: BlockAnimateFrame) => {
                        obj.index = (obj.index + 1) % 2;
                        event.clearRect(obj.x, obj.y, BLOCK_WIDTH, BLOCK_WIDTH);
                        event.drawImage(obj.images[obj.index], 0, obj.line * BLOCK_WIDTH, BLOCK_WIDTH, BLOCK_WIDTH, obj.x, obj.y, BLOCK_WIDTH, BLOCK_WIDTH);
                    });
                    this.ctx.twoTime = timestamp;
                }

                // 四帧动画
                if (timestamp - this.ctx.fourTime > this.ctx.speed / 2 && isset(this.mapsAnimateCtx.fourAnimateObjs)) {
                    // console.log('fouranimateobjs drawe');
                    this.mapsAnimateCtx.fourAnimateObjs.forEach((obj: BlockAnimateFrame) => {
                        obj.index = (obj.index + 1) % 4;
                        event.clearRect(obj.x, obj.y, BLOCK_WIDTH, BLOCK_WIDTH);
                        // console.log('draw fou animate image', obj.images[obj.status].src);
                        event.drawImage(obj.images[obj.index], 0, obj.line * BLOCK_WIDTH, BLOCK_WIDTH, BLOCK_WIDTH, obj.x, obj.y, BLOCK_WIDTH, BLOCK_WIDTH);
                    });
                    this.ctx.fourTime = timestamp;
                }
            }

            // 盒子动画
            if (timestamp - this.ctx.regionTime > this.ctx.speed && isset(this.regionAnimateObjs) && this.regionAnimateObjs.length > 0) {
                this.drawRegionAnimate();
                this.ctx.regionTime = timestamp;
            }

            // 玩家移动动画
            if (timestamp - this.ctx.moveTime > 16 && core.getFlag('playerMovingStep', 0) > 0) {
                const x = playerMgr.getPlayerLocX(), y = playerMgr.getPlayerLocY(), direction = playerMgr.getPlayerLocDirection();
                let movingStep = core.getFlag('playerMovingStep');
                const offset = 4 * movingStep;
                if (movingStep <= 4) {
                    drawPlayer(direction, x, y, 'leftFoot', offset * DIRECTION_TO_POINT_MAP[direction].x, offset * DIRECTION_TO_POINT_MAP[direction].y);
                } else if (movingStep <= 8) {
                    drawPlayer(direction, x, y, 'rightFoot', offset * DIRECTION_TO_POINT_MAP[direction].x, offset * DIRECTION_TO_POINT_MAP[direction].y);
                }
                this.ctx.moveTime = timestamp;
            }

            // 请求下一帧动画
            window.requestAnimationFrame(draw);
        }

        // 启动动画循环
        window.requestAnimationFrame(draw);
    }

}

export let canvasAnimate: CanvasAnimateManager;

export function initCanvasAnimateManager() {
    canvasAnimate = CanvasAnimateManager.getInstance();
}