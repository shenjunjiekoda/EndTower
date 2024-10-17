import { BLOCK_WIDTH, INIT_CANVAS_WIDTH, NPC_TEXTBOX_FONT, PLAYER_TEXTBOX_FONT, TEXTBOX_FONT, WHITE } from "../../common/constants";
import { core } from "../../common/global";
import { colorArrayToRGB, isset } from "../../common/util";
import { eventManager } from "../../events/events";
import { playerMgr } from "../../player/data";
import { getPlayerIconLineOfDirection, getPlayerIconStillOfDirection, imageMgr } from "../../resource/images";
import { textAttribute } from "../../window/textAttribute";
import { canvas, getCanvasContext, ui } from "./canvas";
import { canvasAnimate } from "./animates";
import { getFloorById } from "../../floor/data";
import i18next from "i18next";
import { notebook } from "../../items/notebook";
import { enemiesMgr } from "../../enemies/data";

export class TextBoxResolver {
    private content: string;

    private id: string | null = null;
    private name: string | null = null;
    private images: HTMLImageElement[] | null = null;
    private icon = 0;
    private position = textAttribute.position;

    private px: number | null = null;
    private py: number | null = null;
    private ydelta = 0;

    constructor(content: string) {
        this.content = content;
        this.parseTextParam();
    }

    static setFontAndGetSplitLines(canvasId: string, text: string, maxLength: number, font?: string) {
        if (isset(font)) {
            getCanvasContext(canvasId).setFont(font!);
        }

        let contents = [];
        let last = 0;
        for (let i = 0; i < text.length; i++) {
            const c = text.charAt(i);
            if (c == '\n') {
                contents.push(text.substring(last, i));
                last = i + 1;
            } else if (c == '\\' && text.charAt(i + 1) == 'n') {
                contents.push(text.substring(last, i));
                last = i + 2;
            } else {
                let toAdd = text.substring(last, i + 1);
                if (getCanvasContext(canvasId).measureTextWidth(toAdd) > maxLength) {
                    contents.push(text.substring(last, i));
                    last = i;
                }
            }
        }
        contents.push(text.substring(last));
        return contents;
    }

    private parseTextParam() {


        // 解析对话框内容中的\t[...]，提取角色信息
        if (this.content.startsWith("\t[") || this.content.startsWith("\\t[")) {
            const index = this.content.indexOf("]");
            if (index >= 0) {
                let str = this.content.substring(2, index);

                if (this.content.startsWith("\\t["))
                    str = this.content.substring(3, index);

                this.content = this.content.substring(index + 1);
                const people = str.split(",");
                if (people.length === 1) {
                    this.id = people[0];

                    if (this.id !== 'player') {
                        if (enemiesMgr.hasEnemyId(this.id)) {
                            const enemy = enemiesMgr.getEnemyByID(this.id);
                            this.name = enemy!.name;
                            this.images = imageMgr.getEnemyImages(this.name!);
                        } else {
                            this.name = this.id;
                            this.id = 'npc';
                        }
                    }
                } else {
                    this.id = 'npc';
                    this.name = people[0];
                    this.images = imageMgr.getNPCImages(people[1]);
                    console.log('npc images: ', people[1], this.images);
                }
            }
        }



        // 解析对话框内容中的\b[...]，提取位置信息
        if (this.content.startsWith("\b[") || this.content.startsWith("\\b[")) {
            const index = this.content.indexOf("]");
            if (index >= 0) {
                let substr = this.content.substring(2, index);

                if (this.content.startsWith("\\b["))
                    substr = this.content.substring(3, index);

                this.content = this.content.substring(index + 1);
                const posInfo = substr.split(",");

                if (['up', 'center', 'down'].includes(posInfo[0])) {
                    this.position = posInfo[0];
                    if (core.getEventId() === 'action') {
                        this.px = core.getEventData('x');
                        this.py = core.getEventData('y');
                    }

                    if (posInfo.length >= 2) {
                        if (posInfo[1] === 'player') {
                            const playerLoc = playerMgr.getPlayerLoc();
                            this.px = playerLoc.x;
                            this.py = playerLoc.y;
                            this.ydelta = playerMgr.getPlayerIconHeight() - BLOCK_WIDTH;
                        } else if (posInfo.length >= 3) {
                            this.px = parseInt(posInfo[1]);
                            this.py = parseInt(posInfo[2]);
                        }
                    }
                }
            }
        }

        // 替换文本中的特殊字符
        this.content = eventManager.resolveText(this.content);
        console.log('resolved text box content: ', this.content);
    }

