import { animates } from "./resource/animates";
import { initI18n } from "./common/i18n";
import { logExecutionTime } from "./common/util";
import { initCanvasContexts } from "./window/canvas/canvas";
import menu from "./window/menu";

class Main {

    constructor() {
        console.log("EndTower is running...");

        logExecutionTime(initI18n)();
        logExecutionTime(initCanvasContexts)();
        logExecutionTime(animates.initAnimates)();

        menu.show();
    }
}

new Main();