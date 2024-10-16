import { config } from "../common/config";
import { MAX } from "../common/constants";
import { core } from "../common/global";
import { isset, toInt } from "../common/util";
import { getMapData } from "../floor/data";
import { playerMgr } from "../player/data";

export interface Enemy {
    id?: string;
    name: string;

    hp: number;
    attack: number;
    defense: number;
    money: number;
    experience: number;

    special: number;
    specialText?: string;

    damage?: number;
    bomb?: boolean;
    suckBloodRate?: number;
    n?: number;
}

class EnemiesManager {
    private enemys: Record<string, Enemy> = {};

    initEnemys() {
        this.enemys = {
            'greenSlime': { name: '绿头怪', hp: 50, attack: 20, defense: 1, money: 1, experience: 1, special: 0 },
            'redSlime': { name: '红头怪', hp: 70, attack: 15, defense: 2, money: 2, experience: 2, special: 0 },
            'blackSlime': { name: '青头怪', hp: 200, attack: 35, defense: 10, money: 5, experience: 5, special: 0 },
            'slimelord': { name: '怪王', hp: 700, attack: 250, defense: 125, money: 32, experience: 30, special: 0 },
            'bat': { name: '小蝙蝠', hp: 100, attack: 20, defense: 5, money: 3, experience: 3, special: 0 },
            'bigBat': { name: '大蝙蝠', hp: 150, attack: 65, defense: 30, money: 10, experience: 8, special: 0 },
            'redBat': { name: '红蝙蝠', hp: 550, attack: 160, defense: 90, money: 25, experience: 20, special: 0 },
            'vampire': { name: '冥灵魔王', hp: 30000, attack: 1700, defense: 1500, money: 250, experience: 220, special: 0 },
            'vampire2': { name: '冥灵魔王', hp: 45000, attack: 2550, defense: 2250, money: 312, experience: 275, special: 0 },
            'vampire3': { name: '冥灵魔王', hp: 60000, attack: 3400, defense: 3000, money: 390, experience: 343, special: 0 },
            'skeleton': { name: '骷髅人', hp: 110, attack: 25, defense: 5, money: 5, experience: 4, special: 0 },
            'skeletonSoilder': { name: '骷髅士兵', hp: 150, attack: 40, defense: 20, money: 8, experience: 6, special: 0 },
            'skeletonCaptain': { name: '骷髅队长', hp: 400, attack: 90, defense: 50, money: 15, experience: 12, special: 0 },
            'ghostSkeleton': { name: '冥队长', hp: 2500, attack: 900, defense: 850, money: 84, experience: 75, special: 0 },
            'zombie': { name: '兽人', hp: 300, attack: 75, defense: 45, money: 13, experience: 10, special: 0 },
            'zombieKnight': { name: '兽人武士', hp: 900, attack: 450, defense: 330, money: 50, experience: 50, special: 0 },
            'rock': { name: '石头人', hp: 500, attack: 115, defense: 65, money: 15, experience: 15, special: 0 },
            'slimeMan': { name: '影子战士', hp: 3100, attack: 1150, defense: 1050, money: 92, experience: 80, special: 0 },
            'bluePriest': { name: '初级法师', hp: 125, attack: 50, defense: 25, money: 10, experience: 7, special: 0 },
            'redPriest': { name: '高级法师', hp: 100, attack: 200, defense: 110, money: 30, experience: 25, special: 0 },
            'brownWizard': { name: '麻衣法师', hp: 250, attack: 120, defense: 70, money: 20, experience: 17, special: 22, damage: 100 },
            'redWizard': { name: '红衣法师', hp: 500, attack: 400, defense: 260, money: 47, experience: 45, special: 22, damage: 300 },
            'yellowGuard': { name: '初级卫兵', hp: 450, attack: 150, defense: 90, money: 22, experience: 19, special: 0 },
            'blueGuard': { name: '中级卫兵', hp: 1250, attack: 500, defense: 400, money: 55, experience: 55, special: 0 },
            'redGuard': { name: '高级卫兵', hp: 1500, attack: 560, defense: 460, money: 60, experience: 60, special: 0 },
            'swordsman': { name: '双手剑士', hp: 1200, attack: 620, defense: 520, money: 65, experience: 75, special: 0 },
            'soldier': { name: '冥战士', hp: 2000, attack: 680, defense: 590, money: 70, experience: 65, special: 0 },
            'yellowKnight': { name: '金骑士', hp: 850, attack: 350, defense: 200, money: 45, experience: 40, special: 0 },
            'redKnight': { name: '金队长', hp: 900, attack: 750, defense: 650, money: 77, experience: 70, special: 0 },
            'darkKnight': { name: '灵武士', hp: 1200, attack: 980, defense: 900, money: 88, experience: 75, special: 0 },
            'blackKing': { name: '黑衣魔王', hp: 1000, attack: 500, defense: 0, money: 1000, experience: 1000, special: 0, 'bomb': false },
            'yellowKing': { name: '黄衣魔王', hp: 0, attack: 0, defense: 0, money: 0, experience: 0, special: 0 },
            'greenKing': { name: '青衣武士', hp: 0, attack: 0, defense: 0, money: 0, experience: 0, special: 0 },
            'blueKnight': { name: '蓝骑士', hp: 100, attack: 120, defense: 0, money: 9, experience: 0, special: 8 },
            'goldSlime': { name: '黄头怪', hp: 0, attack: 0, defense: 0, money: 0, experience: 0, special: 0 },
            'poisonSkeleton': { name: '紫骷髅', hp: 0, attack: 0, defense: 0, money: 0, experience: 0, special: 0 },
            'poisonBat': { name: '紫蝙蝠', hp: 100, attack: 120, defense: 0, money: 14, experience: 0, special: 13 },
            'steelRock': { name: '铁面人', hp: 0, attack: 0, defense: 0, money: 0, experience: 0, special: 0 },
            'skeletonPriest': { name: '骷髅法师', hp: 100, attack: 100, defense: 0, money: 0, experience: 0, special: 18, suckBloodRate: 20 },
            'skeletonKing': { name: '骷髅王', hp: 0, attack: 0, defense: 0, money: 0, experience: 0, special: 0 },
            'skeletonWizard': { name: '骷髅巫师', hp: 0, attack: 0, defense: 0, money: 0, experience: 0, special: 0 },
            'redSkeletonCaption': { name: '骷髅武士', hp: 0, attack: 0, defense: 0, money: 0, experience: 0, special: 0 },
            'badHero': { name: '迷失勇者', hp: 0, attack: 0, defense: 0, money: 0, experience: 0, special: 0 },
            'deenemy': { name: '魔神武士', hp: 0, attack: 0, defense: 0, money: 0, experience: 0, special: 0 },
            'deenemyPriest': { name: '魔神法师', hp: 0, attack: 0, defense: 0, money: 0, experience: 0, special: 0 },
            'goldHornSlime': { name: '金角怪', hp: 0, attack: 0, defense: 0, money: 0, experience: 0, special: 0 },
            'redKing': { name: '红衣魔王', hp: 15000, attack: 1000, defense: 1000, money: 100, experience: 100, special: 0 },
            'redKing2': { name: '红衣魔王', hp: 20000, attack: 1333, defense: 1333, money: 133, experience: 133, special: 0 },
            'whiteKing': { name: '白衣武士', hp: 1300, attack: 300, defense: 150, money: 40, experience: 35, special: 11, suckBloodRate: 1 / 4 },
            'blackMagician': { name: '灵法师', hp: 1500, attack: 830, defense: 730, money: 80, experience: 70, special: 11, suckBloodRate: 1 / 3 },
            'silverSlime': { name: '银头怪', hp: 100, attack: 120, defense: 0, money: 15, experience: 0, special: 14 },
            'swordEmperor': { name: '剑圣', hp: 0, attack: 0, defense: 0, money: 0, experience: 0, special: 0 },
            'whiteHornSlime': { name: '尖角怪', hp: 0, attack: 0, defense: 0, money: 0, experience: 0, special: 0 },
            'badPrincess': { name: '痛苦魔女', hp: 0, attack: 0, defense: 0, money: 0, experience: 0, special: 0 },
            'badFairy': { name: '黑暗小精灵', hp: 0, attack: 0, defense: 0, money: 0, experience: 0, special: 0 },
            'grayPriest': { name: '中级法师', hp: 0, attack: 0, defense: 0, money: 0, experience: 0, special: 0 },
            'redSwordsman': { name: '剑王', hp: 100, attack: 120, defense: 0, money: 7, experience: 0, special: 6, 'n': 8 },
            'whiteGhost': { name: '水银战士', hp: 0, attack: 0, defense: 0, money: 0, experience: 0, special: 0 },
            'poisonZombie': { name: '绿兽人', hp: 100, attack: 120, defense: 0, money: 13, experience: 0, special: 12 },
            // 'magicDragon': { name: '魔龙', hp: 99999, attack: 9999, defense: 5000, money: 0, experience: 0, special: 0 },
            'magicDragon': { name: 'END', hp: 50000, attack: 4000, defense: 3500, money: 0, experience: 0, special: 0 },
            'octopus': { name: '血影', hp: 99999, attack: 5000, defense: 4000, money: 0, experience: 0, special: 0 },
            'darkFairy': { name: '小精灵', hp: 0, attack: 0, defense: 0, money: 0, experience: 0, special: 0 },
            'greenKnight': { name: '强盾骑士', hp: 0, attack: 0, defense: 0, money: 0, experience: 0, special: 0 },
        };

    }

