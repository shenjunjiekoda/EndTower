import { core } from "../common/global";
import { player, ui } from "../window/canvas/canvas";
import { isset, toInt } from "../common/util";
import { BLOCK_WIDTH, CANVAS_BLOCK_WIDTH_CNT, DIRECTION_TO_POINT_MAP, LIGHT_GREEN } from "../common/constants";
import { PlayerLocation, playerMgr } from "./data";
import { canMovePlayer, drawPlayer, movePlayer, pointNoPassExists } from "../window/canvas/player";
import { canMoveDirectly } from "../floor/data";
import { route } from "./route";
import { itemMgr } from "../items/data";
import { eventManager } from "../events/events";
import { getBlockAtPointOnFloor } from "../floor/block";
import { config } from "../common/config";
import { blockingCtx } from "../window/canvas/damage";

export interface RouteElem {
    direction: string;
    steps: number;
}

enum RouteDirection {
    UP = "up",
    DOWN = "down",
    LEFT = "left",
    RIGHT = "right",
    UNKNOWN = "unknown"
}

// 自动寻路相关 | auto-routing related
class AutoRoute {
    // 当前需要走的路线的第i步 | the i-th step of the current route to be taken
    private idx: number = 0;
    // 当前寻路路线 | the current route to be taken
    private routes: RouteElem[] = [];
    // 发生动作后剩余的路线 | the remaining route after taking an action
    private remainingRoutes: RouteElem[] = [];
    // 上次行走方向 | the last direction
    private lastDirection: string = RouteDirection.UNKNOWN;
    // 当前方向已经移动的步数 | the number of steps moved in the current direction
    private directionMovedSteps: number = 0;
    // 当前方向需要走的步数 | the number of steps to be taken in the current direction
    private directionDestSteps: number = 0;
    // 目标坐标 | the destination coordinate
    private destX: number = 0;
    private destY: number = 0;
    // 鼠标坐标 | the mouse coordinate
    private cursorX?: number = undefined;
    private cursorY?: number = undefined;
    // 当前是否在寻路
    private moveEnabled: boolean = false;
    // 当前是否可移动
    private canMove: boolean = false;
    // 事件后步进修正值 | Step post event
    private routePostEvent: { x: number, y: number }[] = [];

    private turnPlayerTimeout: NodeJS.Timeout | null = null;

    stop() {
        if (!core.isStarted()) {
            return;
        }
        ui.clearRect();

        this.idx = 0;
        this.directionMovedSteps = 0;
        this.directionDestSteps = 0;
        this.lastDirection = RouteDirection.UNKNOWN;
        this.routes = [];
        this.remainingRoutes = [];
        this.moveEnabled = false;
        playerMgr.setPlayerStop();
    }

    getDirectionMovedSteps() {
        return this.directionMovedSteps;
    }

    incDirectionMovedSteps() {
        this.directionMovedSteps++;
    }

    setDirectionMovedSteps(steps: number) {
        this.directionMovedSteps = steps;
    }

    getDirectionDestSteps() {
        return this.directionDestSteps;
    }

    setDirectionDestSteps(steps: number) {
        this.directionDestSteps = steps;
    }

    getLastDirection() {
        return this.lastDirection;
    }

    setLastDirection(direction: string) {
        this.lastDirection = direction;
    }

    getRoutes() {
        return this.routes;
    }

    getRoutesLength() {
        return this.routes.length;
    }

    setRoutes(routes: RouteElem[]) {
        this.routes = routes;
    }

    getRemainingRoutes() {
        return this.remainingRoutes;
    }

    getRemainingRoutesLength() {
        return this.remainingRoutes.length;
    }

    setRemainingRoutes(routes: RouteElem[]) {
        this.remainingRoutes = routes;
    }

    resetRoutePostEvent() {
        this.routePostEvent = [];
    }

    getRoutePostEvent() {
        return this.routePostEvent;
    }

    setRoutePostEvent(routePostEvent: { x: number, y: number }[]) {
        this.routePostEvent = routePostEvent;
    }

    getRoutePostEventLength() {
        return this.routePostEvent.length;
    }

    pushRoutePostEvent(x: number, y: number) {
        this.routePostEvent.push({ x, y });
    }

