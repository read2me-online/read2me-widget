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

        // sliders
        this.scrubber = null;
        this.speakingRate = null;

        // arguments
        this.Read2MeAudioController = Read2MeAudioController;
        this.widgetBlueprint = widgetBlueprint;
        this.url = url;
        this.title = title;
        this.thumbnail = thumbnail;
        this.autoplay = autoplay;
        this.playerId = playerId;
        this.theme = theme;

        this.player = Read2MeWidgetPlayer.getTemplate();
        widgetBlueprint.parentNode.replaceChild(this.player, this.widgetBlueprint);

        this.setTitle();
        this.setThumbnail();
        this.setTheme();
        this.player.classList.remove('read2me-template');
        this.instantiateSliders();
        this.handleAutoplay();
        this.handlePlayback();
        this.handleQuickControls();
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



        this.Read2MeAudioController.audio.addEventListener('loadedmetadata', () => {
            scrubber.classList.remove('hidden');
            speakingRate.classList.remove('hidden');

            this.scrubber = new Slider('#' + newScrubberId, {
                tooltip_position: 'bottom',
                formatter: function (value) {
                    return value;
                },
                max: Math.round(this.Read2MeAudioController.getDuration())
            });

            this.speakingRate = new Slider('#' + newSpeakingRateId, {
                tooltip_position: 'bottom',

                formatter: function (value) {
                    return value + 'x';
                }
            });
        });
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

    handleAutoplay() {
        if (!this.autoplay)
            return;

        this.Read2MeAudioController.audio.addEventListener('canplay', () => {
            this.Read2MeAudioController.audio.play();
        });
    }

    setTheme() {
        switch (this.theme) {
            case 'blue':
                this.player.classList.add('preset-blue');
                break;
            case 'white':
                this.player.classList.add('preset-white');
                break;
        }
    }

    handlePlayback() {
        let play = this.player.querySelector('.read2me-widget-player-playback-play');
        let pause = this.player.querySelector('.read2me-widget-player-playback-pause');
        let replay = this.player.querySelector('.read2me-widget-player-playback-replay');
        let container = this.player.querySelector('.read2me-widget-player-playback');

        container.addEventListener('click', () => {
            if (!play.classList.contains('hidden')) {
                this.Read2MeAudioController.play();
                play.classList.add('hidden');
                pause.classList.remove('hidden');
            } else if (!pause.classList.contains('hidden')) {
                this.Read2MeAudioController.pause();
                play.classList.remove('hidden');
                pause.classList.add('hidden');
            } else {
                this.Read2MeAudioController.replay();
                replay.classList.add('hidden');
                pause.classList.remove('hidden');
            }
        });

        this.Read2MeAudioController.audio.addEventListener('ended', () => {
            play.classList.add('hidden');
            pause.classList.add('hidden');
            replay.classList.remove('hidden');
        });
    }

    handleQuickControls() {
        let rewind = this.player.querySelector('.read2me-widget-rewind');
        let forward = this.player.querySelector('.read2me-widget-forward');

        rewind.addEventListener('click', () => {
            this.Read2MeAudioController.rewindForXSeconds(10);
        });

        forward.addEventListener('click', () => {
            this.Read2MeAudioController.forwardForXSeconds(10);
        });
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