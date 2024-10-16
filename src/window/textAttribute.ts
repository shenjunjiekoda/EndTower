export interface TextAttribute {
    position: string;
    title: [number, number, number, number];
    background: [number, number, number, number];
    text: [number, number, number, number];
    bold: boolean;
}

const init_text_attribute: TextAttribute = {
    position: 'center',
    title: [255, 215, 0, 1],
    background: [0, 0, 0, 0.85],
    text: [255, 255, 255, 1],
    bold: false
};

export let textAttribute: TextAttribute;

export function initTextAttribute() {
    textAttribute = init_text_attribute;
}