import { ADAPT_WIDTH, BASE_LINEHEIGHT, BORDER_STYLE, DEFAULT_BAR_WIDTH, DEFAULT_FONT_SIZE, INIT_CANVAS_WIDTH_WITH_2SPACE, ITEM_BAR_STYLE, SPACE, UNIT, WIDTH_THRESHOLD } from "../common/constants";
import { toolBar } from "./toolBar";
import statusBar from "./statusBar";
import { getDomNode, getDomNodesByClass } from "../common/client";

export enum ScreenMode {
    PC,
    MOBILE_VERTICAL,
    MOBILE_HORIZONTAL
};

interface StyleRule {
    [key: string]: string | number;
}

interface ElementStyleRule {
    id_selector?: string;
    class_selector?: string;
    rule: StyleRule;
}

class GameWindow {

    private static instance: GameWindow;

    private isHorizontal: boolean = false;
    private screenMode: ScreenMode = ScreenMode.PC;
    private scale: number = 1;

    public static getInstance(): GameWindow {
        if (!GameWindow.instance) {
            GameWindow.instance = new GameWindow();
        }
        return GameWindow.instance;
    }

    private constructor() {
        if (GameWindow.instance) {
            throw new Error('GameWindow is a singleton class');
        }
    }

    getScale() {
        return this.scale;
    }

    getScreenMode() {
        return this.screenMode;
    }

    getIsHorizontal() {
        return this.isHorizontal;
    }

    getClientWidth() {
        return document.body.clientWidth;
    }

    getClientHeight() {
        return document.body.clientHeight;
    }

