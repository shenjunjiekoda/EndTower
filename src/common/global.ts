import { GameLevel } from "./config";
import { callertrace, isset, log, unshift } from "./util";


class Event {
    id?: string = undefined;
    data: Record<string, any> = {};
    callback?: Function = undefined;

    reset() {
        this.id = undefined;
        this.data = {};
        this.callback = undefined;
    }
}

class CoreStatus {
    private started: boolean = false;
    private locked: boolean = false;
    private event: Event = new Event();
    private flags: Record<string, any> = {};
    private gameLevel: GameLevel = GameLevel.Normal;

    @callertrace
    setStarted(started: boolean = true) {
        core.started = started;
    }

    isStarted() {
        return core.started;
    }

    @callertrace
    lock() {
        core.locked = true;
    }

    @callertrace
    unlock() {
        core.locked = false;
    }

    isLocked() {
        return core.locked;
    }

    setGameLevel(level: GameLevel) {
        core.gameLevel = level;
    }

    getGameLevel() {
        return core.gameLevel;
    }

    isEventSet() {
        return isset(core.event.id);
    }

    resetEvent() {
        core.event.reset();
    }

    setEventId(id: string) {
        core.event.id = id;
    }

    getEventId() {
        return core.event.id;
    }

    @log
    @callertrace
    setNewEventData(data: Record<string, any>) {
        core.event.data = data;
    }

    updateEventData(key: string, value: any) {
        core.event.data[key] = value;
    }

    hasEventData(key: string) {
        return key in core.event.data;
    }

    getEventData(key: string) {
        return core.event.data[key];
    }

    getEventDataCurrent() {
        return core.event.data.current;
    }

    setEventDataCurrent(current: any) {
        core.event.data.current = current;
    }

    hasEventDataSelection() {
        return 'selection' in core.event.data && isset(core.event.data.selection);
    }

    getEventDataSelection() {
        return core.event.data.selection;
    }

    setEventDataSelection(selection: any) {
        core.event.data.selection = selection;
    }

    incEventDataSelection(inc: number = 1) {
        core.event.data.selection += inc;
    }

    decEventDataSelection(dec: number = 1) {
        core.event.data.selection -= dec;
    }

    getEventDataUI(): {
        text?: string, choices?: string[];
    } {
        return core.event.data.ui;
    }

    setEventDataUI(
        text?: string, choices?: string[]
    ) {
        core.event.data.ui = { text, choices };
    }

    hasEventDataList() {
        return 'list' in core.event.data && this.getEventDataList().length > 0;
    }

    getEventDataList() {
        return core.event.data['list']!;
    }

    unshiftEventDataList(item: any) {
        unshift(core.event.data['list'], item);
    }

    clearEventDataList() {
        core.event.data['list'] = [];
    }

    setEventDataList(list: any[]) {
        core.event.data['list'] = list;
    }

    shiftEventDataList() {
        return core.event.data['list'].shift();
    }

    setEventCallback(callback: Function) {
        core.event.callback = callback;
    }

    hasEventCallback() {
        return isset(core.event.callback);
    }

    getEventCallback() {
        return core.event.callback!;
    }

    getEvent() {
        return core.event;
    }

    hasFlag(key: string) {
        return key in core.flags;
    }

    setFlag(key: string, value: any) {
        core.flags[key] = value;
    }

    getFlag(key: string, defaultValue: any = undefined) {
        if (key in core.flags) {
            return core.flags[key];
        }
        return defaultValue;
    }

    getFlags() {
        return core.flags;
    }

    setFlags(flags: Record<string, any>) {
        core.flags = flags;
    }

}

export let core = new CoreStatus();

