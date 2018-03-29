import Read2MeAnalyticsBackendWrapper from "./Read2MeAnalyticsBackendWrapper";
import Read2MeHelpers from "./Read2MeHelpers";

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
        events.canplay.push(this.canPlayPhone());
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

    canPlayPhone() {
        return () => {
            this.widgetPlayerInstance.wrapper.classList.add('read2me-phone-stage2-active');

            this.widgetPlayerInstance.phoneRemainingTime.textContent = Read2MeHelpers.getRemainingTime(
                this.widgetPlayerInstance.audioController.getDuration(),
                this.widgetPlayerInstance.audioController.getCurrentTime()
            );
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

            let duration = this.widgetPlayerInstance.audioController.getDuration();
            let currentAudioTime = this.widgetPlayerInstance.audioController.getCurrentTime();

            if (Read2MeHelpers.isPhone()) {
                let relativeDuration = 100 / duration;
                let progress = 100 - currentAudioTime * relativeDuration;
                let remainingTimeIndicator = Read2MeHelpers.getRemainingTime(duration, currentAudioTime);

                this.widgetPlayerInstance.phoneScrubber.style['transform'] = 'translateX(-' + progress + '%)';
                this.widgetPlayerInstance.phoneRemainingTime.textContent = remainingTimeIndicator;
            } else {
                this.widgetPlayerInstance.scrubber.setValue(Math.round(currentAudioTime));
            }
        };
    }

    _sendAnalytics() {
        Read2MeAnalyticsBackendWrapper.sendAnalytics(
            this.widgetPlayerInstance.apiResponse.id,
            this.widgetPlayerInstance.audioController.audio.currentTime,
            this.widgetPlayerInstance.audioController.audio.duration,
            this.widgetPlayerInstance.listeningSessionId
        );
    }
}