    hasEnemyId(enemyId: string): boolean {
        return enemyId in this.enemys;
    }
    getEnemyByID(enemyId: string): Enemy {
        return this.enemys[enemyId];
    }

    getEnemys() {
        return this.enemys;
    }

    calDamage(enemy: Enemy, player_hp: number, player_attack: number, player_defense: number) {
        console.log('cal damage', enemy, player_hp, player_attack, player_defense);
        let enemy_hp = enemy.hp, enemy_atk = enemy.attack, enemy_def = enemy.defense, enemy_special = enemy.special;

        if (this.isSpecialEnemy(enemy_special, 20) && !playerMgr.hasItem("cross"))
            // 如果是无敌属性，且勇士未持有十字架
            return 999999999; // 返回无限大

        let initDamage = 0; // 战前伤害

        // 吸血
        if (this.isSpecialEnemy(enemy_special, 11)) {
            let vampireDamage = toInt(player_hp * enemy.suckBloodRate!);
            enemy_hp += vampireDamage;
            initDamage += vampireDamage;
        }

        // 模仿
        if (this.isSpecialEnemy(enemy_special, 10)) {
            enemy_atk = player_attack;
            enemy_def = player_defense;
        }

        // 魔攻
        if (this.isSpecialEnemy(enemy_special, 2)) {
            player_defense = 0;
        }

        // 坚固
        if (this.isSpecialEnemy(enemy_special, 3) && enemy_def < player_attack - 1) {
            enemy_def = player_attack - 1;
        }

        if (player_attack <= enemy_def) {
            return MAX;
        }

        let per_damage = enemy_atk - player_defense;
        if (per_damage < 0) {
            per_damage = 0;
        }

        // 2连击 & 3连击 & N连击
        if (this.isSpecialEnemy(enemy_special, 4)) {
            per_damage *= 2;
        }
        if (this.isSpecialEnemy(enemy_special, 5)) {
            per_damage *= 3;
        }
        if (this.isSpecialEnemy(enemy_special, 6)) per_damage *= (enemy.n || 4);

        let counterDamage = 0;
        // 反击
        if (this.isSpecialEnemy(enemy_special, 8)) {
            counterDamage += config.counterAttack * player_attack;
        }

        // 先攻
        if (this.isSpecialEnemy(enemy_special, 1)) {
            initDamage += per_damage;
        }

        // 破甲
        if (this.isSpecialEnemy(enemy_special, 7)) {
            initDamage += config.breakDefenseRate * player_defense;
        }

        let turn = toInt((enemy_hp - 1) / (player_attack - enemy_def));

        return Math.max(0, initDamage + turn * per_damage + (turn + 1) * counterDamage);
    }


