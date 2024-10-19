export interface Shop {
    id: string; // shop id
    name: string; // shop name
    icon: string; // shop icon
    textInFastList: string; // text in fast list
    use: string // use 'money' or 'experience'
    need: string; // need 'money' or 'experience' expr
    text: string, // shop text
    choices: { text: string, need?: string, effect: string }[]; // shop choices
    times: number;
};

let moneyShop1: Shop = {
    id: "moneyShop1",
    name: "man加油站",
    icon: "blueShop",
    textInFastList: "3Fman加油站",
    use: "money",
    need: "20+1*times",
    text: "勇敢的man啊，给我${need}金币就可以：",
    choices: [
        { text: "生命+800", effect: "status:hp+=800" },
        { text: "攻击+4", effect: "status:attack+=4" },
        { text: "防御+4", effect: "status:defense+=4" },
    ],
    times: 0
};
let expShop1: Shop = {
    id: "expShop1",
    name: "经验老毕登",
    icon: "man",
    textInFastList: "5F经验老毕登",
    use: "experience",
    need: "-1",
    text: "勇敢的man啊，给我若干经验就可以：",
    choices: [
        { text: "等级+1", need: "100", effect: "status:level+=1;status:hp+=1000;status:attack+=8;status:defense+=8" },
        { text: "攻击+6", need: "33", effect: "status:attack+=6" },
        { text: "防御+6", need: "33", effect: "status:defense+=6" },
    ],
    times: 0
};
let keyShop: Shop = {
    id: "keyShop",
    name: "钥匙老毕登",
    icon: "woman",
    textInFastList: "5F钥匙老毕登",
    use: "money",
    need: "-1",
    text: "勇敢的man啊，给我若干金币就可以：",
    choices: [
        { text: "黄钥匙", need: "10", effect: "item:yellowKey+=1" },
        { text: "蓝钥匙", need: "50", effect: "item:blueKey+=1" },
        { text: "红钥匙", need: "100", effect: "item:redKey+=1" },
        { text: "绿钥匙", need: "150", effect: "item:greenKey+=1" },
    ],
    times: 0
};
let moneyShop2: Shop = {
    id: "moneyShop2",
    name: "man超强加油站",
    icon: "blueShop",
    textInFastList: "11Fman超强加油站",
    use: "money",
    need: "85+1*times",
    text: "勇敢的man啊，给我${need}金币就可以：",
    choices: [
        { text: "生命+4000", effect: "status:hp+=4000" },
        { text: "攻击+20", effect: "status:attack+=20" },
        { text: "防御+20", effect: "status:defense+=20" },
    ],
    times: 0
};

let expShop2: Shop = {
    id: "expShop2", // 商店唯一ID
    name: "经验超大老毕登",
    icon: "man",
    textInFastList: "13F经验超大老毕登",
    use: "experience",
    need: "-1",
    text: "勇敢的man啊，给我若干经验就可以：",
    choices: [
        { text: "等级+3", need: "275", effect: "status:level+=3;status:hp+=3000;status:attack+=22;status:defense+=22" },
        { text: "攻击+18", need: "95", effect: "status:attack+=18" },
        { text: "防御+18", need: "95", effect: "status:defense+=18" },
    ],
    times: 0
};

class ShopManager {
    static instance: ShopManager;
    private shops: Record<string, Shop> = {};
    private shopVisited!: Record<string, boolean>;
    constructor() {
        if (ShopManager.instance) {
            throw new Error("Error: Instantiation failed: Use ShopManager.getInstance() instead of new.");
        }
        ShopManager.instance = this;
        this.initShops();
        this.shopVisited = {};
    }

    static getInstance() {
        if (!ShopManager.instance) {
            ShopManager.instance = new ShopManager();
        }
        return ShopManager.instance;
    }

    initShops() {
        [moneyShop1, expShop1, keyShop, moneyShop2, expShop2].forEach(shop => {
            this.shops[shop.id] = { ...shop };
        });
    }
    getShopIds() {
        return Object.keys(this.shops);
    }

    getShopById(id: string): Shop {
        return this.shops[id];
    }

    setShopById(id: string, shop: Shop) {
        this.shops[id] = shop;
    }

    getShopSortedIndex(id: string) {
        return Object.keys(this.shops).sort().indexOf(id);
    }

    getShopBySortedIndex(index: number) {
        Object.keys(this.shops).sort().forEach((id, i) => {
            if (i === index) {
                return this.shops[id];
            }
        });
        return undefined;
    }

    shopVisitedBefore(shopId: string) {
        return shopId in this.shopVisited && this.shopVisited[shopId];
    }

    setShopVisited(shopId: string) {
        this.shopVisited[shopId] = true;
    }

    getShopVisited() {
        return this.shopVisited;
    }

}

export let shopMgr: ShopManager;

export function initShopManager() {
    shopMgr = ShopManager.getInstance();
}