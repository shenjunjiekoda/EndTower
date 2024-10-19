import { clone, importAll, isset, logExecutionTime } from "../common/util";
import { animateResource } from "./animatesData";

export interface AnimateSingleFrame {
    index: number;
    x: number;
    y: number;
    zoom: number;
    opacity: number;
    mirror: number;
    angle: number;
}

export interface AnimateResource {
    ratio: number;
    images: (string | HTMLImageElement | null)[];
    frame: number;
    frames: Array<Array<AnimateSingleFrame>>;
}

function createImageFromBase64(base64String: string): HTMLImageElement {
    const img = new Image(); // 创建一个新的 Image 对象
    img.src = base64String;  // 设置 src 属性为 Base64 字符串
    return img;
}

class AnimateManager {
    static instance: AnimateManager | null = null;
    private animateResource!: Record<string, AnimateResource>;

    private constructor() {
        AnimateManager.instance = this;
        this.animateResource = {};
    }

    static getInstance() {
        if (!AnimateManager.instance) {
            AnimateManager.instance = new AnimateManager();
        }
        return AnimateManager.instance;
    }

    get(animateName: string) {
        if (animateName in this.animateResource) {
            return this.animateResource[animateName];
        }
        throw new Error(`Animate ${animateName} not found`);
    }

    initAnimates() {
        const animateNames = Object.keys(animateResource);
        console.log(`init animates: ${animateNames}`);
        animateNames.forEach((animateName) => {
            console.log(`${this} importing animate: ${animateName} `);

            this.loadAnimate(animateName, (animateName, animate) => {
                console.log(`loaded animate: ${animateName}`, animate);
                this.animateResource[animateName] = animate;
            });
        });
    }

    loadAnimate(animateName: string, callback?: (animateName: string, animate: AnimateResource) => void) {
        console.log(`loading animate: ${animateName} ...`);

        try {

            let animate = clone(animateResource[animateName as keyof typeof animateResource]) as AnimateResource;
            console.log(`animate: ${animateResource[animateName as keyof typeof animateResource]}`, animate);
            for (let i = 0; i < animate.images.length; i++) {
                if (animate.images[i] && typeof animate.images[i] === "string") {
                    animate.images[i] = createImageFromBase64(animate.images[i] as string);
                }
            }
            if (isset(callback)) {
                callback!(animateName!, animate);
            }
        } catch (err) {
            alert(err);
        }
    }
}


export let animates: AnimateManager;

export function initAnimateManager() {
    animates = AnimateManager.getInstance();
}


