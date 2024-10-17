import { animates } from "./resource/animates";
import { initI18n } from "./common/i18n";
import { logExecutionTime } from "./common/util";
import { initCanvasContexts } from "./window/canvas/canvas";
import menu from "./window/menu";
import { imageMgr } from "./resource/images";
import i18next from "i18next";
import gameWindow from "./window/gameWindow";

class Main {

    constructor() {
        console.log("EndTower is running...");

        logExecutionTime(initI18n)();
        this.showi18n();

        logExecutionTime(initCanvasContexts)();
        
        imageMgr.initImages();
        animates.initAnimates();

        menu.show();
        gameWindow.resize();
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