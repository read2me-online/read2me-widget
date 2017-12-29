/**
 * Takes in an instance of Read2MeAudioController, widget blueprint node and blueprint properties,
 * replaces the blueprint node with the HTML audio player and makes the player's UI elements reactive.
 */
class Read2MeWidgetPlayer {
    constructor(Read2MeAudioController, widgetBlueprint, url, title = '', thumbnail = null, autoplay = false, playerId = 0) {
        if (Read2MeAudioController.audio instanceof Audio === false)
            throw 'Invalid first param for Read2MeWidgetPlayer';

        // internals
        this._sliders = [];

        // arguments
        this.url = url;
        this.title = title;
        this.thumbnail = thumbnail;
        this.autoplay = autoplay;
        this.playerId = playerId;

        this.player = Read2MeWidgetPlayer.getTemplate();
        widgetBlueprint.parentNode.replaceChild(this.player, widgetBlueprint);
        this.player.classList.remove('read2me-template');
        this.instantiateSliders();
    }

    static getTemplate() {
        return document.querySelector('.read2me-widget-player.read2me-template').cloneNode(true);
    }

    instantiateSliders() {
        // make ID and data-slider-id attributes unique for scrubber and speaking rate inputs
        // scrubber's node id: #read2me-widget-scrubber-player
        // speaking rate's node id: #read2me-widget-player-speaking-rate
        let scrubberId = 'read2me-widget-scrubber-player';
        let speakingRateId = 'read2me-widget-player-speaking-rate';

        let newScrubberId = scrubberId + '-' + this.playerId;
        let newSpeakingRateId = speakingRateId + '-' + this.playerId;

        // append playerId to their IDs to make them unique
        let scrubber = this.player.querySelector('#' + scrubberId);
        scrubber.setAttribute('id', newScrubberId);
        scrubber.setAttribute('data-slider-id', newScrubberId);

        let speakingRate = this.player.querySelector('#' + speakingRateId);
        speakingRate.setAttribute('id', newSpeakingRateId);
        speakingRate.setAttribute('data-slider-id', newSpeakingRateId);

        this._sliders.push(new Slider('#' + newScrubberId, {
            tooltip_position: 'bottom',

            formatter: function (value) {
                return value;
            }
        }));

        this._sliders.push(new Slider('#' + newSpeakingRateId, {
            tooltip_position: 'bottom',

            formatter: function (value) {
                return value + 'x';
            }
        }));
    }
}