    clearRemainingRoutes() {
        ui.clearRect();

        this.remainingRoutes = [];
    }

    clearUINode(x: number, y: number) {
        if (!core.isEventSet()) {
            ui.clearRect(x * BLOCK_WIDTH + 5, y * BLOCK_WIDTH + 5, BLOCK_WIDTH - 5, BLOCK_WIDTH - 5);
        }
    }

    disableMove() {
        this.moveEnabled = false;
    }

    enableMove() {
        this.moveEnabled = true;
    }

    isMoveEnabled() {
        return this.moveEnabled;
    }

    completeRemaining() {
        if (this.remainingRoutes.length === 0 || (this.remainingRoutes.length === 1 && this.remainingRoutes[0].steps === 1)) {
            this.remainingRoutes = [];
        }
        else {
            this.setPlayerAutoMove(this.remainingRoutes);
        }
    }

    setPlayerAutoMove(routes: RouteElem[] = autoRoute.getRoutes()) {
        if (routes.length == 0) {
            return;
        }

        this.routes = routes;
        this.moveEnabled = true;
        this.directionMovedSteps = 1;
        this.directionDestSteps = routes[0].steps;
        movePlayer(routes[0].direction);
    }

    getCursorX() {
        return this.cursorX;
    }

    setCursorX(x: number) {
        this.cursorX = x;
    }
    getCursorY() {
        return this.cursorY;
    }

    setCursorY(y: number) {
        this.cursorY = y;
    }

    getDestX() {
        return this.destX;
    }

    setDestX(x: number) {
        this.destX = x;
    }

    getDestY() {
        return this.destY;
    }

    setDestY(y: number) {
        this.destY = y;
    }

    getIdx() {
        return this.idx;
    }

    setIdx(idx: number) {
        this.idx = idx;
    }

    incIdx() {
        this.idx++;
    }