    resize(width: number = this.getClientWidth(), height: number = this.getClientHeight()) {

        if (width > height && height < ADAPT_WIDTH) {
            this.isHorizontal = true;
            width = height;
        }

        let count = 9.6;

        let statusLineHeight = BASE_LINEHEIGHT;
        let statusLineFontSize = DEFAULT_FONT_SIZE;
        if (count > 8) {
            statusLineFontSize = DEFAULT_FONT_SIZE * 8 / count;
        }

        let zoom = (ADAPT_WIDTH - width) / 4.22;
        let adaptScale = 1 - zoom / 100;

        let canvasWidth = 0;
        let canvasTop = 0;

        let screenBoxHeight = 0
        let screenBoxWidth = 0

        let statusBarHeight = 0;
        let statusBarWidth = 0;
        let statusBarMaxWidth = 0;
        let statusHeight = 0;
        let statusBarItemLineHeight = 0;
        let statusBarItemMaxWidth = 0;
        let statusBarItemWidth = '100%';
        let statusBarImgBackGroundSize = 'auto 100%';

        let toolBarHeight = 0;
        let toolBarWidth = 0;
        let toolBarTop = 0;
        let toolBarItemHeight = 0;
        let toolBarItemMaxWidth = 0;

        let fontSize = 0;
        let margin = 0;

        if (width < WIDTH_THRESHOLD) {
            // 移动端

            if (width < ADAPT_WIDTH) {
                this.scale = adaptScale;
                canvasWidth = width;
            } else {
                this.scale = 1;
                canvasWidth = INIT_CANVAS_WIDTH_WITH_2SPACE;
            }

            let scaledWidth = INIT_CANVAS_WIDTH_WITH_2SPACE * this.scale;
            if (!this.isHorizontal) {
                // 竖屏
                this.screenMode = ScreenMode.MOBILE_VERTICAL;

                let col = (count - 1) / 3 + 1;

                let scaledTopBarHeight = this.scale * (BASE_LINEHEIGHT * col + SPACE * 2) + 6;
                let scaledBottomBarHeight = this.scale * (BASE_LINEHEIGHT + SPACE * 4) + 6;

                screenBoxHeight = scaledWidth + scaledTopBarHeight + scaledBottomBarHeight;
                screenBoxWidth = scaledWidth;

                canvasTop = scaledTopBarHeight;

                statusBarHeight = scaledTopBarHeight;

                statusHeight = this.scale * BASE_LINEHEIGHT * 1.2;
                statusBarItemLineHeight = statusHeight;
                statusBarMaxWidth = this.scale * DEFAULT_BAR_WIDTH;

                toolBarWidth = statusBarWidth = canvasWidth;
                toolBarHeight = scaledBottomBarHeight;
                toolBarTop = statusBarHeight + canvasWidth;
                toolBarItemHeight = this.scale * BASE_LINEHEIGHT * 1.2;
                toolBarItemMaxWidth = this.scale * DEFAULT_BAR_WIDTH * 0.5;
                statusBarItemWidth = '32.5%';
                statusBarImgBackGroundSize = 'auto 135%';

                fontSize = this.scale * statusLineFontSize;
                statusBarItemMaxWidth = toolBarItemMaxWidth;
                margin = this.scale * SPACE * 2;
            } else {
                // 横屏
                this.screenMode = ScreenMode.MOBILE_HORIZONTAL;

                screenBoxHeight = scaledWidth;
                screenBoxWidth = scaledWidth + DEFAULT_BAR_WIDTH * this.scale;
                canvasTop = 0;

                toolBarWidth = statusBarWidth = this.scale * DEFAULT_BAR_WIDTH;

                statusBarHeight = this.scale * statusLineHeight * count + SPACE * 2;
                statusHeight = this.scale * statusLineHeight
                statusBarItemLineHeight = statusHeight;
                statusBarItemMaxWidth = this.scale * DEFAULT_BAR_WIDTH;

                toolBarHeight = canvasWidth - statusBarHeight;
                toolBarTop = this.scale * statusLineHeight * count + SPACE * 2;
                toolBarItemHeight = this.scale * BASE_LINEHEIGHT * 0.9;
                toolBarItemMaxWidth = statusBarItemMaxWidth;

                fontSize = statusLineFontSize * this.scale;
                margin = this.scale * SPACE * 2;
            }

        } else {
            // pc端
            this.scale = 1;
            this.screenMode = ScreenMode.PC;

            screenBoxHeight = INIT_CANVAS_WIDTH_WITH_2SPACE;
            screenBoxWidth = WIDTH_THRESHOLD;

            canvasWidth = INIT_CANVAS_WIDTH_WITH_2SPACE;
            canvasTop = 0;

            toolBarWidth = statusBarWidth = DEFAULT_BAR_WIDTH;

            statusBarHeight = statusLineHeight * count + SPACE * 2;

            statusHeight = statusLineHeight * 0.98;
            statusBarItemLineHeight = statusHeight;

            statusBarMaxWidth = statusBarItemMaxWidth = DEFAULT_BAR_WIDTH;

            toolBarHeight = INIT_CANVAS_WIDTH_WITH_2SPACE - statusBarHeight;
            toolBarTop = statusBarHeight;
            toolBarItemHeight = BASE_LINEHEIGHT * 1.1;
            toolBarItemMaxWidth = DEFAULT_BAR_WIDTH * 0.9;

            fontSize = statusLineFontSize;
            margin = SPACE * 2;
        }

        let rules: ElementStyleRule[] = [
            {
                id_selector: 'screenBox',
                rule: {
                    height: screenBoxHeight + UNIT,
                    width: screenBoxWidth + UNIT,
                    top: (height - screenBoxHeight) / 2 + UNIT,
                    left: (width - screenBoxWidth) / 2 + UNIT,
                }
            },
            {
                class_selector: 'gameCanvas',
                rule: {
                    height: canvasWidth + UNIT,
                    width: canvasWidth + UNIT,
                    top: canvasTop + UNIT,
                    right: 0,
                    border: BORDER_STYLE,
                }
            },
            {
                id_selector: 'floorSwitchTipBox',
                rule: {
                    height: (screenBoxHeight - SPACE * 2) + UNIT,
                    width: (canvasWidth - SPACE * 2) + UNIT,
                    top: SPACE + UNIT,
                    right: SPACE + UNIT
                }
            },
            {
                id_selector: 'statusBar',
                rule: {
                    height: statusBarHeight + UNIT,
                    width: statusBarWidth + UNIT,
                    'background-size': statusBarImgBackGroundSize,
                    top: 0,
                    left: 0,

                    borderTop: ITEM_BAR_STYLE,
                    borderLeft: ITEM_BAR_STYLE,
                    borderRight: ITEM_BAR_STYLE,

                    fontSize: fontSize + UNIT,
                    padding: SPACE + UNIT,
                }
            }, {
                class_selector: 'statusBarItem',
                rule: {
                    height: statusHeight + UNIT,
                    width: statusBarItemWidth,
                    maxWidth: statusBarItemMaxWidth,
                    margin: margin / 6 + UNIT,
                }
            }, {
                class_selector: 'statusText',
                rule: {
                    lineHeight: statusBarItemLineHeight + UNIT,
                    marginLeft: margin / 4 + UNIT,
                }
            }, {
                id_selector: 'toolBar',
                rule: {
                    height: toolBarHeight + UNIT,
                    width: toolBarWidth + UNIT,
                    top: toolBarTop + UNIT,
                    left: 0,

                    borderTop: ITEM_BAR_STYLE,
                    borderLeft: ITEM_BAR_STYLE,
                    borderRight: ITEM_BAR_STYLE,

                    fontSize: fontSize + UNIT,
                    padding: SPACE + UNIT,
                }
            }, {
                class_selector: 'toolBarItem',
                rule: {
                    height: toolBarItemHeight + UNIT,
                    maxWidth: toolBarItemMaxWidth,
                    marginLeft: margin / 2 + UNIT,
                    marginRight: margin / 2 + UNIT,
                }
            }, {
                class_selector: 'toolButtonText',
                rule: {
                    lineHeight: toolBarItemHeight + UNIT,
                    marginLeft: margin + UNIT,
                }
            },
            {
                id_selector: 'curtain',
                rule: {
                    height: (canvasWidth - SPACE * 2) + UNIT,
                    width: (canvasWidth - SPACE * 2) + UNIT,
                    top: (canvasTop + SPACE) + UNIT,
                    right: SPACE + UNIT,
                }
            },
        ]

        this.render(rules);
    }

    private render(rules: ElementStyleRule[]) {
        toolBar.show();
        statusBar.show();

        const applyStyleRule = (element: HTMLElement, rule: StyleRule) => {
            for (const [property, value] of Object.entries(rule)) {
                (element.style as any)[property] = value;
            }
        };

        for (const elementRule of rules) {
            const { rule } = elementRule;
            if (elementRule.class_selector) {
                const elements = getDomNodesByClass(elementRule.class_selector);
                for (let i = 0; i < elements.length; i++) {
                    applyStyleRule(elements[i], rule);
                }
            }
            if (elementRule.id_selector) {
                applyStyleRule(getDomNode(elementRule.id_selector), rule);
            }
        }
    }
}

const gameWindow = GameWindow.getInstance();

window.onresize = function () {
    try {
        gameWindow.resize();
    } catch (err) {
        console.error(err);
    }
}

export default gameWindow;
