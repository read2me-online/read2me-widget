class Read2MeAudioController {
    constructor(audioFileUrl) {
        this.audio = new Audio(audioFileUrl);
        this.isPlaying = false;
    }

    play() {
        this.audio.play();
        this.isPlaying = true;
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
    }

    stop() {
        this.setCurrentTime(0);
        this.isPlaying = false;
    }

    replay() {
        this.setCurrentTime(0);
        this.play();
    }

    isPlaying() {
        return this.isPlaying;
    }

    setCurrentTime(time) {
        this.audio.currentTime = time;
    }

    getCurrentTime() {
        return this.audio.getCurrentTime;
    }

    setPlaySpeed(speed) {
        this.audio.playbackRate = speed;
    }

    getPlaySpeed() {
        return this.audio.playbackRate;
    }

    getDuration() {
        return this.audio.duration;
    }
}