    set(destX: number, destY: number, postRoute: PlayerLocation[]) {
        console.log("setAutoRoute", destX, destY, postRoute);
        if (!core.isStarted() || core.isLocked()) {
            console.log("setAutoRoute: locked or not started");
            return;
        }
        // 正在寻路中
        if (autoRoute.isMoveEnabled()) {
            console.log("setAutoRoute: already in auto route");
            let lastX = autoRoute.getDestX(), lastY = autoRoute.getDestY();
            autoRoute.stop();
            if (lastX == destX && lastY == destY) {
                autoRoute.setCanMove(true);
                setTimeout(() => {
                    if (autoRoute.isCanMove()) {
                        if (canMoveDirectly(destX, destY)) {
                            player.clearRect();
                            playerMgr.setPlayerLocX(destX);
                            playerMgr.setPlayerLocY(destY);
                            drawPlayer();
                            route.push("move:" + destX + ":" + destY);
                        }
                    }
                    autoRoute.setCanMove(false);
                }, 100);
            }
            return;
        }
        if (destX == playerMgr.getPlayerLocX() && destY == playerMgr.getPlayerLocY() && postRoute.length == 0) {
            if (!isset(this.turnPlayerTimeout)) {
                this.turnPlayerTimeout = setTimeout(() => {
                    eventManager.handleTurnPlayer();
                    clearTimeout(this.turnPlayerTimeout!);
                    this.turnPlayerTimeout = null;
                }, 250);
            }
            else {
                clearTimeout(this.turnPlayerTimeout!);
                this.turnPlayerTimeout = null;
                itemMgr.getNextItem();
            }
            return;
        }
        let steps = 0;
        let tempStep = null;
        let moveStep: {
            direction: string;
            x: number;
            y: number;
        }[] | undefined = undefined;


        if (!isset(moveStep = this.findAutoRoute(destX, destY))) {
            if (destX == playerMgr.getPlayerLocX() && destY == playerMgr.getPlayerLocY()) {
                moveStep = [];
            } else {
                ui.clearRect();
                return;
            }
        }
        moveStep = moveStep!.concat(postRoute);
        autoRoute.setDestX(destX);
        autoRoute.setDestY(destY);
        ui.save();
        ui.clearRect();
        ui.setFillStyle(LIGHT_GREEN);
        ui.setStrokeStyle(LIGHT_GREEN);
        ui.setLineWidth(4);

        for (let m = 0; m < moveStep.length; m++) {
            if (tempStep == null) {
                steps++;
                tempStep = moveStep[m].direction;
            }
            else if (tempStep == moveStep[m].direction) {
                steps++;
            }
            else {
                //core.status.automaticRoutingTemp.moveStep.push({'direction': tempStep, 'step': step});
                autoRoute.routes.push({ 'direction': tempStep, steps });
                steps = 1;
                tempStep = moveStep[m].direction;
            }
            if (m == moveStep.length - 1) {
                autoRoute.routes.push({ 'direction': tempStep, steps });
                ui.drawStar(moveStep[m].x * BLOCK_WIDTH + 16, moveStep[m].y * BLOCK_WIDTH + 16, 5, 12, 6);
            }
            else {
                ui.beginPath();
                if (isset(moveStep[m + 1]) && tempStep != moveStep[m + 1].direction) {
                    if (tempStep == 'up' && moveStep[m + 1].direction == 'left' || tempStep == 'right' && moveStep[m + 1].direction == 'down') {
                        ui.moveTo(moveStep[m].x * BLOCK_WIDTH + 5, moveStep[m].y * BLOCK_WIDTH + 16);
                        ui.lineTo(moveStep[m].x * BLOCK_WIDTH + 16, moveStep[m].y * BLOCK_WIDTH + 16);
                        ui.lineTo(moveStep[m].x * BLOCK_WIDTH + 16, moveStep[m].y * BLOCK_WIDTH + 27);
                    }
                    else if (tempStep == 'up' && moveStep[m + 1].direction == 'right' || tempStep == 'left' && moveStep[m + 1].direction == 'down') {
                        ui.moveTo(moveStep[m].x * BLOCK_WIDTH + 27, moveStep[m].y * BLOCK_WIDTH + 16);
                        ui.lineTo(moveStep[m].x * BLOCK_WIDTH + 16, moveStep[m].y * BLOCK_WIDTH + 16);
                        ui.lineTo(moveStep[m].x * BLOCK_WIDTH + 16, moveStep[m].y * BLOCK_WIDTH + 27);
                    }
                    else if (tempStep == 'left' && moveStep[m + 1].direction == 'up' || tempStep == 'down' && moveStep[m + 1].direction == 'right') {
                        ui.moveTo(moveStep[m].x * BLOCK_WIDTH + 27, moveStep[m].y * BLOCK_WIDTH + 16);
                        ui.lineTo(moveStep[m].x * BLOCK_WIDTH + 16, moveStep[m].y * BLOCK_WIDTH + 16);
                        ui.lineTo(moveStep[m].x * BLOCK_WIDTH + 16, moveStep[m].y * BLOCK_WIDTH + 5);
                    }
                    else if (tempStep == 'right' && moveStep[m + 1].direction == 'up' || tempStep == 'down' && moveStep[m + 1].direction == 'left') {
                        ui.moveTo(moveStep[m].x * BLOCK_WIDTH + 5, moveStep[m].y * BLOCK_WIDTH + 16);
                        ui.lineTo(moveStep[m].x * BLOCK_WIDTH + 16, moveStep[m].y * BLOCK_WIDTH + 16);
                        ui.lineTo(moveStep[m].x * BLOCK_WIDTH + 16, moveStep[m].y * BLOCK_WIDTH + 5);
                    }
                    ui.stroke();
                    continue;
                }
                switch (tempStep) {
                    case 'up':
                    case 'down':
                        ui.beginPath();
                        ui.moveTo(moveStep[m].x * BLOCK_WIDTH + 16, moveStep[m].y * BLOCK_WIDTH + 5);
                        ui.lineTo(moveStep[m].x * BLOCK_WIDTH + 16, moveStep[m].y * BLOCK_WIDTH + 27);
                        ui.stroke();
                        break;
                    case 'left':
                    case 'right':
                        ui.beginPath();
                        ui.moveTo(moveStep[m].x * BLOCK_WIDTH + 5, moveStep[m].y * BLOCK_WIDTH + 16);
                        ui.lineTo(moveStep[m].x * BLOCK_WIDTH + 27, moveStep[m].y * BLOCK_WIDTH + 16);
                        ui.stroke();
                        break;
                }
            }
        }
        ui.restore();

        // 开始移动
        this.setPlayerAutoMove();
    }