    getExtraDamage(enemy: Enemy) {
        let extra_damage = 0;
        if (this.isSpecialEnemy(enemy.special, 22)) {
            extra_damage += enemy.damage || 0;
        }

        return extra_damage;
    }


    getDamage(enemyId: string): number {
        const enemy = this.enemys[enemyId];
        const damage = this.calDamage(enemy, playerMgr.getPlayerHP(), playerMgr.getPlayerAttack(), playerMgr.getPlayerDefense());
        return damage + this.getExtraDamage(enemy);
    }

    // 判断是否含有某特殊属性 | judge if has special attribute
    isSpecialEnemy(special: any[] | number, test: any): boolean {

        if (special instanceof Array) {
            return special.indexOf(test) >= 0;
        }

        return typeof special == 'number' && special != 0 && (special % 100 == test || this.isSpecialEnemy(toInt(special / 100), test));;
    }

    updateEnemy(): void {
        const flag = core.getFlag('updateEnemy');
        switch (flag) {
            case 1:
                this.enemys.ghostSkeleton.hp = 3333;
                this.enemys.ghostSkeleton.attack = 1200;
                this.enemys.ghostSkeleton.defense = 1133;
                this.enemys.ghostSkeleton.money = 112;
                this.enemys.ghostSkeleton.experience = 100;

                this.enemys.darkKnight.hp = 1600;
                this.enemys.darkKnight.attack = 1306;
                this.enemys.darkKnight.defense = 1200;
                this.enemys.darkKnight.money = 117;
                this.enemys.darkKnight.experience = 100;

                this.enemys.blackMagician.hp = 2000;
                this.enemys.blackMagician.attack = 1106;
                this.enemys.blackMagician.defense = 973;
                this.enemys.blackMagician.money = 106;
                this.enemys.blackMagician.experience = 93;
                break;
            case 2:
                this.enemys.redKing2.hp = 30000;
                this.enemys.redKing2.attack = 2666;
                this.enemys.redKing2.defense = 2666;
                this.enemys.redKing2.money = 166;
                this.enemys.redKing2.experience = 166;

                this.enemys.ghostSkeleton.hp = 4999;
                this.enemys.ghostSkeleton.attack = 2400;
                this.enemys.ghostSkeleton.defense = 2266;
                this.enemys.ghostSkeleton.money = 140;
                this.enemys.ghostSkeleton.experience = 125;

                // 更新darkKnight的属性
                this.enemys.darkKnight.hp = 2400;
                this.enemys.darkKnight.attack = 1960;
                this.enemys.darkKnight.defense = 1800;
                this.enemys.darkKnight.money = 156;
                this.enemys.darkKnight.experience = 133;

                // 更新blackMagician的属性
                this.enemys.blackMagician.hp = 3000;
                this.enemys.blackMagician.attack = 1660;
                this.enemys.blackMagician.defense = 1460;
                this.enemys.blackMagician.money = 143;
                this.enemys.blackMagician.experience = 125;
        }
    }


