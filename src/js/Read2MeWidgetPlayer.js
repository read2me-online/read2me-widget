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
        this.highchart = null;
        this.isHighchartsJsLoaded = false;
        this.isPhoneLoadingInitiated = false;
        this._highchartsLibraryWaiter = null;

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
        this.player = this.wrapper.querySelector('.read2me-player');
        this.analytics = this.wrapper.querySelector('.read2me-analytics');
        this.playbackContainer = this.player.querySelector('.read2me-player-playback');
        this.loader = this.player.querySelector('.read2me-widget-loader');
        this.titleContainer= this.player.querySelector('.read2me-player-title');
        this.titleTextContainer = this.titleContainer.querySelector('span');
        this.displayAnalyticsLink = this.player.querySelector('.read2me-dropdown-analytics');
        this.closeAnalyticsLink = this.analytics.querySelector('.read2me-analytics-menu-close');
        this.refreshContentLink = this.player.querySelector('.read2me-dropdown-refresh');
        this.scrubberPhone = this.wrapper.querySelector('.read2me-phone-scrubber');
        widgetBlueprint.parentNode.replaceChild(this.wrapper, this.widgetBlueprint);

        // UI playback controllers for tablet and desktop
        this.play = this.player.querySelector('.read2me-player-playback-play');
        this.pause = this.player.querySelector('.read2me-player-playback-pause');
        this.replay = this.player.querySelector('.read2me-player-playback-replay');

        // phone UI playback controlls
        this.phoneStage1 = this.wrapper.querySelector('.read2me-phone-stage1');
        this.speakingRatePhone = this.wrapper.querySelector('.read2me-phone-speaking-rate');
        this.phonePlaybackContainer = this.wrapper.querySelector('.read2me-phone-playback-container');

        // set the player up
        this.setTitle();
        this.setThumbnail();
        this.setTheme();
        this.setWidth();
        this.toggleVisibility();
        this.instantiateSlidersForTabletDesktop();
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
        this.handleAnalyticsMenuBindings();
    }

    _setListeningSessionId() {
        this.listeningSessionId = Read2MeHelpers.getRandom4ByteUnsignedInt();
    }

    _setClickHandlerType() {
        this.clickHandlerType = 'ontouchstart' in document.documentElement ? "touchstart" : "click";
    }

    toggleVisibility() {
        this.wrapper.classList.toggle('read2me-template');
    }

    instantiateSlidersForTabletDesktop() {
        // make ID and data-slider-id attributes unique for scrubber and speaking rate inputs
        // scrubber's node id: #read2me-player-scrubber-player
        // speaking rate's node id: #read2me-player-speaking-rate
        let scrubberId = 'read2me-player-scrubber-player';
        let speakingRateId = 'read2me-player-speaking-rate';

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
        let container = this.player.querySelector('.read2me-thumbnail');
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
        this.phonePlaybackContainer.classList.add('read2me-phone-playback-ended');
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

        // PHONE CONTROLS
        // stage 1 to stage 2 transition
        this.phoneStage1.addEventListener(this.clickHandlerType, () => {
            if (this.isPhoneLoadingInitiated)
                return false;

            this.isPhoneLoadingInitiated = true;
            this.phoneStage1.classList.add('read2me-stage1-loading');
            this.audioController.play();
        });

        // playback control
        this.phonePlaybackContainer.addEventListener(this.clickHandlerType, () => {
            let playingClass = 'read2me-phone-playback-playing';
            let pausedClass = 'read2me-phone-playback-paused';
            let finishedClass = 'read2me-phone-playback-ended';

            if (this.phonePlaybackContainer.classList.contains(playingClass)) {
                this.phonePlaybackContainer.classList.remove(playingClass);
                this.phonePlaybackContainer.classList.add(pausedClass);
                this.audioController.pause();
            } else if (this.phonePlaybackContainer.classList.contains(pausedClass)) {
                this.phonePlaybackContainer.classList.remove(pausedClass);
                this.phonePlaybackContainer.classList.add(playingClass);
                this.audioController.play();
            } else if (this.phonePlaybackContainer.classList.contains(finishedClass)) {
                this.phonePlaybackContainer.classList.remove(finishedClass);
                this.phonePlaybackContainer.classList.add(playingClass);
                this._setListeningSessionId();
                this.play();
            }
        });
    }

    handleQuickControls() {
        Read2MeHelpers.addEventListenerByClass(this.wrapper, 'read2me-player-rewind', this.clickHandlerType, () => {
            this.audioController.rewindForXSeconds(10);

            if (this.isReplayButtonShown())
                this.displayPlayButton();
        });

        Read2MeHelpers.addEventListenerByClass(this.wrapper, 'read2me-player-forward', this.clickHandlerType, () => {
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

        this.scrubberPhone.addEventListener(this.clickHandlerType, (e) => {
            let bar = this.wrapper.querySelector('.read2me-phone-scrubber');
            let progress = this.wrapper.querySelector('.read2me-phone-scrubber-progress');

            let pt = e.changedTouches && e.changedTouches[0] || e;
            let barProperties = bar.getBoundingClientRect();
            let percent = 1 - (pt.clientX - barProperties.left) / barProperties.width; // e.g. 0.82
            percent = Math.round(percent * 100); // in real %, e.g. 82%

            progress.style['transform'] = 'translateX(-' + percent + '%)';
        });
    }

    handleSpeakingRateChange() {
        this.speakingRate.on('change', (values) => {
            this.audioController.setPlaySpeed(values.newValue);
        });

        this.speakingRatePhone.addEventListener(this.clickHandlerType, () => {

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
                Read2MeHelpers.loadJs('https://code.highcharts.com/6.0/highcharts.js', () => {
                    this.isHighchartsJsLoaded = true;
                });
            } else {
                this.isHighchartsJsLoaded = true;
            }

            // load flags
            Read2MeHelpers.loadCss('https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.1.0/css/flag-icon.min.css');

            Read2MeAnalyticsBackendWrapper.getAnalytics(
                this.apiResponse.id,
                (response) => {
                    // success
                    this._highchartsLibraryWaiter = setInterval(() => {
                        if (this.isHighchartsJsLoaded) {
                            this.wrapper.classList.add('read2me-analytics-view'); // do the flip
                            this.hideLoader();
                            this.instantiateAnalytics(response.result);
                            clearInterval(this._highchartsLibraryWaiter);
                        }
                    }, 50);
                },
                (response) => {
                    // error - don't display analytics page, just hide the loader
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

    instantiateAnalytics(result) {
        this.highchart = Read2MeHelpers.getInterestDistributionHighchart(
            result, this.analytics.querySelector('.read2me-highcharts')
        );

        let playbackCountContainer = this.analytics.
        querySelector('.read2me-analytics-playback-count .read2me-analytics-playback-value');
        playbackCountContainer.textContent = result.playback_count_human_readable;

        let playbackDurationContainer = this.analytics.
        querySelector('.read2me-analytics-playback-duration .read2me-analytics-playback-value');
        playbackDurationContainer.textContent = result.listening_time_human_readable;

        let countriesContainer = this.analytics.querySelector('.read2me-analytics-countries');
        let countries = result.country_frequency_human_readable;

        Object.keys(countries).forEach(key => {
            let countryIso = key.toLowerCase();
            let count = countries[key];
            let container = this.analytics.querySelector('.read2me-analytics-country.hidden').cloneNode(true);

            container.querySelector('.flag-icon').classList.add('flag-icon-' + countryIso);
            container.querySelector('.read2me-analytics-country-playbacks').textContent = count;
            container.setAttribute('title', key);
            container.classList.remove('hidden');

            countriesContainer.appendChild(container);
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

    handleViewportResize() {
        window.addEventListener('resize', () => {
            this._setClickHandlerType();
        });
    }
}