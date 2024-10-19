import { isset } from "../common/util";
import { getFloorById, getMapData } from "./data";
import { DEFAULT_TIMEOUT_MILLS, FPS } from "../common/constants";
import { core } from "../common/global";
import { autoRoute } from "../player/autoroute";
import { setInnerHtml } from "../common/client";
import i18next from "i18next";
import { staticConfig } from "../common/config";
import { drawPlayer } from "../window/canvas/player";
import statusBar from "../window/statusBar";
import { toolBar } from "../window/toolBar";
import { canvasAnimate } from "../window/canvas/animates";
import { canvas } from "../window/canvas/canvas";
import { audioMgr } from "../resource/audios";
import { PlayerLocation, playerMgr } from "../player/data";
import eventMgr from "../events/manager";

export enum StairDirection {
    UPFLOOR = 1,
    DOWNFLOOR = -1
}

export function toDirection(direction?: string): StairDirection | undefined {
    if (!isset(direction)) {
        return undefined;
    }
    switch (direction) {
        case "upFloor":
            return StairDirection.UPFLOOR;
        case "downFloor":
            return StairDirection.DOWNFLOOR;
        default:
            return undefined;
    }
}

function StairDirectionToString(direction: StairDirection): string {
    switch (direction) {
        case StairDirection.UPFLOOR:
            return "upFloor";
        case StairDirection.DOWNFLOOR:
            return "downFloor";
        default:
            return "unknown";
    }
}

function handlePostSwitchFloorEvent(destFloorId: number) {
    if (core.isEventSet()) {
        console.log('handle post switch floor event exist id', core.getEventId());
        return;
    }
    let flag = 'floor_visited' + destFloorId;
    if (!core.hasFlag(flag)) {
        let dstFloor = getFloorById(destFloorId);
        if (isset(dstFloor?.firstArriveEvents)) {
            console.log("first arrive events: ", dstFloor!.firstArriveEvents);
            eventMgr.handle(dstFloor!.firstArriveEvents!);
        }
        core.setFlag(flag, true);
    }
}

export function switchFloor(destFloorId: number, stairDirection?: StairDirection, playerLoc?: PlayerLocation, interval: number = 800, callback?: Function) {
    console.log("switchFloor", destFloorId, stairDirection, playerLoc, interval);

    const DestFloor = getFloorById(destFloorId)!;
    console.log('DestFloor: ', DestFloor);

    // 将时间单位调整为帧 | Adjust time unit to frames
    const frameTime = interval / FPS;

    core.lock();

    playerMgr.resetPlayerMovingIntervalCnt();

    autoRoute.stop();
    autoRoute.clearRemainingRoutes();

    setInnerHtml('titleLabelTip', i18next.t('title'));
    setInnerHtml('versionLabelTip', staticConfig.gameVersion);

    const FloorNameLabelTip = isset(DestFloor.name) ? i18next.t(DestFloor.name!) : i18next.t(DestFloor.title);
    setInnerHtml('floorNameLabelTip', FloorNameLabelTip);

    if (!isset(stairDirection) && !isset(playerLoc)) {
        playerLoc = playerMgr.getPlayerLoc();
    }

    console.log('switch floor playerLoc: ', playerLoc);

    const destMap = getMapData(destFloorId);
    if (isset(stairDirection)) {
        console.log('switch floor stairDirection: ', stairDirection, StairDirectionToString(stairDirection!));
        if (!isset(playerLoc)) {
            playerLoc = { direction: "up", x: 0, y: 0 };
        }
        const blocks = destMap.blocks;
        console.log('blocks for floorId: ', destFloorId, blocks);
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            if (block.event?.id == StairDirectionToString(stairDirection!)) {
                console.log('switch floor block.event!.id: ', block.event!.id);
                console.log('cur block', block);
                console.log('cur block enable', block.enable);
            }

            if (isset(block.event) && !(isset(block.enable) && !(block.enable!)) && block.event!.id == StairDirectionToString(stairDirection!)) {
                console.log('switch floor block.x: ', block.x, 'block.y: ', block.y);
                playerLoc!.x = block.x;
                playerLoc!.y = block.y;
                console.log('after switchfloor, playerLoc: ', playerLoc);
                break;
            }
        }

        if (!isset(playerLoc!.x)) {
            playerLoc!.x = playerMgr.getPlayerLocX();
            playerLoc!.y = playerMgr.getPlayerLocY();
        }
    }

    if (destMap.transporterEnabled && !playerMgr.getPlayerTransportEnabledRange().includes(destFloorId)) {
        playerMgr.addPlayerTransportEnabledFloor(destFloorId);
    }

    setTimeout(() => {
        const switchImpl = () => {
            //TODO: 换bgm
            setInnerHtml('floorStatusText', i18next.t(DestFloor.title));

            const onDrawMapComplete = () => {
                console.log('draw map complete');
                if (isset(playerLoc?.direction)) {
                    playerMgr.setPlayerLocDirection(playerLoc!.direction);
                }
                playerMgr.setPlayerLocX(playerLoc!.x);
                playerMgr.setPlayerLocY(playerLoc!.y);

                const loc = playerMgr.getPlayerLoc();
                console.log('draw player at: ', loc);
                drawPlayer(loc.direction, loc.x, loc.y);

                statusBar.syncPlayerStatus();


                const afterSwitch = () => {
                    core.unlock();

                    statusBar.show();
                    toolBar.show();

                    handlePostSwitchFloorEvent(destFloorId);

                    if (isset(callback)) {
                        callback!();
                    }
                };

                canvasAnimate.hideDomAsAnimate('floorSwitchTipBox', frameTime / 4, afterSwitch);
            };
            canvas.drawMap(destFloorId, () => setTimeout(onDrawMapComplete, DEFAULT_TIMEOUT_MILLS));
        };

        if (!audioMgr.isAnyPlaying()) {
            audioMgr.playBgm();
        }

        audioMgr.play('switch_floor.mp3');
        canvasAnimate.showDomAsAnimate('floorSwitchTipBox', frameTime / 2, switchImpl);
    }, DEFAULT_TIMEOUT_MILLS);
}