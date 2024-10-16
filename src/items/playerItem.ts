export interface PlayerItems {
    keys: Record<string, number>; // yellowKey, blueKey, redKey, greenKey
    constants: Record<string, number>;
    tools: Record<string, number>;
}

export function PlayerItemsToString(items: PlayerItems): string {
    return `yellowKey:${items.keys.yellowKey},blueKey:${items.keys.blueKey},redKey:${items.keys.redKey},greenKey:${items.keys.greenKey},constants:${JSON.stringify(items.constants)},tools:${JSON.stringify(items.tools)}`;
}