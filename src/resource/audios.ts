import { callertrace, importAll, isset, log, logExecutionTime } from "../common/util";

const AUDIO_OUTPUT_DIR='audios'

class AudioManager {
    private audios: Record<string, HTMLAudioElement>;

    constructor() {
        this.audios = {};
    }

    get(audioName: string) {
        if (audioName in this.audios) {
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

    @log
    @callertrace
    initAudios() {
        const audioList = importAll(require.context('../../public/audios', false, /\.(mp3|ogg)$/));
        audioList.forEach(({ path, module }) => {
            console.log(`importing audio  ${path}`);
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
            let audio: HTMLAudioElement = new Audio(`${AUDIO_OUTPUT_DIR}/${audioName}`);
            if (isset(callback)) {
                callback!(audioName!, audio);
            }
        } catch (err) {
            alert(err);
        }
    }
}


export let audioMgr = new AudioManager();