    // 特殊属性的描述
    getSpecialText(enemyId?: string): string[] {
        if (!isset(enemyId))
            return [];

        const enemy = this.enemys[enemyId!];
        let special = enemy.special;
        let text: string[] = [];
        if (this.isSpecialEnemy(special, 1))
            text.push("先攻");
        if (this.isSpecialEnemy(special, 2))
            text.push("魔攻");
        if (this.isSpecialEnemy(special, 3))
            text.push("坚固");
        if (this.isSpecialEnemy(special, 4))
            text.push("2连击");
        if (this.isSpecialEnemy(special, 5))
            text.push("3连击");
        if (this.isSpecialEnemy(special, 6))
            text.push((enemy.n || 4) + "连击");
        if (this.isSpecialEnemy(special, 7))
            text.push("破甲");
        if (this.isSpecialEnemy(special, 8))
            text.push("反击");
        if (this.isSpecialEnemy(special, 9))
            text.push("净化");
        if (this.isSpecialEnemy(special, 10))
            text.push("模仿");
        if (this.isSpecialEnemy(special, 11))
            text.push("吸血");
        if (this.isSpecialEnemy(special, 12))
            text.push("中毒");
        if (this.isSpecialEnemy(special, 13))
            text.push("衰弱");
        if (this.isSpecialEnemy(special, 14))
            text.push("诅咒");
        if (this.isSpecialEnemy(special, 15))
            text.push("领域");
        if (this.isSpecialEnemy(special, 16))
            text.push("夹击");
        if (this.isSpecialEnemy(special, 17))
            text.push("仇恨");
        if (this.isSpecialEnemy(special, 18))
            text.push("阻击");
        if (this.isSpecialEnemy(special, 19))
            text.push("自爆");
        if (this.isSpecialEnemy(special, 20))
            text.push("无敌");
        if (this.isSpecialEnemy(special, 21))
            text.push("退化");
        if (this.isSpecialEnemy(special, 22))
            text.push("固伤");
        return text;
    }


