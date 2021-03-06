import Read2MeAnalyticsBackendWrapper from "./Read2MeAnalyticsBackendWrapper";
import Read2MeHelpers from "./Read2MeHelpers";

export default class Read2MeAudioEvents {
    constructor(widgetPlayerInstance) {
        this.widgetPlayerInstance = widgetPlayerInstance;
    }

    getAll() {
        let events = {
            'canplay': [],
            'canplaythrough': [],
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
        events.canplaythrough.push(this.canPlayPhone());
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

    canPlayPhone() {
        return () => {
            this.widgetPlayerInstance.phoneRemainingTime.textContent = Read2MeHelpers.getRemainingTime(
                this.widgetPlayerInstance.audioController.getDuration(),
                this.widgetPlayerInstance.audioController.getCurrentTime()
            );

            if (Read2MeHelpers.isPhone())
                this.widgetPlayerInstance.activatePhoneStage2();
        };
    }

    canPlayHandleAutoplay() {
        return () => {
            if (Read2MeHelpers.isPhone())
                return;

            this.widgetPlayerInstance.audioController.play();
            this.widgetPlayerInstance.displayPauseButton();
            this.widgetPlayerInstance.activatePhoneStage2();
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
            if (this.widgetPlayerInstance.audioController.isPlaying())
                this.widgetPlayerInstance.displayLoader();
        };
    }

    timeUpdate() {
        return () => {
            this._sendAnalytics();

            if (this.widgetPlayerInstance.isScrubberBeingDragged)
                return false;

            let duration = this.widgetPlayerInstance.audioController.getDuration();
            let currentAudioTime = this.widgetPlayerInstance.audioController.getCurrentTime();

            // desktop
            this.widgetPlayerInstance.scrubber.setValue(Math.round(currentAudioTime));

            // phone
            let relativeDuration = 100 / duration;
            let progress = 100 - currentAudioTime * relativeDuration;
            let remainingTimeIndicator = Read2MeHelpers.getRemainingTime(duration, currentAudioTime);

            this.widgetPlayerInstance.scrubberPhoneProgress.style['transform'] = 'translateX(-' + progress + '%)';
            this.widgetPlayerInstance.phoneRemainingTime.textContent = remainingTimeIndicator;
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