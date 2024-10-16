import { importAll, isset, logExecutionTime } from "../common/util";

class AudioManager {
    private audios: Record<string, HTMLAudioElement>;

    constructor() {
        this.audios = {};
        logExecutionTime(this.initAudios)();
    }

    get(audioName: string) {
        if (audioName in audios) {
            return this.audios[audioName];
        }
        throw new Error(`Audio ${audioName} not found`);
    }

    play(audioName: string) {
        this.get(audioName).play();
    }

    pause(audioName: string) {
        this.get(audioName).pause();
    }

    stop(audioName: string) {
        this.get(audioName).pause();
        this.get(audioName).currentTime = 0;
    }

    stopAll() {
        Object.values(this.audios).forEach((audio) => {
            audio.pause();
            audio.currentTime = 0;
        });
    }

    initAudios() {
        const audios = importAll(require.context('../../public/audios', false, /\.(png|jpe?g|gif)$/));
        audios.forEach((audio: any) => {
            console.log(`importing audio: ${audio}`);
            const path = audio as string;
            this.loadAudio(path, (audioName, audio) => {
                console.log(`loaded audio: ${audioName}`, audio);
                this.audios[audioName] = audio;
            });
        });
    }

    loadAudio(audioPath: string, callback?: (audioName: string, audio: HTMLAudioElement) => void) {
        let audioName = audioPath.split('/').pop();
        if (!isset(audioName)) {
            audioName = audioPath;
        }

        console.log(`loading audio: ${audioName} ...`);

        try {
            let audio: HTMLAudioElement = new Audio(audioPath);
            if (isset(callback)) {
                callback!(audioName!, audio);
            }
        } catch (err) {
            alert(err);
        }
    }
}


export let audios = new AudioManager();
