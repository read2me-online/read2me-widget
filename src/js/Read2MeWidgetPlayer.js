import Read2MeHelpers from "./Read2MeHelpers";
import Read2MeAudioController from './Read2MeAudioController';
import Read2MeBackendWrapper from "./Read2MeBackendWrapper";
import Read2MeAudioEvents from "./Read2MeAudioEvents";
import Read2MeAnalyticsBackendWrapper from "./Read2MeAnalyticsBackendWrapper";

export default class Read2MeWidgetPlayer {
    constructor(widgetBlueprint, url, title = null, thumbnail = null, autoplay = false, playerId = 0, theme = null, width = null) {
        // sliders
        this.isScrubberBeingDragged = false;
        this.scrubber = null;
        this.speakingRate = null;
        this.scale = 1;
        this.highchart = null;

        // fixes #32
        // https://github.com/NinoSkopac/read2me-widget/issues/32
        this._setClickHandlerType();

        // arguments
        this.widgetBlueprint = widgetBlueprint;
        this.url = url;
        this.title = title;
        this.thumbnail = thumbnail;
        this.autoplay = autoplay;
        this.playerId = playerId;
        this.theme = theme;
        this.width = width;

        this.wrapper = Read2MeHelpers.getWidgetTemplate();
        this.player = this.wrapper.querySelector('.read2me-widget-player');
        this.analytics = this.wrapper.querySelector('.read2me-analytics');
        this.playbackContainer = this.player.querySelector('.read2me-widget-player-playback');
        this.loader = this.player.querySelector('.read2me-widget-loader');
        this.titleContainer= this.player.querySelector('.read2me-widget-player-title');
        this.titleTextContainer = this.titleContainer.querySelector('span');
        this.rewind = this.player.querySelector('.read2me-widget-rewind');
        this.forward = this.player.querySelector('.read2me-widget-forward');
        this.displayAnalyticsLink = this.player.querySelector('.read2me-dropdown-analytics');
        this.closeAnalyticsLink = this.analytics.querySelector('.read2me-analytics-menu-close');
        this.refreshContentLink = this.player.querySelector('.read2me-dropdown-refresh');
        widgetBlueprint.parentNode.replaceChild(this.wrapper, this.widgetBlueprint);

        // UI playback controllers
        this.play = this.player.querySelector('.read2me-widget-player-playback-play');
        this.pause = this.player.querySelector('.read2me-widget-player-playback-pause');
        this.replay = this.player.querySelector('.read2me-widget-player-playback-replay');

        // set the player up
        this.setTitle();
        this.setThumbnail();
        this.setTheme();
        this.setWidth();
        this.scalePlayerDownOnSmallScreens();
        this.toggleVisibility();
        this.instantiateSliders();
        this._setTentativeWrapperHeight();
        this.handleViewportResize();
        this._setListeningSessionId();
    }

    finishInitialisation(audioController, backendWrapper, apiResponse) {
        if (audioController instanceof Read2MeAudioController === false)
            throw new Error('Invalid first argument for Read2MeWidgetPlayer.finishInitialisation(); must be an instance of Read2MeAudioController');

        if (backendWrapper instanceof Read2MeBackendWrapper === false)
            throw new Error('Invalid second argument for Read2MeWidgetPlayer.finishInitialisation(); must be an instance of Read2MeBackendWrapper');

        this.audioController = audioController;
        this.backendWrapper = backendWrapper;
        this.apiResponse = apiResponse;
        this.configureSliders();
        this.handlePlayback();
        this.handleQuickControls();
        this.handleScrubber();
        this.handleSpeakingRateChange();
        this.handleDropdownBindings();
        this.hideLoader();
        this.removePlaybackBufferingStyles();
        this.setMarqueeForTitle();
        this.setWrapperHeight();
        this.handleAnalyticsMenuBindings();
    }

    _setListeningSessionId() {
        this.listeningSessionId = Read2MeHelpers.getRandom4ByteUnsignedInt();
    }

    _setClickHandlerType() {
        this.clickHandlerType = 'ontouchstart' in document.documentElement ? "touchstart" : "click";
    }

    _setTentativeWrapperHeight() {
        if (!Read2MeHelpers.isPhone())
            return;

        let containerWidth = Read2MeHelpers.getElementsWidthWithoutPadding(this.wrapper.parentNode);
        let tentativeWrapperHeight = Math.round(containerWidth / 3.7);

        this.wrapper.style.height = tentativeWrapperHeight + 'px';
    }

