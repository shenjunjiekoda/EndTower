import { callertrace, log } from "../common/util";

class NoteBook {
    public notes: Record<string, string[]> = {};
    private static instance: NoteBook;

    private constructor() {
        if (NoteBook.instance) {
            throw new Error("NoteBook is a singleton class");
        }
        NoteBook.instance = this;
    }

    static getInstance() {
        if (!NoteBook.instance) {
            NoteBook.instance = new NoteBook();
        }
        return NoteBook.instance;
    }

    @log
    @callertrace
    addNote(name: string, text: string) {
        if (name in this.notes) {
            this.notes[name].push(text);
        } else {
            this.notes[name] = [text];
        }
    }

    @log
    @callertrace
    addNotes(name: string, texts: string[]) {
        if (name in this.notes) {
            this.notes[name].push(...texts);
        } else {
            this.notes[name] = [...texts];
        }
    }

    setNotes(notes: Record<string, string[]>) {
        this.notes = notes;
    }

    getNotes() {
        return this.notes;
    }
}

export let notebook: NoteBook;

export function initNotebook() {
    notebook = NoteBook.getInstance();
}