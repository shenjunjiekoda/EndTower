export function getDomNode(key: string) {
    return document.getElementById(key)!;
}

export function getDomNodesByClass(className: string): HTMLCollectionOf<HTMLElement> {
    return document.getElementsByClassName(className) as HTMLCollectionOf<HTMLElement>;
}

export function showDomNode(key: string) {
    getDomNode(key).style.display = 'block';
}

export function hideDomNode(key: string) {
    getDomNode(key).style.display = 'none';
}

export function setOpacity(key: string, opacity: number) {
    getDomNode(key).style.opacity = opacity.toString();
}

export function setNonOpaque(key: string) {
    setOpacity(key, 1);
}

export function setBackGroundColor(key: string, color: string) {
    getDomNode(key).style.background = color;
}

export function setInnerHtml(key: string, htmlStr: string) {
    getDomNode(key).innerHTML = htmlStr;
}