    draw() {
        console.log("textboxresolver.draw");
        // 创建背景图案
        console.log('ground image', imageMgr.getGround());
        const background = ui.createPattern(imageMgr.getGround()) as CanvasPattern;
        canvasAnimate.resetBoxAnimate();
        ui.clearRect();

        const left = 10;
        const right = INIT_CANVAS_WIDTH - 2 * left;

        let content_left = left + 25;
        if (this.id === 'player' || isset(this.images))
            content_left = left + 63;

        // 计算有效宽度
        const validWidth = right - (content_left - left) - 13;

        // 将内容分行
        const contents = TextBoxResolver.setFontAndGetSplitLines("ui", this.content, validWidth, TEXTBOX_FONT);
        console.log('contents: ', contents);

        if (this.id == 'player' || isset(this.name)) {
            let people = '';
            if (isset(this.name)) {
                const floor = getFloorById()!;
                people = i18next.t(floor.title) + " - " + this.name!;
            } else {
                people = playerMgr.getPlayerName();
            }
            notebook.addNotes(people, contents);
        }

        // 计算对话框的高度
        const height = 20 + 21 * (contents.length + 1) + (this.id === 'player' ? playerMgr.getPlayerIconHeight() - 10 : isset(this.name) ? BLOCK_WIDTH - 10 : 0);

        console.log('height: ', height);
        console.log('position: ', textAttribute.position);

        const xoffset = 6, yoffset = 22;

        // 根据位置设置对话框的顶部位置
        let top: number
        switch (this.position) {
            case 'center':
                top = (416 - height) / 2;
                break;
            case 'up':
                top = isset(this.px) && isset(this.py) ? (BLOCK_WIDTH * this.py! - height - this.ydelta - yoffset) : 5;
                break;
            case 'down':
                top = isset(this.px) && isset(this.py) ? (BLOCK_WIDTH * this.py! + BLOCK_WIDTH + yoffset) : (416 - height - 5);
                break;
        }

        // 设置背景透明度并填充背景颜色
        ui.setAlpha(textAttribute.background[3]);
        ui.setFillStyle(colorArrayToRGB(textAttribute.background));
        ui.setStrokeStyle(WHITE);

        // 绘制对话框背景
        ui.fillRect(left, top!, right, height);
        ui.strokeRect(left - 1, top! - 1, right + 1, height + 1, WHITE, 2);

        // 绘制三角形指示箭头
        console.log('ui: ', ui);
        if (this.position === 'up' && isset(this.px) && isset(this.py)) {
            ui.clearRect(BLOCK_WIDTH * this.px! + xoffset, top! + height - 1, BLOCK_WIDTH - 2 * xoffset, 2);

            ui.beginPath();

            ui.moveTo(BLOCK_WIDTH * this.px! + xoffset - 1, top! + height - 1);
            ui.lineTo(BLOCK_WIDTH * this.px! + BLOCK_WIDTH / 2, top! + height + yoffset - 2);
            ui.lineTo(BLOCK_WIDTH * this.px! + BLOCK_WIDTH - xoffset + 1, top! + height - 1);
            ui.moveTo(BLOCK_WIDTH * this.px! + xoffset - 1, top! + height - 1);

            ui.closePath();

            ui.fill();

            ui.drawLine(BLOCK_WIDTH * this.px! + xoffset, top! + height, BLOCK_WIDTH * this.px! + 16, top! + height + yoffset - 2);
            ui.drawLine(BLOCK_WIDTH * this.px! + BLOCK_WIDTH - xoffset, top! + height, BLOCK_WIDTH * this.px! + 16, top! + height + yoffset - 2);
        }
        if (this.position === 'down' && isset(this.px) && isset(this.py)) {
            ui.clearRect(BLOCK_WIDTH * this.px! + xoffset, top! - 2, BLOCK_WIDTH - 2 * xoffset, 3);
            ui.beginPath();
            ui.moveTo(BLOCK_WIDTH * this.px! + xoffset - 1, top! + 1);
            ui.lineTo(BLOCK_WIDTH * this.px! + BLOCK_WIDTH / 2 - 1, top! - yoffset + 2);
            ui.lineTo(BLOCK_WIDTH * this.px! + BLOCK_WIDTH - xoffset - 1, top! + 1);
            ui.moveTo(BLOCK_WIDTH * this.px! + xoffset - 1, top! + 1);
            ui.closePath();
            ui.fill();
            ui.drawLine(BLOCK_WIDTH * this.px! + xoffset, top!, BLOCK_WIDTH * this.px! + BLOCK_WIDTH / 2, top! - yoffset + 2);
            ui.drawLine(BLOCK_WIDTH * this.px! + BLOCK_WIDTH - xoffset, top!, BLOCK_WIDTH * this.px! + BLOCK_WIDTH / 2, top! - yoffset + 2);
        }

        // 绘制名称
        ui.setTextAlign('left');

        let content_top = top! + 35;
        if (isset(this.id)) {
            console.log('id: ', this.id);

            content_top = top! + 57;
            ui.setAlpha(textAttribute.title[3]);
            ui.setFillStyle(colorArrayToRGB(textAttribute.title));
            ui.setStrokeStyle(colorArrayToRGB(textAttribute.title));

            // 如果是主角，绘制主角头像和名称
            if (this.id === 'player') {
                const playerHeight = playerMgr.getPlayerIconHeight();
                ui.strokeRect(left + 15 - 1, top! + 40 - 1, 34, playerHeight + 2, undefined, 2);
                ui.fillText(playerMgr.getPlayerName(), content_left, top! + 30, undefined, PLAYER_TEXTBOX_FONT);
                ui.clearRect(left + 15, top! + 40, BLOCK_WIDTH, playerHeight);
                ui.fillRect(left + 15, top! + 40, BLOCK_WIDTH, playerHeight, background);
                ui.drawImage(imageMgr.getPlayer(), getPlayerIconStillOfDirection('down') * BLOCK_WIDTH, getPlayerIconLineOfDirection('down'), BLOCK_WIDTH, playerHeight, left + 15, top! + 40, BLOCK_WIDTH, playerHeight);
            } else {
                // 如果是其他角色，绘制角色名称和头像
                ui.fillText(this.name!, content_left, top! + 30, undefined, NPC_TEXTBOX_FONT);
                if (isset(this.images)) {
                    ui.strokeRect(left + 15 - 1, top! + 40 - 1, 34, 34, undefined, 2);
                    canvasAnimate.resetBoxAnimate();
                    console.log('textboxresolver box images', this.images);
                    canvasAnimate.pushBoxAnimateObj(
                        left + 15,
                        top! + 40,
                        BLOCK_WIDTH,
                        BLOCK_WIDTH,
                        left + 15,
                        top! + 40,
                        this.images!,
                        this.icon,
                    );
                    canvasAnimate.drawBoxAnimate();
                }
            }
        }

        // 设置文本透明度和填充颜色
        ui.setAlpha(textAttribute.text[3]);
        ui.setFillStyle(colorArrayToRGB(textAttribute.text));

        // 绘制文本内容
        for (const line of contents) {
            console.log('ui fill text line now');
            ui.fillText(line, content_left, content_top, undefined, TEXTBOX_FONT);
            content_top += 21;
        }
    }
}