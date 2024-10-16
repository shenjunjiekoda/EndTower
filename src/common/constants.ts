// Constants

export const UNIT = 'px'

export const SPACE = 3;

// 地图块
export const BLOCK_WIDTH = 32;

// 块数量
export const CANVAS_BLOCK_WIDTH_CNT = 13;

// 宽高度
export const INIT_CANVAS_WIDTH = CANVAS_BLOCK_WIDTH_CNT * BLOCK_WIDTH;
export const INIT_CANVAS_WIDTH_WITH_2SPACE = SPACE * 2 + INIT_CANVAS_WIDTH;

// 适配宽度
export const ADAPT_WIDTH = INIT_CANVAS_WIDTH_WITH_2SPACE;

export const DEFAULT_BAR_WIDTH = 132;
export const WIDTH_THRESHOLD = INIT_CANVAS_WIDTH_WITH_2SPACE + DEFAULT_BAR_WIDTH;

// 默认边栏高度
export const BASE_LINEHEIGHT = 32;
export const DEFAULT_FONT_SIZE = 16;

// 透明度单步变化
export const OPACITY_STEP = 0.03;

export const ITEM_BAR_STYLE = '0.5px #fff solid';
export const BORDER_STYLE = '3px #fff solid';
export const TIP_FONT = '16px Arial';
export const TEXTBOX_FONT = '16px Verdana';

export const DEFAULT_TEXT_FONT = 'bold 20px Verdana';
export const NPC_TEXTBOX_FONT = 'bold 22px Verdana';
export const PLAYER_TEXTBOX_FONT = 'bold 22px Verdana';
export const CHOICE_TEXT_FONT = 'bold 15px Verdana';
export const ENCYCLOPEDIA_TEXT_FONT = 'bold 15px Verdana';
export const CONFIRMBOX_TEXT_FONT = 'bold 20px Verdana';
export const CONFIRMBOX_CONFIRM_TEXT_FONT = 'bold 17px Verdana';
export const CHOICEBOX_FONT = 'bold 17px Verdana';
export const PAGINATION_FONT = 'bold 15px Verdana';

// 显伤
export const DAMAGE_DISPLAY_FONT = 'bold 11px Arial';
// 帧率
export const FPS = 20;

// 颜色
export const BLACK = '#000000';
export const WHITE = '#FFFFFF';
export const RED = '#FF0000';
export const GREEN = '#00FF00';
export const LIGHT_GREEN = '#00ff11';
export const BLUE = '#0000FF';
export const YELLOW = '#FFFF00';
export const PINK = '#FF7F00';
export const ORANGE = '#FFA500';
export const PURPLE = '#800080';
export const GRAY = '#808080';
export const LIGHT_GRAY = '#D3D3D3';
export const DARK_GRAY = '#A9A9A9' ;
export const GOLD = '#FFD700';

export const DEFAULT_INTERVAL_MILLS = 30;
export const DEFAULT_TIMEOUT_MILLS = 30;
export const ITEM_TIP_TIMEOUT_MILLS = 1000;

export const MAX = 999999999

// 方向映射
export const DIRECTION_TO_POINT_MAP: { [key: string]: { x: number, y: number } } = {
    'up': { 'x': 0, 'y': -1 },
    'left': { 'x': -1, 'y': 0 },
    'down': { 'x': 0, 'y': 1 },
    'right': { 'x': 1, 'y': 0 }
};

export const POINT_TO_DIRECTION_MAP: { [key: number]: { [key: number]: string } } = { '0': { '1': 'down', '-1': 'up' }, '-1': { '0': 'left' }, '1': { '0': 'right' } };