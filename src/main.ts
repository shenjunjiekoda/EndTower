import { animates } from "./resource/animates";
import { initI18n } from "./common/i18n";
import { logExecutionTime } from "./common/util";
import { initCanvasContexts } from "./window/canvas/canvas";
import menu from "./window/menu";
import { imageMgr } from "./resource/images";
import i18next from "i18next";
import gameWindow from "./window/gameWindow";
import { getDomNode } from "./common/client";
import { interact } from "./window/interact";
import { audioMgr } from "./resource/audios";

class Main {

    constructor() {
        console.log("EndTower is running...");

        logExecutionTime(initI18n)();
        this.showi18n();

        logExecutionTime(initCanvasContexts)();

        imageMgr.initImages();
        audioMgr.initAudios();
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