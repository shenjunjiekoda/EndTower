import { importAll, isset, logExecutionTime } from "../common/util";
import { playerMgr } from "../player/data";

class ImageManager {
    private images: Record<string, HTMLImageElement>;

    constructor() {
        this.images = {};
        logExecutionTime(this.initImages)();
    }

    getGround(id: string = 'ground') {
        return this.get('grounds', id);
    }

    getItem(id: string) {
        return this.get('items', id);
    }

    getPlayer() {
        return this.images['player'];
    }

    getEnemy(id: string) {
        return this.get('enemies', id);
    }

    getEnemyImages(id: string) {
        return this.getImages('enemies', id);
    }

    getNPC(id: string) {
        return this.get('npcs', id);
    }

    getNPCImages(id: string) {
        return this.getImages('npcs', id);
    }

    getAnimate(id: string) {
        return this.get('animates', id);
    }

    getAnimateImages(id: string) {
        return this.getImages('animates', id);
    }

    get(category: string, imgName: string): HTMLImageElement {
        let key = `${category}/${imgName}`;
        if (key in images) {
            return this.images[key];
        }
        key = `${category}/${imgName}_1`;
        if (key in images) {
            return this.images[key];
        }
        throw new Error(`Image ${category}/${imgName} not found`);
    }

    getImages(category: string, imgName: string): HTMLImageElement[] {
        const key = `${category}/${imgName}`;
        if (key in images) {
            return [this.images[key]];
        }
        let i = 1;
        let result: HTMLImageElement[] = [];
        while (true) {
            const imgKey = `${category}/${imgName}_${i}`;
            if (imgKey in images) {
                result.push(this.images[imgKey]);
            }
            else {
                break;
            }
            i++;
        }
        return result;
    }

    initImages() {
        const imgs = importAll(require.context('../../public/images', false, /\.(png|jpe?g|gif)$/));
        imgs.forEach((img) => {
            console.log(`importing image: ${img}`);
            const path = img as string;
            this.loadImage(path, (category, imgName, image) => {
                console.log(`loaded image: ${category}/${imgName}`, image);
                this.images[`${category}/${imgName}`] = image;
            }, path.toLowerCase().includes('ground'));
        });
    }

    loadImage(imgPath: string, callback?: (catogory: string, imgName: string, image: HTMLImageElement) => void, callbackDirectly: boolean = false) {
        let lst = imgPath.split('/');
        let imgName = lst.pop();
        let category = lst.pop();
        if (!isset(imgName)) {
            imgName = imgPath;
        }

        console.log(`loading image: ${imgName} ...`);

        try {
            let image: HTMLImageElement = new Image();
            image.src = imgPath;

            if (callbackDirectly) {
                if (isset(callback)) {
                    callback!(category!, imgName!, image);
                }
                return;
            }

            if (image.complete) {
                if (isset(callback)) {
                    callback!(category!, imgName!, image);
                }
                return;
            }

            image.onload = () => {
                if (isset(callback)) {
                    callback!(category!, imgName!, image);
                }
            };
        } catch (err) {
            alert(err);
        }
    }

    private setPlayerManImage() {
        this.images['player'] = this.images['players/player-man'];
        playerMgr.setPlayerIconHeight(this.images['player'].height / 4);
    }

    private setPlayerWomanImage() {
        this.images['player'] = this.images['players/player-woman'];
        playerMgr.setPlayerIconHeight(this.images['player'].height / 4);
    }

    setPlayerImage() {
        if (playerMgr.isPlayerMan()) {
            this.setPlayerManImage();
        }
        else {
            this.setPlayerWomanImage();
        }
    }
}


export let images = new ImageManager();


interface PlayerIcon {
    line: number;
    still: number;
    leftFoot: number;
    rightFoot: number;
}

let playerIcon: {
    [direction: string]: PlayerIcon;
} = {
    down: { line: 0, still: 0, leftFoot: 1, rightFoot: 3 },
    left: { line: 1, still: 0, leftFoot: 1, rightFoot: 3 },
    right: { line: 2, still: 0, leftFoot: 1, rightFoot: 3 },
    up: { line: 3, still: 0, leftFoot: 1, rightFoot: 3 }
};


export function getPlayerIconStateIdx(direction: string, state: string) {
    if (direction in playerIcon) {
        const stateIcons = playerIcon[direction];
        if (stateIcons.hasOwnProperty(state)) {
            return stateIcons[state as keyof PlayerIcon];
        }
    }
    throw new Error(`Invalid player icon state: ${direction}, ${state}`);
}

export function getPlayerIconLineOfDirection(direction: string) {
    if (direction in playerIcon) {
        return playerIcon[direction].line;
    }
    throw new Error(`Invalid player icon direction: ${direction}`);
}

export function getPlayerIconStillOfDirection(direction: string) {
    if (direction in playerIcon) {
        return playerIcon[direction].still;
    }
    throw new Error(`Invalid player icon direction: ${direction}`);
}

export function getPlayerIconLeftFootOfDirection(direction: string) {
    if (direction in playerIcon) {
        return playerIcon[direction].leftFoot;
    }
    throw new Error(`Invalid player icon direction: ${direction}`);
}

export function getPlayerIconRightFootOfDirection(direction: string) {
    if (direction in playerIcon) {
        return playerIcon[direction].rightFoot;
    }
    throw new Error(`Invalid player icon direction: ${direction}`);
}