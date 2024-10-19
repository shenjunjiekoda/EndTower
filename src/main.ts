import { animates, initAnimateManager } from "./resource/animates";
import { initI18n } from "./common/i18n";
import { logExecutionTime } from "./common/util";
import { initCanvasContexts, initCanvasManager } from "./window/canvas/canvas";
import menu from "./window/menu";
import { imageMgr, initImageManager } from "./resource/images";
import i18next from "i18next";
import gameWindow from "./window/gameWindow";
import { getDomNode } from "./common/client";
import { initInteractManager, interact } from "./window/interact";
import { audioMgr, initAudioManager } from "./resource/audios";
import { initEventsManager } from "./events/manager";
import { initCoreStatus } from "./common/global";
import { initEnemiesManager } from "./enemies/data";
import { initItemManager } from "./items/data";
import { initNotebook } from "./items/notebook";
import { initAutoRoute } from "./player/autoroute";
import { InitPlayerManager } from "./player/data";
import { initRoute } from "./player/route";
import { initShopManager } from "./shops/shops";
import { initToolBar } from "./window/toolBar";
import { initCanvasAnimateManager } from "./window/canvas/animates";
import { initBlockingContext } from "./window/canvas/damage";

class Main {

    constructor() {
        console.log("EndTower is running...");

        logExecutionTime(initI18n)();
        this.showi18n();

        this.initModules();

        logExecutionTime(initCanvasContexts)();

        imageMgr.initImages();
        audioMgr.initAudios();
        animates.initAnimates();

        this.initEventHandler();

        menu.show();
        gameWindow.resize();
    }

    initModules() {
        initEventsManager();
        initCoreStatus();
        initEnemiesManager();
        initItemManager();
        initNotebook();
        initAutoRoute();
        InitPlayerManager();
        initRoute();
        initAnimateManager();
        initAudioManager();
        initImageManager();
        initShopManager();
        initInteractManager();
        initToolBar();
        initCanvasAnimateManager();
        initCanvasManager();
        initBlockingContext();
    }

    initEventHandler() {
        document.body.onkeydown = (e) => { interact.keyDownHandler(e); };
        document.body.onkeyup = (e) => { interact.keyUpHandler(e); };
        window.onorientationchange = () => {
            gameWindow.resize();
        };

        getDomNode('data').onmousedown = (e) => { interact.mouseDownHandler(e); };
        getDomNode('data').onmouseup = (e) => { interact.mouseUpHandler(e); }
        getDomNode('data').onmousemove = (e) => { interact.onMouseMoveHandler(e); }

        getDomNode('data').ontouchstart = (e) => { interact.touchStartHandler(e); };
        getDomNode('data').ontouchend = (e) => { interact.touchEndHandler(e); };
        getDomNode('data').ontouchmove = (e) => { interact.onTouchMoveHandler(e); };

        getDomNode('encyclopediaToolImg').onclick = () => { interact.encyclopediaOnClickHandler(); };
        getDomNode('transporterToolImg').onclick = () => { interact.transporterOnClickHandler(); };
        getDomNode('noteBookToolImg').onclick = () => { interact.noteBookOnClickHandler(); };
        getDomNode('toolBoxToolImg').onclick = () => { interact.toolBoxOnClickHandler() };
        getDomNode('saveToolImg').onclick = () => { interact.saveImageOnClickHandler(); };
        getDomNode('loadToolImg').onclick = () => { interact.loadImageOnClickHandler(); };
        getDomNode('settingToolImg').onclick = () => { interact.settingsOnClickHandler(); };
    }

    showi18n() {
        document.querySelectorAll('[data-i18n]').forEach((element) => {
            const key = element.getAttribute('data-i18n');
            if (key) {
                element.textContent = i18next.t(key);
            }
        });
    }
}

new Main();


