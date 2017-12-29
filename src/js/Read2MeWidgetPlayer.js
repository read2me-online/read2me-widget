/**
 * Takes in an instance of Read2MeAudioController, widget blueprint node and blueprint properties,
 * replaces the blueprint node with the HTML audio player and makes the player's UI elements reactive.
 */
class Read2MeWidgetPlayer {
    constructor(
        Read2MeAudioController,
        widgetBlueprint,
        url,
        title = null,
        thumbnail = null,
        autoplay = false,
        playerId = 0,
        theme = null
    ) {
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
        this.theme = theme;

        this.player = Read2MeWidgetPlayer.getTemplate();
        widgetBlueprint.parentNode.replaceChild(this.player, widgetBlueprint);
        this.setTitle();
        this.setThumbnail();
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

    setTitle() {
        let container = this.player.querySelector('.read2me-widget-player-title span');
        let pageTitle = Read2MeWidgetPlayer.getPageTitle();

        if (this.title !== null)
            container.textContent = this.title;
        else if (pageTitle !== null)
            container.textContent = pageTitle;
    }

    setThumbnail() {
        let container = this.player.querySelector('.read2me-widget-player-thumbnail');
        let ogImage = Read2MeWidgetPlayer.getOgImageUrl();
        let defaultThumbnail = 'https://d22fip447qchhd.cloudfront.net/api/widget/static/images/default-thumbnail.png';

        if (this.thumbnail !== null)
            container.setAttribute('src', this.thumbnail);
        else if (ogImage !== null)
            container.setAttribute('src', ogImage);
        else
            container.setAttribute('src', defaultThumbnail);
    }

    static getPageTitle() {
        let title = document.querySelector('title');

        return title === null ? null : title.text;
    }

    static getOgImageUrl() {
        let tag = document.querySelector("meta[property='og:image']");

        return tag === null ? null : tag.getAttribute('content');
    }
}