    getCurrentEnemys(floorId: number = playerMgr.getFloorId()) {
        let curEnemies: Enemy[] = [];
        let used: Record<string, boolean> = {};

        let mapBlocks = getMapData(floorId).blocks;
        for (let i = 0; i < mapBlocks.length; i++) {
            const block = mapBlocks[i];
            if (isset(block.event) && !(isset(block.enable) && !(block.enable!)) && block.event?.type == 'enemys') {
                let enemyId = block.event.id!;
                if (enemyId in used)
                    continue;

                let enemy = this.getEnemyByID(enemyId);
                let enemy_hp = enemy.hp, enemy_atk = enemy.attack, enemy_def = enemy.defense;
                // 坚固
                if (this.isSpecialEnemy(enemy.special, 3) && enemy_def < playerMgr.getPlayerAttack() - 1)
                    enemy_def = playerMgr.getPlayerAttack() - 1;

                if (this.isSpecialEnemy(enemy.special, 10)) {
                    enemy_atk = playerMgr.getPlayerAttack();
                    enemy_def = playerMgr.getPlayerDefense();
                }

                let specialTexts = this.getSpecialText(enemyId);
                let specialText = "";
                if (specialTexts.length >= 3)
                    specialText = "多属性...";
                else
                    specialText = specialTexts.join("  ");

                curEnemies.push({
                    id: enemyId,
                    name: enemy.name,
                    hp: enemy_hp,
                    attack: enemy_atk,
                    defense: enemy_def,
                    money: enemy.money,
                    experience: enemy.experience,
                    special: enemy.special,
                    specialText: specialText,
                    damage: this.getDamage(enemyId),
                });

                used[enemyId] = true;
            }
        }

        curEnemies.sort((a, b) => {
            if (a.damage == b.damage) {
                return a.money - b.money;
            }
            return a.damage! - b.damage!;
        });
        return curEnemies;
    }


    // 获得每个特殊属性的说明
    getSpecialHint(enemy: Enemy, special?: number): string | string[] {
        if (!isset(special)) {
            let hints: string[] = [];
            for (var i = 1; i < 100; i++) {
                if (this.isSpecialEnemy(enemy.special, i)) {
                    let hint = this.getSpecialHint(enemy, i) as string;
                    if (hint != '') {
                        hints.push(hint);
                    }
                }
            }
            return hints;
        }

        switch (special) {
            case 1: return "先攻：怪物首先攻击";
            case 2: return "魔攻：怪物无视勇士的防御";
            case 3: return "坚固：勇士每回合最多只能对怪物造成1点伤害";
            case 4: return "2连击：怪物每回合攻击2次";
            case 5: return "3连击：怪物每回合攻击3次";
            case 6: return (enemy.n || 4) + "连击： 怪物每回合攻击" + (enemy.n || 4) + "次";
            case 7: return "破甲：战斗前，怪物附加角色防御的" + toInt(100 * config.breakDefenseRate) + "%作为伤害";
            case 8: return "反击：战斗时，怪物每回合附加角色攻击的" + toInt(100 * config.counterAttack) + "%作为伤害，无视角色防御";
            case 10: return "模仿：怪物的攻防和勇士攻防相等";
            case 11: return "吸血：战斗前，怪物首先吸取角色的" + toInt(100 * enemy.suckBloodRate!) + "%生命作为伤害，并把伤害数值加到自身生命上";
            case 12: return "中毒：战斗后，勇士陷入中毒状态，每一步损失生命" + config.poisonDamage + "点";
            case 13: return "衰弱：战斗后，勇士陷入衰弱状态，攻防暂时下降" + config.weakValue + "点";
            case 14: return "诅咒：战斗后，勇士陷入诅咒状态，战斗无法获得金币和经验";
            case 15: return "领域：经过怪物周围块时自动减生命" + (enemy.suckBloodRate || 0) + "点";
            case 16: return "夹击：经过两只相同的怪物中间，勇士生命值变成一半";
            case 18: return "阻击：经过怪物的十字领域时自动减生命" + (enemy.suckBloodRate || 0) + "点，同时怪物后退一格";
            case 19: return "自爆：战斗后勇士的生命值变成1";
            case 20: return "无敌：勇士无法打败怪物，除非拥有十字架";
            case 22: return "固伤：战斗前，怪物对勇士造成" + (enemy.damage || 0) + "点固定伤害，无视勇士魔防。";
            default: break;
        }
        return ""
    }
}

export let enemiesMgr = new EnemiesManager();