    toggleVisibility() {
        this.wrapper.classList.toggle('read2me-template');
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

        this.scrubber = new Slider('#' + newScrubberId, {
            tooltip_position: 'bottom',
            formatter: function (seconds) {
                let currentTimeArray = Read2MeHelpers.secondsToHumanReadableArray(seconds);

                return Read2MeHelpers.secondsMinutesHoursToHumanReadable(
                    currentTimeArray[0], currentTimeArray[1], currentTimeArray[2]
                );
            },
        });

        this.speakingRate = new Slider('#' + newSpeakingRateId, {
            tooltip_position: 'bottom',

            formatter: function (value) {
                return value + 'x';
            }
        });
    }

    configureSliders() {
        this.scrubber.setAttribute('max', this.apiResponse.audio_length_seconds);
        this.scrubber.enable();
    }

    setTitle() {
        let pageTitle = Read2MeHelpers.getPageTitle();

        if (this.title !== null)
            this.titleTextContainer.textContent = this.title;
        else if (pageTitle !== null)
            this.titleTextContainer.textContent = pageTitle;
    }

    setMarqueeForTitle() {
        if (this.titleTextContainer.offsetWidth > this.titleContainer.offsetWidth)
            this.titleTextContainer.classList.add('read2me-marquee');
    }

    setThumbnail() {
        let container = this.player.querySelector('.read2me-widget-player-thumbnail');
        let ogImage = Read2MeHelpers.getOgImageUrl();
        let defaultThumbnail = 'https://d22fip447qchhd.cloudfront.net/api/widget/static/images/default-thumbnail.png';

        if (this.thumbnail !== null)
            container.setAttribute('src', this.thumbnail);
        else if (ogImage !== null)
            container.setAttribute('src', ogImage);
        else
            container.setAttribute('src', defaultThumbnail);
    }

    setTheme() {
        if (this.theme === null)
            this.player.classList.add('preset-white');
        else
            this.player.classList.add('preset-' + this.theme);
    }

    setWidth() {
        if (this.width === null)
            return;

        this.player.style.width = this.width;
    }

    isPlayButtonShown() {
        return !this.play.classList.contains('hidden');
    }

    displayPlayButton() {
        this.play.classList.remove('hidden');
        this.pause.classList.add('hidden');
        this.replay.classList.add('hidden');
    }

    isPauseButtonShown() {
        return !this.pause.classList.contains('hidden');
    }

    displayPauseButton() {
        this.play.classList.add('hidden');
        this.pause.classList.remove('hidden');
        this.replay.classList.add('hidden');
    }

    isReplayButtonShown() {
        return !this.replay.classList.contains('hidden');
    }

    displayReplayButton() {
        this.play.classList.add('hidden');
        this.pause.classList.add('hidden');
        this.replay.classList.remove('hidden');
    }

    handlePlayback() {
        this.playbackContainer.addEventListener(this.clickHandlerType, () => {
            if (this.isPlayButtonShown()) {
                this.audioController.play();
                this.displayLoader();
                this.displayPauseButton();
            } else if (this.isPauseButtonShown()) {
                this.audioController.pause();
                this.displayPlayButton();
            } else {
                this._setListeningSessionId();
                this.audioController.replay();
                this.displayPauseButton();
            }
        });
    }

    handleQuickControls() {
        this.rewind.addEventListener(this.clickHandlerType, () => {
            this.audioController.rewindForXSeconds(10);

            if (this.isReplayButtonShown())
                this.displayPlayButton();
        });

        this.forward.addEventListener(this.clickHandlerType, () => {
            this.audioController.forwardForXSeconds(10);
        });
    }

    handleScrubber() {
        this.scrubber.on('slideStart', () => {
            this.isScrubberBeingDragged = true;
        });

        this.scrubber.on('slideStop', (newCurrentTime) => {
            this.isScrubberBeingDragged = false;
            this.audioController.setCurrentTime(newCurrentTime);

            if (this.isReplayButtonShown() && newCurrentTime !== this.audioController.getDuration())
                this.displayPlayButton();
        });
    }

    handleSpeakingRateChange() {
        this.speakingRate.on('change', (values) => {
            this.audioController.setPlaySpeed(values.newValue);
        });
    }

    displayLoader() {
        this.loader.classList.remove('hidden');
    }

    hideLoader() {
        this.loader.classList.add('hidden');
    }

    removePlaybackBufferingStyles() {
        this.playbackContainer.classList.remove('read2me-playback-buffering');
    }

