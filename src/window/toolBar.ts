import { showDomNode } from "../common/client";

class ToolBar {
    static instance: ToolBar;
    static getInstance() {
        if (!ToolBar.instance) {
            ToolBar.instance = new ToolBar();
        }
        return ToolBar.instance;
    }

    constructor() {
        if (ToolBar.instance) {
            return ToolBar.instance;
        }
        ToolBar.instance = this;
    }

    show() {
        showDomNode('toolBar')
    }

}

export const toolBar = ToolBar.getInstance();