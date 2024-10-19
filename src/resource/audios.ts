import { callertrace, importAll, isset, log, logExecutionTime } from "../common/util";

const AUDIO_OUTPUT_DIR = 'audios'
class AudioManager {
    private audios: Record<string, HTMLAudioElement>;
    private audioContext: AudioContext | null;
    private audioBuffers: Record<string, AudioBuffer>;
    private sources: Record<string, AudioBufferSourceNode>;

    private static instance: AudioManager;

    static getInstance() {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }

    constructor() {
        if (AudioManager.instance) {
            throw new Error("Error: Instantiation failed: Use AudioManager.getInstance() instead of new.");
        }
        this.audios = {};
        this.audioBuffers = {};
        this.sources = {};
        this.audioContext = window.AudioContext ? new AudioContext() : null;
    }

    get(audioName: string): HTMLAudioElement {
        if (audioName in this.audios) {
            return this.audios[audioName];
        }
        throw new Error(`Audio ${audioName} not found`);
    }

    playBgm() {
        let randomNum = Math.floor(Math.random() * 3) + 1;
        this.play(`bgm${randomNum}.mp3`);
    }

    async play(audioName: string) {
        if (this.audioContext && audioName in this.audioBuffers) {
            try {
                const source = this.audioContext.createBufferSource();
                source.buffer = this.audioBuffers[audioName];
                source.connect(this.audioContext.destination);
                source.start(0);
                this.sources[audioName] = source;
                console.log(`Playing audio: ${audioName} using Web Audio API`);
            } catch (error) {
                console.error(`Error playing audio ${audioName} with Web Audio API:`, error);
            }
        } else {
            try {
                const audio = this.get(audioName);
                await audio.play();
                console.log(`Playing audio: ${audioName} using HTMLAudioElement`);
            } catch (error) {
                console.error(`Error playing audio ${audioName}:`, error);
            }
        }
    }

    pause(audioName: string) {
        if (audioName in this.sources) {
            this.sources[audioName].stop();
            delete this.sources[audioName];
        } else {
            this.get(audioName).pause();
        }
    }

    stop(audioName: string) {
        if (audioName in this.sources) {
            this.sources[audioName].stop();
            delete this.sources[audioName];
        } else {
            const audio = this.get(audioName);
            audio.pause();
            audio.currentTime = 0;
        }
    }

    stopAll() {
        Object.keys(this.sources).forEach(audioName => {
            this.sources[audioName].stop();
            delete this.sources[audioName];
        });

        Object.values(this.audios).forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
    }

    isAnyPlaying() {
        return Object.values(this.audios).some(audio => !audio.paused) ||
            Object.keys(this.sources).length > 0;
    }

    @log
    @callertrace
    async initAudios() {
        const audioList = importAll(require.context('../../public/audios', false, /\.(mp3|ogg)$/));
        for (const { path } of audioList) {
            const audioName = path.split('/').pop();
            if (audioName) {
                await this.loadAudio(path, audioName);
            }
        }
    }

    async loadAudio(audioPath: string, audioName: string) {
        console.log(`loading audio: ${audioName} ...`);

        if (this.audioContext) {
            try {
                const response = await fetch(`${AUDIO_OUTPUT_DIR}/${audioName}`);
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
                this.audioBuffers[audioName] = audioBuffer;
                console.log(`loaded audio: ${audioName} into Web Audio API`);
            } catch (error) {
                console.error(`Error loading audio ${audioName} with Web Audio API:`, error);
            }
        }

        try {
            const audio = new Audio(`${AUDIO_OUTPUT_DIR}/${audioName}`);
            this.audios[audioName] = audio;
            console.log(`loaded audio: ${audioName} into HTMLAudioElement`);
        } catch (err) {
            console.error(`Error loading audio ${audioName}:`, err);
        }
    }
}

export let audioMgr: AudioManager;

export function initAudioManager() {
    audioMgr = AudioManager.getInstance();
}
