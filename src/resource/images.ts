import { callertrace, importAll, isset, log, logExecutionTime } from "../common/util";
import { playerMgr } from "../player/data";

const IMAGE_OUTPUT_DIR = 'images';

class ImageManager {
    private static instance: ImageManager;
    private images: Record<string, HTMLImageElement>;

    constructor() {
        if (ImageManager.instance) {
            throw new Error('Cannot create multiple ImageManager instances');
        }
        this.images = {};
    }

    static getInstance() {
        if (!ImageManager.instance) {
            ImageManager.instance = new ImageManager();
        }
        return ImageManager.instance;
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
        let key = `${category}/${imgName}.png`;
        if (key in this.images) {
            return this.images[key];
        }
        key = `${category}/${imgName}_1.png`;
        if (key in this.images) {
            return this.images[key];
        }
        throw new Error(`Image ${category}/${imgName}.png not found`);
    }

    getImages(category: string, imgName: string): HTMLImageElement[] {
        const key = `${category}/${imgName}.png`;
        if (key in this.images) {
            return [this.images[key]];
        }
        let i = 1;
        let result: HTMLImageElement[] = [];
        while (true) {
            const imgKey = `${category}/${imgName}_${i}.png`;
            if (imgKey in this.images) {
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
        console.log('loading images...');
        const imgs = importAll(require.context('../../public/images', true, /\.(png|jpe?g|gif)$/));
        console.log('all images: ', imgs);
        imgs.forEach(({ path, module }) => {
            // console.log(`importing image: ${path}`);
            this.loadImage(path, (category, imgName, image) => {
                const key = `${category}/${imgName}`;
                // console.log(`loaded image: ${key}`, image);
                this.images[key] = image;
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
        if (imgPath.startsWith('./')) {
            imgPath = imgPath.slice(2);
        }

        // console.log(`loading image: ${imgName} ...`);

        try {
            let image: HTMLImageElement = new Image();
            image.src = `${IMAGE_OUTPUT_DIR}/${imgPath}`;

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

    @log
    @callertrace
    private setPlayerManImage() {
        this.images['player'] = this.images['players/player-man.png'];
        playerMgr.setPlayerIconHeight(this.images['player'].height / 4);
    }

    @log
    @callertrace
    private setPlayerWomanImage() {
        this.images['player'] = this.images['players/player-woman.png'];
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


export let imageMgr: ImageManager;

export function initImageManager() {
    imageMgr = ImageManager.getInstance();
}


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