    findAutoRoute(destX: number, destY: number): PlayerLocation[] | undefined {
        let startX = playerMgr.getPlayerLocX();
        let startY = playerMgr.getPlayerLocY();
        let queue: number[] = [];
        let nowDeep = 0;
        let route = [];
        let ans: PlayerLocation[] = []

        if (destX == startX && destY == startY)
            return undefined;

        queue.push(CANVAS_BLOCK_WIDTH_CNT * startX + startY);
        queue.push(-1);
        route[CANVAS_BLOCK_WIDTH_CNT * startX + startY] = '';

        while (queue.length != 1) {
            let f = queue.shift()!;
            if (f === -1) { nowDeep += 1; queue.push(-1); continue; }
            let deep = ~~(f / (CANVAS_BLOCK_WIDTH_CNT * CANVAS_BLOCK_WIDTH_CNT));
            if (deep !== nowDeep) { queue.push(f); continue; }
            f = f % (CANVAS_BLOCK_WIDTH_CNT * CANVAS_BLOCK_WIDTH_CNT);
            let nowX = toInt(f / CANVAS_BLOCK_WIDTH_CNT), nowY = f % CANVAS_BLOCK_WIDTH_CNT;
            for (let direction in DIRECTION_TO_POINT_MAP) {
                if (!canMovePlayer(nowX, nowY, direction))
                    continue;

                let nx = nowX + DIRECTION_TO_POINT_MAP[direction].x;
                let ny = nowY + DIRECTION_TO_POINT_MAP[direction].y;

                if (nx < 0 || nx >= CANVAS_BLOCK_WIDTH_CNT || ny < 0 || ny >= CANVAS_BLOCK_WIDTH_CNT)
                    continue;

                let nid = CANVAS_BLOCK_WIDTH_CNT * nx + ny;

                if (isset(route[nid]))
                    continue;

                let deepAdd = 1;

                let nextId, nextBlock = getBlockAtPointOnFloor(nx, ny);
                if (isset(nextBlock)) {
                    nextId = nextBlock!.block.event!.id;
                    // 绕过亮灯（因为只有一次通行机会很宝贵）
                    if (nextId == "light") deepAdd = 100;
                    // 绕过路障
                    if (nextId.substring(nextId.length - 3) == "Net") {
                        deepAdd = config.lavaDamage;
                    }
                    // 绕过血瓶
                    if (nextId.substring(nextId.length - 6) == "Potion") {
                        deepAdd = 20;
                    }
                    // 绕过传送点
                    if (nextBlock!.block.event?.trigger == 'changeFloor') deepAdd = 10;
                }
                if (blockingCtx.damage[nid] > 0)
                    deepAdd = blockingCtx.damage[nid];

                if (nx == destX && ny == destY) {
                    route[nid] = direction;
                    break;
                }
                if (pointNoPassExists(nx, ny))
                    continue;

                route[nid] = direction;
                queue.push(CANVAS_BLOCK_WIDTH_CNT * CANVAS_BLOCK_WIDTH_CNT * (nowDeep + deepAdd) + nid);
            }
            if (isset(route[CANVAS_BLOCK_WIDTH_CNT * destX + destY])) break;
        }

        if (!isset(route[CANVAS_BLOCK_WIDTH_CNT * destX + destY])) {
            return undefined;
        }

        let nowX = destX, nowY = destY;
        while (nowX != startX || nowY != startY) {
            let dir = route[CANVAS_BLOCK_WIDTH_CNT * nowX + nowY];
            ans.push({ 'direction': dir, 'x': nowX, 'y': nowY });
            nowX -= DIRECTION_TO_POINT_MAP[dir].x;
            nowY -= DIRECTION_TO_POINT_MAP[dir].y;
        }

        ans.reverse();
        return ans;
    }


    setCanMove(canMove: boolean) {
        this.canMove = canMove;
    }

    isCanMove() {
        return this.canMove;
    }
}

export let autoRoute = new AutoRoute();