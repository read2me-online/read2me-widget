import Read2MeBackendWrapper from "./Read2MeBackendWrapper";

export default class Read2MeAudioEvents {
    constructor(widgetPlayerInstance) {
        this.widgetPlayerInstance = widgetPlayerInstance;
        this.analyticsReportingInterval = null;
    }

    getAll() {
        let events = {
            'canplay': [],
            'playing': [],
            'pause': [],
            'ended': [],
            'stalled': [],
            'timeupdate': []
        };

        if (this.widgetPlayerInstance.autoplay) {
            events.canplay.push(this.canPlayHandleAutoplay());
        }

        events.canplay.push(this.canPlay());
        events.playing.push(this.playingHideLoader());
        events.playing.push(this.startReportingAnalytics());
        events.pause.push(this.stopReportingAnalytics());
        events.ended.push(this.ended());
        events.ended.push(this.stopReportingAnalytics());
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

    startReportingAnalytics() {
        return () => {
            this.stopReportingAnalytics()();
            this._sendAnalytics();

            this.analyticsReportingInterval = setInterval(() => {
                if (this.widgetPlayerInstance.audioController.audio.currentTime < 1.5)
                    return;

                this._sendAnalytics();
            }, 1000);
        };
    }

    stopReportingAnalytics() {
        return () => {
            if (this.analyticsReportingInterval === null)
                return;

            clearInterval(this.analyticsReportingInterval);
            this.analyticsReportingInterval = null;
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

    _sendAnalytics() {
        Read2MeBackendWrapper.sendAnalytics(
            this.widgetPlayerInstance.apiResponse.id,
            this.widgetPlayerInstance.audioController.audio.currentTime,
            this.widgetPlayerInstance.audioController.audio.duration,
            this.widgetPlayerInstance.listeningSessionId
        );
    }
}