import { setInnerHtml, showDomNode } from "../common/client";
import { callertrace } from "../common/util";
import i18next from "i18next";
import { updateDamageDisplay } from "./canvas/damage";
import { playerMgr } from "../player/data";

class StatusBar {
    static instance: StatusBar;
    static getInstance() {
        if (!StatusBar.instance) {
            StatusBar.instance = new StatusBar();
        }
        return StatusBar.instance;
    }

    constructor() {
        if (StatusBar.instance) {
            return StatusBar.instance;
        }
        StatusBar.instance = this;
    }

    show() {
        showDomNode('statusBar')
        this.syncPlayerStatus();
    }

    @callertrace
    syncPlayerStatus() {

        console.log('syncPlayerStatus');

        setInnerHtml('levelStatusText', `${i18next.t('level')} ${playerMgr.getPlayerLevel()}`);
        setInnerHtml('hpStatusText', `${playerMgr.getPlayerHP()}`);
        setInnerHtml('attackStatusText', `${playerMgr.getPlayerAttack()}`);
        setInnerHtml('defenseStatusText', `${playerMgr.getPlayerDefense()}`);
        setInnerHtml('moneyStatusText', `${playerMgr.getPlayerMoney()}`);
        setInnerHtml('expStatusText', `${playerMgr.getPlayerExp()}`);
        setInnerHtml('yellowKey', `${playerMgr.getPlayerKeyCount('yellow')}`);
        setInnerHtml('blueKey', `${playerMgr.getPlayerKeyCount('blue')}`);
        setInnerHtml('redKey', `${playerMgr.getPlayerKeyCount('red')}`);
        setInnerHtml('greenKey', `${playerMgr.getPlayerKeyCount('green')}`);

        updateDamageDisplay();
    }
}

const statusBar = StatusBar.getInstance();
export default statusBar;