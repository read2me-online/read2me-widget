class Read2MePlayer {
    constructor(appId, url, cssSelectors = null, ignoreContentChange = false) {
        this.eventListeners = {};
        this.audio = new Audio();
        this.isPlaying = false;
        this.backend = new Read2MeBackend(appId, url, cssSelectors, ignoreContentChange, 'widget');
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

    addEventListener(event, callback) {
        this.eventListeners[event] = callback;
    }

    removeEventListener(event) {
        delete this.eventListeners[event];
    }

    makeApiCalls() {
        this.backend.get(
            // success
            (response) => {
                this.audio.src = response.result.audio_url;
            },

            // audio not found, create the audio
            () => {
                this.backend.create(
                    // audio created
                    (response) => {
                        this.audio.src = response.result.audio_url;
                    },
                    // failure, unable to create audio
                    (response) => {
                        console.warn(response);
                    }
                )
            },

            // error
            (response) => {
                console.warn(response);
            }
        );

        if (typeof this.eventListeners['ready'] === 'function')
            this.eventListeners['ready']();
    }
}