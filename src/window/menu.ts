import { initFloorMaps, initFloors } from "../floor/data";
import { initTextAttribute } from "./textAttribute";
import { log, logExecutionTime } from "../common/util";
import { getDomNode, hideDomNode, setBackGroundColor, setInnerHtml, setNonOpaque, setOpacity, showDomNode } from "../common/client";
import { BLACK } from "../common/constants";
import { canvas, event, initCanvasContexts, ui } from "./canvas/canvas";
import { canvasAnimate } from "./canvas/animates";
import i18next from "../common/i18n";
import eventMgr from "../events/manager";
import { config, initGlobalConfig } from "../common/config";
import { imageMgr } from "../resource/images";
import gameWindow from "./gameWindow";
import { itemMgr } from "../items/data";
import { enemiesMgr } from "../enemies/data";
import { shopMgr } from "../shops/shops";

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
        initGlobalConfig();
        logExecutionTime(initTextAttribute)();
        itemMgr.initItems();
        enemiesMgr.initEnemys();
        shopMgr.initShops();
        initFloors();
        initFloorMaps();
        // logExecutionTime(initFloorMaps)();
        // logExecutionTime(initFloors)();
        eventMgr.initTriggerEvents();

        canvasAnimate.setRequestAnimationFrame();

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
        getDomNode('startGame').onclick = eventMgr.handleClickStartGameButtonEvent;
        getDomNode('loadGame').onclick = () => eventMgr.handleLoadGame();

        getDomNode('easyLevel').onclick = () => eventMgr.hanleStartGameEvent('easy');
        getDomNode('normalLevel').onclick = () => eventMgr.hanleStartGameEvent('normal');
        getDomNode('hardLevel').onclick = () => eventMgr.hanleStartGameEvent('hard');
    }

}

const menu = Menu.getInstance();

export default menu;