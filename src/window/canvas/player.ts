import { BLOCK_WIDTH, DEFAULT_INTERVAL_MILLS, DEFAULT_TIMEOUT_MILLS, DIRECTION_TO_POINT_MAP } from "../../common/constants";
import { autoRoute, RouteElem } from "../../player/autoroute";
import { canvas, player } from "./canvas";
import { getPlayerIconLineOfDirection, getPlayerIconStateIdx, imageMgr } from "../../resource/images";
import { playerMgr } from "../../player/data";
import { isset, toInt } from "../../common/util";
import { core } from "../../common/global";
import { getBlockAtPointOnFloor } from "../../floor/block";
import { getFloorById } from "../../floor/data";
import { route } from "../../player/route";
import { eventManager } from "../../events/events";
import { config } from "../../common/config";
import statusBar from "../../window/statusBar";

export function drawPlayer(direction: string = playerMgr.getPlayerLocDirection(), x: number = playerMgr.getPlayerLocX(), y: number = playerMgr.getPlayerLocY(), status: string = 'still', offsetX: number = 0, offsetY: number = 0) {
    let dx = (offsetX == 0) ? 0 : offsetX / Math.abs(offsetX);
    let dy = (offsetY == 0) ? 0 : offsetY / Math.abs(offsetY);

    autoRoute.clearUINode(x + dx, y + dy);


    x *= BLOCK_WIDTH;
    y *= BLOCK_WIDTH;

    player.clearRect(x - BLOCK_WIDTH, y - BLOCK_WIDTH, 3 * BLOCK_WIDTH, 3 * BLOCK_WIDTH);

    const playerImg = imageMgr.getPlayer();
    const height = playerMgr.getPlayerIconHeight();

    player.drawImage(playerImg, getPlayerIconStateIdx(direction, status) * 32, getPlayerIconLineOfDirection(direction) * height, 32, height, x + offsetX, y + offsetY + 32 - height, 32, height);
}

export function stopPlayer(callback?: Function) {
    autoRoute.stop();
    autoRoute.clearRemainingRoutes();

    if (isset(callback)) {
        core.lock();
        autoRoute.setCanMove(false);

        setTimeout(() => {
            drawPlayer();
            callback!();
        }, DEFAULT_TIMEOUT_MILLS);
    }
}

export function pointNoPassExists(x: number, y: number, floorId?: number): boolean {
    const block = getBlockAtPointOnFloor(x, y, floorId);
    return isset(block) && isset(block!.block!.event!.noPass) && block!.block!.event!.noPass!;
}


function pointNoPass(x: number, y: number): boolean {
    return x < 0 || x > 12 || y < 0 || y > 12 || pointNoPassExists(x, y);
}

export function canMovePlayer(x?: number, y?: number, direction?: string, floorId?: number) {
    const playerLoc = playerMgr.getPlayerLoc();
    if (!isset(x)) {
        x = playerLoc.x;
    }
    if (!isset(y)) {
        y = playerLoc.y;
    }
    if (!isset(direction)) {
        direction = playerLoc.direction;
    }
    if (!isset(floorId)) {
        floorId = playerMgr.getFloorId();
    }

    // 检查当前块的cannotMove
    const floor = getFloorById(floorId!)!;
    if (isset(floor.blockCannotMoveDirections)) {
        const cannotMoveDirections = floor.blockCannotMoveDirections![x + "," + y];
        if (isset(cannotMoveDirections) && cannotMoveDirections instanceof Array && cannotMoveDirections.indexOf(direction!) >= 0) {
            return false;
        }
    }

    const curBlock = getBlockAtPointOnFloor(x!, y!, floorId!);
    if (isset(curBlock)) {
        const curBlockEventId = curBlock!.block!.event!.id;
        const nowIsArrow: boolean = curBlockEventId.slice(0, 5).toLowerCase() == 'arrow';
        if (nowIsArrow) {
            const nowArrow = curBlockEventId.slice(5).toLowerCase();
            if (direction != nowArrow) {
                return false;
            }
        }
    }

    const nextBlock = getBlockAtPointOnFloor(x! + DIRECTION_TO_POINT_MAP[direction!].x!, y! + DIRECTION_TO_POINT_MAP[direction!].y!, floorId!);
    if (isset(nextBlock)) {
        const nextId = nextBlock!.block!.event!.id;
        // 遇到单向箭头处理
        const isArrow = nextId.slice(0, 5).toLowerCase() == 'arrow';
        if (isArrow) {
            const nextArrow = nextId.slice(5).toLowerCase();
            if ((DIRECTION_TO_POINT_MAP[direction!].x + DIRECTION_TO_POINT_MAP[nextArrow].x) == 0 && (DIRECTION_TO_POINT_MAP[direction!].y + DIRECTION_TO_POINT_MAP[nextArrow].y) == 0) {
                return false;
            }
        }
    }
    return true;
}

