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
        if (time < 0)
            time = 0;

        if (time > this.getDuration())
            time = this.getDuration();

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

    rewindForXSeconds(x) {
        let result = this.audio.currentTime - x;

        if (result < 0)
            result = 0;

        this.audio.currentTime = result;
    }

    forwardForXSeconds(x) {
        let result = this.audio.currentTime + x;

        if (result > this.getDuration())
            result = this.getDuration();

        this.audio.currentTime = result;
    }
}