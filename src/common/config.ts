import { PlayerData } from "player/data";
import { clone } from "./util";

// 静态常量配置
export const staticConfig = {
    gameVersion: '0.0.1',
    startText: ["欢迎来到终结塔！写给我宝贝的游戏，请多指教！希望你玩的开心！",
        "故事背景:\n\n    铁达尼号王国是一个充满魔法与奇幻的国家。某天国王告知你：铁达尼号王国的公主——艾达突然失踪了，并拜托你营救公主。目击者声称：一个神秘的魔王带走了公主，并进入了有着“终结(End)”之称的塔。\n    此塔是一个诅咒之地，任何试图靠近的人都会被一种神秘的力量阻挡。你与公主有着深厚的情感联系，就算不是国王的请求，你也会毫不犹豫地前往“终结塔”救人。\n    而当你正靠近塔时，一股强大的魔力使你失去了意识...",
        "注意:\n    玩家有血条、攻击、防御、金币（用于购物、加强能力）、经验值（用于升级加血），想要打败敌人，玩家的攻击值至少要大于对方的防御值。塔里有各种颜色的门，可以通过不同颜色的钥匙打开。另外塔内还有各种道具可以获取。暂时打不过的敌人或许可以之后再尝试！祝你玩得愉快！"
    ],
    initFloorId: 0
};

export enum GameLevel {
    Easy = "easy",
    Normal = "normal",
    Hard = "hard"
}

export function parseGameLevel(level: string): GameLevel | null {
    switch (level.toLowerCase()) {
        case GameLevel.Easy:
            return GameLevel.Easy;
        case GameLevel.Normal:
            return GameLevel.Normal;
        case GameLevel.Hard:
            return GameLevel.Hard;
        default:
            return null;
    }
}


// 全局配置 | Global configuration
const init_config = {
    // 难度等级 | Difficulty level
    level: GameLevel.Normal,
    // 音效开关 | Sound switch
    soundEnabled: true,
    // 自动寻路开关 | Auto route switch
    autoRouteEnabled: true,
    // png动画速度 | Speed of png animation
    pngAnimateSpeed: 500,
    // 经过血网受到的伤害 | Damage taken through blood net
    lavaDamage: 100,
    // 中毒后每步受到的伤害 | Damage taken after poisoning
    poisonDamage: 10,
    // 衰弱状态下每步受到的伤害 | Damage taken in weakened state
    weakenDamage: 20,
    // 衰弱状态减攻防的数值 | Value of attack and defense decreased in weakened state
    weakValue: 10,
    // 红宝石加攻击的数值 | Value of attack increased by red jewel
    redJewel: 3,
    // 蓝宝石加防御的数值 | Value of defense increased by blue jewel
    blueJewel: 3,
    // 绿宝石加暴击率的百分比 | Value of critical rate increased by green jewel
    greenJewel: 5,
    // 红血瓶加血数值 | Value of hp increased by red potion
    redPotion: 200,
    // 蓝血瓶加血数值 | Value of hp increased by blue potion
    bluePotion: 200,
    // 黄血瓶加血数值 | Value of hp increased by yellow potion
    yellowPotion: 500,
    // 绿血瓶加血数值 | Value of hp increased by green potion
    greenPotion: 800,
    // 默认装备折断的剑的攻击力 | Default attack of broken sword
    sword0: 0,
    // 默认装备折断的盾的防御力 | Default defense of broken shield
    shield0: 0,
    // 铁剑加攻数值 | Iron sword add attack value
    sword1: 10,
    // 默认装备折断的盾的防御力 | Iron shield add defense value
    shield1: 10,
    // 银剑加攻数值 | Silver sword add attack value
    sword2: 20,
    // 银盾加防数值 | Silver shield add defense value
    shield2: 20,
    // 骑士剑加攻数值 | Knight sword add attack value
    sword3: 70,
    // 骑士盾加防数值 | Knight shied add defense value
    shield3: 85,
    // 圣剑加攻数值 | Holy sword add attack value
    sword4: 80,
    // 圣盾加防数值 | Holy shield add defense value
    shield4: 80,
    // 神圣剑加攻数值 | God holy sword add attack value
    sword5: 150,
    // 神圣盾加防数值 | God holy shied add defense value
    shield5: 190,
    // 金钱袋加金币的数值 | `Money pocket` add `money` value
    moneyPocket: 300,
    // 破甲的比例 | Break defense rate
    // 战斗前，怪物附加角色防御的x%作为伤害 | Before fight, monsters add x% of the player's defense as damage
    breakDefenseRate: 0.9,
    // 反击的比例 | Counter attack rate
    // 战斗时，怪物每回合附加角色攻击的x%作为伤害，无视角色防御 | During fight, monsters add x% of the player's attack as damage, ignoring the player's defense
    counterAttack: 0.1,

    // 大黄门钥匙是否为钥匙盒
    bigKeyIsBox: true,
    // 破墙镐是否可以破坏四周的墙
    pickaxeFourDirections: false,
    // 炸弹是否可以炸掉四周的怪物
    bombFourDirections: false,
    // 是否直接装备上武器和防具
    equipmentDirectly: true,

    // 地图阻击显伤
    displayExtraDamage: false,
    // 地图怪物显伤 
    displayEnemyDamage: true,

    // 开局显示战斗动画确认
    showBattleAnimateConfirm: true,
    // 战斗动画开关
    showBattleAnimate: false,

    // 飞行时是否可以需要靠楼梯
    transportNearStair: false,
    // 是否开启地图查看功能
    enableViewMaps: true,

};

export let config = { ...init_config };

export function initGlobalConfig() {
    config = { ...init_config };
}
