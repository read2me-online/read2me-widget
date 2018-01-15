export default class Read2MeAudioEvents {
    constructor(widgetPlayerInstance) {
        this.widgetPlayerInstance = widgetPlayerInstance;
    }

    getAll() {
        let events = {
            'canplay': [],
            'playing': [],
            'ended': [],
            'stalled': [],
            'timeupdate': []
        };

        if (this.widgetPlayerInstance.autoplay) {
            events.canplay.push(this.canPlayHandleAutoplay());
        }

        events.canplay.push(this.canPlay());
        events.playing.push(this.playingHideLoader());
        events.ended.push(this.ended());
        events.stalled.push(this.stalled());
        events.timeupdate.push(this.timeUpdate());

        return events;
    }

    canPlay() {
        return () => {
            this.widgetPlayerInstance.hideLoader();
        };
    }

    canPlayHandleAutoplay() {
        return () => {
            this.widgetPlayerInstance.audioController.play();
            this.widgetPlayerInstance.displayPauseButton();
        };
    }

    playingHideLoader() {
        return () => {
            this.widgetPlayerInstance.hideLoader();
        };
    }

    ended() {
        return () => {
            this.widgetPlayerInstance.displayReplayButton();
        };
    }

    stalled() {
        return () => {
            this.widgetPlayerInstance.displayLoader();
        };
    }

    timeUpdate() {
        return () => {
            if (this.widgetPlayerInstance.isScrubberBeingDragged)
                return false;

            let currentScrubberTime = this.widgetPlayerInstance.audioController.getCurrentTime();
            this.widgetPlayerInstance.scrubber.setValue(Math.round(currentScrubberTime));
        };
    }
}