    handleDropdownBindings() {
        this.displayAnalyticsLink.addEventListener('click', () => {
            if (this.highchart !== null) {
                this.wrapper.classList.add('read2me-analytics-view');

                return;
            }

            this.displayLoader();

            // load Highcharts if doesn't already exist
            if (typeof Highcharts === 'undefined') {
                Read2MeHelpers.loadJs('https://code.highcharts.com/6.0/highcharts.js');
            }

            // load flags
            Read2MeHelpers.loadCss('https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.1.0/css/flag-icon.min.css');

            Read2MeAnalyticsBackendWrapper.getAnalytics(
                this.apiResponse.id,
                (response) => {
                    // success
                    this.wrapper.classList.add('read2me-analytics-view'); // do the flip
                    this.hideLoader();

                    this.highchart = Read2MeHelpers.getInterestDistributionHighchart(
                        response.result, this.analytics.querySelector('.read2me-highcharts')
                    );

                    let playbackCountContainer = this.analytics.
                        querySelector('.read2me-analytics-playback-count .read2me-analytics-playback-value');
                    playbackCountContainer.textContent = response.result.playback_count_human_readable;

                    let playbackDurationContainer = this.analytics.
                        querySelector('.read2me-analytics-playback-duration .read2me-analytics-playback-value');
                    playbackDurationContainer.textContent = response.result.listening_time_human_readable;

                    let countriesContainer = this.analytics.querySelector('.read2me-analytics-countries');
                    let countries = response.result.country_frequency_human_readable;

                    Object.keys(countries).forEach(key => {
                        let countryIso = key.toLowerCase();
                        let count = countries[key];
                        let container = this.analytics.querySelector('.read2me-analytics-country.hidden').cloneNode(true);

                        container.querySelector('.flag-icon').classList.add('flag-icon-' + countryIso);
                        container.querySelector('.read2me-analytics-country-playbacks').textContent = count;
                        container.classList.remove('hidden');

                        countriesContainer.appendChild(container);
                    });
                },
                (response) => {
                    // error
                    this.hideLoader();
                }
            );
        });

        this.refreshContentLink.addEventListener('click', () => {
            this.displayLoader();

            this.backendWrapper.refreshCreate(
                (response) => {
                    // cache invalidated and audio created
                    let events = new Read2MeAudioEvents(this).getAll();

                    this.apiResponse = response.result;
                    this.audioController = new Read2MeAudioController(this.apiResponse.audio_url, events);
                    this.configureSliders();
                    // loader will be hidden automatically by audio canplay event
                },
                (response) => {
                    // error
                    this.hideLoader();
                    console.warn(response);
                }
            );
        });
    }

    handleAnalyticsMenuBindings() {
        let menuSlide1 = this.analytics.querySelector('.read2me-analytics-menu-slide1'); // trigger for playback & geo
        let menuSlide2 = this.analytics.querySelector('.read2me-analytics-menu-slide2'); // trigger for interest graph
        let slide1 = this.analytics.querySelector('.read2me-analytics-slide1'); // playback & geo slide
        let slide2 = this.analytics.querySelector('.read2me-analytics-slide2'); // interest graph slide

        menuSlide1.addEventListener('click', () => {
            // display interest graph
            slide2.classList.remove('read2me-analytics-slide2-visible');
            menuSlide1.classList.add('hidden');
            menuSlide2.classList.remove('hidden');
        });

        menuSlide2.addEventListener('click', () => {
            // display playback and geo
            slide2.classList.add('read2me-analytics-slide2-visible');
            menuSlide2.classList.add('hidden');
            menuSlide1.classList.remove('hidden');
        });

        this.closeAnalyticsLink.addEventListener('click', () => {
            this.wrapper.classList.remove('read2me-analytics-view');
        });
    }

    scalePlayerDownOnSmallScreens() {
        if (Read2MeHelpers.isPhone()) {
            let parentWidth = Read2MeHelpers.getElementsWidthWithoutPadding(this.wrapper.parentNode);
            this.scale = parentWidth / (570 + 10); // player width is 570px and there are two 5px side margins

            this.wrapper.style.width = parentWidth + 'px';
            this.player.style.transform = 'scale(' + this.scale + ')';
            this.player.style['margin-left'] = 5 * this.scale + 'px';
        } else {
            this.scale = 1;

            this.wrapper.style.width = '';
            this.wrapper.style.height = '141px';
            this.player.style.transform = '';
            this.player.style['margin-left'] = '';
        }
    }

    setWrapperHeight() {
        if (!Read2MeHelpers.isPhone())
            return;

        let playerHeight = this.player.getBoundingClientRect().height;
        let marginsSize = 40 * this.scale;
        let extraSpacingOnMobile = 10;

        this.wrapper.style.height = (playerHeight + marginsSize + extraSpacingOnMobile) + 'px';
    }

    handleViewportResize() {
        window.addEventListener('resize', () => {
            Read2MeHelpers.hideAllWidgets();
            this.scalePlayerDownOnSmallScreens();
            Read2MeHelpers.showAllWidgets();

            this.setWrapperHeight();
            this._setClickHandlerType();
        });
    }
}