////// 每移动一格后执行的事件 //////
function moveOneStep() {
    playerMgr.incPlayerSteps();
    // 中毒状态
    if (core.getFlag('poison')) {
        playerMgr.setPlayerHP(playerMgr.getPlayerHP() - toInt(config.poisonDamage));
        if (playerMgr.getPlayerHP() <= 0) {
            playerMgr.setPlayerHP(0);
            statusBar.syncPlayerStatus();
            eventManager.handleGameover('poison');
            return;
        }
        statusBar.syncPlayerStatus();
    }
}

function setPlayerMoveInterval(direction: string, x: number, y: number, callback?: Function) {
    if (playerMgr.getPlayerMovingIntervalCnt() > 0) {
        return;
    }
    playerMgr.setPlayerMovingIntervalCnt(1);
    canvas.setPlayerMoveInterval(setInterval(() => {
        playerMgr.addPlayerMovingIntervalCnt();
        if (playerMgr.getPlayerMovingIntervalCnt() == 8) {
            playerMgr.setPlayerLocX(x + DIRECTION_TO_POINT_MAP[direction].x);
            playerMgr.setPlayerLocY(y + DIRECTION_TO_POINT_MAP[direction].y);

            moveOneStep();
            player.clearRect();

            drawPlayer();
            canvas.clearPlayerMoveInterval();
            playerMgr.setPlayerMovingIntervalCnt(0);
            if (isset(callback)) {
                callback!();
            }
        }
    }, DEFAULT_INTERVAL_MILLS / 2));
}

// 行走一步 | move one step
export function moveAction(callback?: Function) {
    if (canvas.issetOpenDoorAnimate()) {
        return;
    }
    if (playerMgr.getPlayerMovingIntervalCnt() > 0) {
        return;
    }

    const playerLoc = playerMgr.getPlayerLoc();
    const direction = playerLoc.direction;
    const x = playerLoc.x;
    const y = playerLoc.y;

    const noPass: boolean = pointNoPass(x + DIRECTION_TO_POINT_MAP[direction].x, y + DIRECTION_TO_POINT_MAP[direction].y);
    const canMove: boolean = canMovePlayer();
    console.log('noPass:', noPass, ' canMove:', canMove);

    if (noPass || !canMove) {
        route.push(direction);

        autoRoute.setRemainingRoutes([]);

        if (canMove) {
            // 非箭头：触发
            eventManager.handleTriggerPointEvent(x + DIRECTION_TO_POINT_MAP[direction].x, y + DIRECTION_TO_POINT_MAP[direction].y);
        }

        console.log('stop player at ', direction, ' (', x, ',', y, ')');
        drawPlayer(direction, x, y);

        if (autoRoute.getRemainingRoutesLength() == 0) {
            autoRoute.clearRemainingRoutes();
            autoRoute.stop();
        }

        if (isset(callback)) {
            callback!();
        }
    }
    else {
        const afterMove = () => {
            const playerLoc = playerMgr.getPlayerLoc();
            if (autoRoute.isMoveEnabled()) {

                autoRoute.incDirectionMovedSteps();
                autoRoute.setLastDirection(playerLoc.direction);

                if (autoRoute.getDirectionDestSteps() == autoRoute.getDirectionMovedSteps()) {
                    if (autoRoute.getIdx() == autoRoute.getRoutesLength()) {
                        autoRoute.clearRemainingRoutes();
                        autoRoute.stop();
                    }
                    else {
                        autoRoute.setDirectionMovedSteps(0);
                        autoRoute.setDirectionDestSteps(autoRoute.getRoutes()[autoRoute.getIdx()].steps);
                        playerMgr.setPlayerLocDirection(autoRoute.getRoutes()[autoRoute.getIdx()].direction);
                        autoRoute.incIdx();
                    }
                }
            }
            else if (!playerMgr.isPlayerMoving()) {
                drawPlayer(playerLoc.direction, playerLoc.x, playerLoc.y);
            }

            eventManager.handleTriggerPointEvent(playerMgr.getPlayerLocX(), playerMgr.getPlayerLocY());
            eventManager.checkAndHandleBlockEvent();
            if (isset(callback)) {
                callback!();
            }
        };
        setPlayerMoveInterval(direction, x, y, afterMove);
    }
}

// 移动角色 | move player
export function movePlayer(direction: string, callback?: Function) {
    console.log('movePlayer: ', direction);
    // 如果正在移动，直接return
    if (playerMgr.getPlayerMovingIntervalCnt() > 0) {
        return;
    }
    playerMgr.setPlayerLocDirection(direction);
    if (!isset(callback)) {
        playerMgr.setPlayerIsMoving(true);
        autoRoute.setCanMove(false);

        let doAction = () => {
            if (playerMgr.isPlayerMoving()) {
                moveAction();
                setTimeout(doAction, 50);
            }
            else {
                playerMgr.setPlayerIsMoving(false);
            }
        }
        doAction();
    }
    else { // 否则，只向某个方向移动一步，然后调用callback
        moveAction(callback);
    }
}
