import { initFloorMaps, initFloors } from "../floor/data";
import { initTextAttribute } from "./textAttribute";
import { log, logExecutionTime } from "../common/util";
import { getDomNode, hideDomNode, setBackGroundColor, setInnerHtml, setNonOpaque, setOpacity, showDomNode } from "../common/client";
import { BLACK } from "../common/constants";
import { canvas, event, ui } from "./canvas/canvas";
import { canvasAnimate } from "./canvas/animates";
import i18next from "../common/i18n";
import { eventManager } from "../events/events";
import { config } from "../common/config";
import { imageMgr } from "../resource/images";
import gameWindow from "./gameWindow";

class Menu {
    static instance: Menu;

    static getInstance() {
        if (!Menu.instance) {
            Menu.instance = new Menu();
        }
        return Menu.instance;
    }

    private constructor() {
        if (Menu.instance) {
            throw new Error('Menu is a singleton class');
        }
    }



    @log
    reload() {
        // initGlobalConfig();
        // coreStatus.init();
        // initCanvasContexts();
        // initImages();
        // initEnemys();
        // initEvents();
        // initMaps();
        // initItems();
        // initAnimates();
        // initShops();
        canvasAnimate.setRequestAnimationFrame();
        logExecutionTime(initFloors)();
        logExecutionTime(initFloorMaps)();
        logExecutionTime(initTextAttribute)();

        eventManager.initTriggerEvents();
    }

    show() {
        console.log('Show menu called...');

        this.reload();

        // Show menu
        showDomNode('menuBox');
        setNonOpaque('menuBox');

        // Show loading menu
        showDomNode('loadingMenu');
        setNonOpaque('loadingMenu');

        // Hide Button Box
        hideDomNode('menuButtonsBox');

        // Show menu buttons
        showDomNode('menuButtons')

        // Hide level buttons
        hideDomNode('levelButtons');

        setBackGroundColor('curtain', BLACK);
        setOpacity('curtain', 0);

        this.clearStatus();
        canvas.clearAllCanvas();

        this.showMenuAfterLoading();
        this.registerButtonsClick();

    }

    private clearStatus() {
        canvas.clearAllInterval();
        gameWindow.resize();
    }

    private showMenuAfterLoading() {
        let after_loading_callback = () => {
            hideDomNode('loadingTips');
            showDomNode('menuButtonsBox');
            setInnerHtml("menuGameTitle", i18next.t('title'));
        }
        canvasAnimate.hideDomAsAnimate('loadingMenu', 30, after_loading_callback);

    }

    hideMenu() {
        canvasAnimate.hideDomAsAnimate('menuBox', 15);
    }

    private registerButtonsClick() {
        console.log('Register buttons click...');
        getDomNode('startGame').onclick = eventManager.handleClickStartGameButtonEvent;
        getDomNode('loadGame').onclick = () => eventManager.handleLoadGame();

        getDomNode('easyLevel').onclick = () => eventManager.hanleStartGameEvent('easy');
        getDomNode('normalLevel').onclick = () => eventManager.hanleStartGameEvent('normal');
        getDomNode('hardLevel').onclick = () => eventManager.hanleStartGameEvent('hard');
    }

}

const menu = Menu.getInstance();

export default menu;