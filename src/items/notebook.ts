import { callertrace, log } from "../common/util";

class NoteBook {
    public notes: Record<string, string[]> = {};

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

export let notebook = new NoteBook();