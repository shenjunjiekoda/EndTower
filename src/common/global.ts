import { GameLevel } from "./config";
import { callertrace, isset, log, unshift } from "./util";


class Event {
    id?: string = undefined;
    data: Record<string, any> = {};
    callback?: Function = undefined;

    reset() {
        this.id = undefined;
        this.data = {};
        // this.callback = undefined;
    }
}

class CoreStatus {

    private static instance: CoreStatus;
    private started: boolean = false;
    private locked: boolean = false;
    private event: Event = new Event();
    private flags: Record<string, any> = {};
    private gameLevel: GameLevel = GameLevel.Normal;

    private constructor() {
        if (CoreStatus.instance) {
            throw new Error("Error: Instantiation failed: Use CoreStatus.getInstance() instead of new.");
        }
        CoreStatus.instance = this;
    }

    static getInstance() {
        if (!CoreStatus.instance) {
            CoreStatus.instance = new CoreStatus();
        }
        return CoreStatus.instance;
    }

    @callertrace
    setStarted(started: boolean = true) {
        this.started = started;
    }

    isStarted() {
        return this.started;
    }

    @callertrace
    lock() {
        this.locked = true;
    }

    @callertrace
    unlock() {
        this.locked = false;
    }

    isLocked() {
        return this.locked;
    }

    setGameLevel(level: GameLevel) {
        this.gameLevel = level;
    }

    getGameLevel() {
        return this.gameLevel;
    }

    isEventSet() {
        return isset(this.event.id);
    }

    @log
    @callertrace
    resetEvent() {
        this.event.reset();
    }

    setEventId(id: string) {
        this.event.id = id;
    }

    getEventId() {
        return this.event.id;
    }

    @log
    @callertrace
    setNewEventData(data: Record<string, any>) {
        this.event.data = data;
    }

    updateEventData(key: string, value: any) {
        this.event.data[key] = value;
    }

    hasEventData(key: string) {
        return key in this.event.data;
    }

    getEventData(key: string) {
        return this.event.data[key];
    }

    getEventDataCurrent() {
        return this.event.data.current;
    }

    setEventDataCurrent(current: any) {
        this.event.data.current = current;
    }

    hasEventDataSelection() {
        return 'selection' in this.event.data && isset(this.event.data.selection);
    }

    getEventDataSelection() {
        return this.event.data.selection;
    }

    @log
    setEventDataSelection(selection?: number) {
        console.log('before setEventDataSelection', this.event.data);
        // this.updateEventData('selection', selection);
        this.event.data.selection = selection;
        console.log('after setEventDataSelection', this.event.data);
    }

    incEventDataSelection(inc: number = 1) {
        this.event.data.selection += inc;
    }

    decEventDataSelection(dec: number = 1) {
        this.event.data.selection -= dec;
    }

    // getEventDataUI(): {
    //     text?: string, choices?: string[];
    // } | string {
    //     return this.event.data.ui;
    // }

    getEventDataUITextAndChoices(): {
        text?: string, choices?: string[];
    } {
        return this.event.data.ui;
    }

    getEventDataUIText(): string {
        return this.event.data.ui;
    }

    setEventDataUI(
        ui: { text?: string, choices?: string[] } | string
    ) {
        this.event.data.ui = ui;
    }

    hasEventDataList() {
        return 'list' in this.event.data && this.getEventDataList().length > 0;
    }

    getEventDataList() {
        return this.event.data['list']!;
    }

    unshiftEventDataList(item: any) {
        unshift(this.event.data['list'], item);
    }

    clearEventDataList() {
        this.event.data['list'] = [];
    }

    setEventDataList(list: any[]) {
        this.event.data['list'] = list;
    }

    shiftEventDataList() {
        return this.event.data['list'].shift();
    }

    setEventCallback(callback?: Function) {
        console.log('setEventCallback', callback);
        this.event.callback = callback;
    }

    hasEventCallback() {
        console.log('hasEventCallback', isset(this.event.callback), this.event.callback);
        return isset(this.event.callback);
    }

    getEventCallback() {
        console.log('getEventCallback', this.event.callback);
        return this.event.callback!;
    }

    getEvent() {
        return this.event;
    }

    hasFlag(key: string) {
        return key in this.flags;
    }

    setFlag(key: string, value: any) {
        this.flags[key] = value;
    }

    getFlag(key: string, defaultValue: any = undefined) {
        if (key in this.flags) {
            return this.flags[key];
        }
        return defaultValue;
    }

    getFlags() {
        return this.flags;
    }

    setFlags(flags: Record<string, any>) {
        this.flags = flags;
    }

}

export let core: CoreStatus;

export function initCoreStatus() {
    core = CoreStatus.getInstance();
}

