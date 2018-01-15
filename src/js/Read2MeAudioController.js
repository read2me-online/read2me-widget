export default class Read2MeAudioController {
    /**
     * events param is an assoc object containing event_name => array(callbacks...)
     *
     * @param audioFileUrl
     * @param events
     */
    constructor(audioFileUrl, events) {
        this.audio = new Audio(audioFileUrl);
        this.canPlay = false;

        this.audio.addEventListener('canplay', () => {
            this.canPlay = true;
        });

        if (typeof events === 'object') {
            for (let eventName in events) {
                if (events.hasOwnProperty(eventName)) {
                    events[eventName].forEach(callback => {
                        this.audio.addEventListener(eventName, callback);
                    });
                }
            }
        }
    }

    isReadyToPlay() {
        return this.canPlay;
    }

    play() {
        this.audio.play();
    }

    pause() {
        this.audio.pause();
    }

    stop() {
        this.setCurrentTime(0);
    }

    replay() {
        this.setCurrentTime(0);
        this.play();
    }

    setCurrentTime(time) {
        if (time < 0)
            time = 0;

        if (time > this.getDuration())
            time = this.getDuration();

        this.audio.currentTime = time;
    }

    getCurrentTime() {
        return this.audio.currentTime;
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