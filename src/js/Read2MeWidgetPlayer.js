import Read2MeHelpers from "./Read2MeHelpers";
import Read2MeAudioController from './Read2MeAudioController';
import Read2MeBackendWrapper from "./Read2MeBackendWrapper";
import Read2MeAudioEvents from "./Read2MeAudioEvents";
import Read2MeAnalyticsBackendWrapper from "./Read2MeAnalyticsBackendWrapper";

export default class Read2MeWidgetPlayer {
    constructor(
        widgetBlueprint, url, title = null,
        thumbnail = null, autoplay = false,
        playerId = 0, theme = null, width = null,
        design = null, colors = null) {
        // sliders
        this.isScrubberBeingDragged = false;
        this.scrubber = null;
        this.highchart = null;
        this.isHighchartsJsLoaded = false;
        this.isPhoneLoadingInitiated = false;
        this._highchartsLibraryWaiter = null;
        this.lastPlaybackEvent = Date.now();

        // arguments
        this.widgetBlueprint = widgetBlueprint;
        this.url = url;
        this.title = title;
        this.thumbnail = thumbnail;
        this.autoplay = autoplay;
        this.playerId = playerId;
        this.theme = theme;
        this.width = width;
        this.design = design === null ? 'standard' : 'minimal';
        this.colors = colors; // array|null
        this.hasColors = this.colors !== null && this.colors.length > 0;
        this.primaryColor = this.hasColors ? this.colors[0] : null;
        this.secondaryColor = this.hasColors ? this.colors[1] : null;

        // desktop - standard design
        this.wrapper = Read2MeHelpers.getWidgetTemplate();
        this.wrapper.id = 'read2me-widget-wrapper-' + this.playerId;
        this.player = this.wrapper.querySelector('.read2me-player');
        this.analytics = this.wrapper.querySelector('.read2me-analytics');
        this.playbackContainer = this.player.querySelector('.read2me-player-playback');
        this.loader = this.player.querySelector('.read2me-widget-loader');
        this.titleContainer= this.player.querySelector('.read2me-player-title');
        this.titleTextContainer = this.titleContainer.querySelector('span');
        widgetBlueprint.parentNode.replaceChild(this.wrapper, this.widgetBlueprint);

        // UI playback controllers for tablet and desktop
        this.play = this.player.querySelector('.read2me-player-playback-play');
        this.pause = this.player.querySelector('.read2me-player-playback-pause');
        this.replay = this.player.querySelector('.read2me-player-playback-replay');

        // phone UI/minimal playback controls
        this.phoneUi = this.wrapper.querySelector('.read2me-phone-ui');
        this.phoneStage1 = this.phoneUi.querySelector('.read2me-phone-stage1');
        this.phonePlaybackContainer = this.phoneUi.querySelector('.read2me-phone-playback-container');
        this.scrubberPhoneContainer = this.wrapper.querySelector('.read2me-phone-scrubber-container');
        this.scrubberPhone = this.wrapper.querySelector('.read2me-phone-scrubber');
        this.phoneScrubber = this.phoneUi.querySelector('.read2me-phone-scrubber-progress');
        this.phoneRemainingTime = this.phoneUi.querySelector('.read2me-phone-remaining-time-container span');

        // dropdown menu
        this.menu = this.wrapper.querySelector('.read2me-menu');
        this.displayAnalyticsLink = this.menu.querySelector('.read2me-dropdown-analytics');
        this.refreshContentLink = this.menu.querySelector('.read2me-dropdown-refresh');

        // analytics
        this.closeAnalyticsLink = this.analytics.querySelector('.read2me-analytics-menu-close');

        this.phonePlayingClass = 'read2me-phone-playback-playing';
        this.phonePausedClass = 'read2me-phone-playback-paused';
        this.phoneFinishedClass = 'read2me-phone-playback-ended';

        // set the player up
        this.setTitle();
        this.setThumbnail();
        this.setDesign();
        this.switchToMinimalDesignIfContainerTooNarrow();
        this.setTheme();
        this.setColors();
        this.setWidth();
        this.instantiateSlidersForTabletDesktop();
        this.handleViewportResize();
        this._setListeningSessionId();

        if (!Read2MeHelpers.isFirefox() && !Read2MeHelpers.isSamsungBrowser())
            this.makeVisible();

        if (Read2MeHelpers.isSamsungBrowser() || Read2MeHelpers.isEdge())
            this.phoneUi.querySelector('.read2me-phone-playback').style['justify-content'] = 'space-around';
    }

    finishInitialisation(audioController, backendWrapper, apiResponse) {
        if (audioController instanceof Read2MeAudioController === false)
            throw new Error('Invalid first argument for Read2MeWidgetPlayer.finishInitialisation(); must be an instance of Read2MeAudioController');

        if (backendWrapper instanceof Read2MeBackendWrapper === false)
            throw new Error('Invalid second argument for Read2MeWidgetPlayer.finishInitialisation(); must be an instance of Read2MeBackendWrapper');

        if (Read2MeHelpers.isFirefox() || Read2MeHelpers.isSamsungBrowser())
            this.makeVisible();

        this.audioController = audioController;
        this.backendWrapper = backendWrapper;
        this.apiResponse = apiResponse;
        this.configureSliders(this.apiResponse.audio_length_seconds);
        this.handlePlayback();
        this.handleQuickControls();
        this.handleScrubber();
        this.handleSpeakingRateChange();
        this.handleDropdownBindings();
        this.hideLoader();
        this.removePlaybackBufferingStyles();
        this.setMarqueeForTitle();
        this.handleAnalyticsMenuBindings();

        // in case the container wasn't properly rendered during construct
        this.switchToMinimalDesignIfContainerTooNarrow();
        this.positionArticleFocusTitle();
    }

    _setListeningSessionId() {
        this.listeningSessionId = Read2MeHelpers.getRandom4ByteUnsignedInt();
    }

    makeVisible() {
        this.wrapper.classList.remove('read2me-template');
        this.wrapper.style.display = 'inline-block';
    }

    hide() {
        this.wrapper.classList.add('read2me-template');
        this.wrapper.style.display = 'none';
    }

    instantiateSlidersForTabletDesktop() {
        // make ID and data-slider-id attributes unique for scrubber
        // scrubber's node id: #read2me-player-scrubber-player
        let scrubberId = 'read2me-player-scrubber-player';

        let newScrubberId = scrubberId + '-' + this.playerId;
        let newScrubberIdSelectable = '#' + scrubberId;

        // append playerId to their IDs to make them unique
        let scrubber = this.player.querySelector(newScrubberIdSelectable);
        scrubber.setAttribute('id', newScrubberId);
        scrubber.setAttribute('data-slider-id', newScrubberId);

        this.scrubber = new Slider('#' + newScrubberId, {
            tooltip_position: 'bottom',
            formatter: function (seconds) {
                let currentTimeArray = Read2MeHelpers.secondsToHumanReadableArray(seconds);

                return Read2MeHelpers.secondsMinutesHoursToHumanReadable(
                    currentTimeArray[0], currentTimeArray[1], currentTimeArray[2]
                );
            },
        });

        if (this.hasColors) {
            this.wrapper.querySelector('.slider-selection').style.background = this.primaryColor;
            this.wrapper.querySelector('.slider-handle').style.background = this.primaryColor;
        }
    }

    configureSliders(audioLengthSeconds) {
        this.scrubber.setAttribute('max', audioLengthSeconds);
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

    setDesign() {
        this.wrapper.classList.add('read2me-design-' + this.design);
    }

    switchToMinimalDesignIfContainerTooNarrow() {
        // no action required if design is minimal or if it's a phone, cause that's handled by CSS
        if (this.design === 'minimal' || Read2MeHelpers.isPhone())
            return;

        let standard = 'read2me-design-standard';
        let minimal = 'read2me-design-minimal';
        let parentWidth = Read2MeHelpers.getElementsWidthWithoutPadding(this.wrapper.parentNode);
        let activeDesign = this.wrapper.classList.contains(standard) ? 'standard' : 'minimal';

        if (parentWidth < 570 && activeDesign === 'standard') {
            this.wrapper.classList.remove(standard);
            this.wrapper.classList.add(minimal);
        } else if (parentWidth > 570 && activeDesign === 'minimal') {
            // take it back to what it was set to in case parent's width increases
            this.wrapper.classList.remove(minimal);
            this.wrapper.classList.add(standard);
        }
    }

    setTheme() {
        if (this.theme === null)
            this.wrapper.classList.add('preset-white');
        else
            this.wrapper.classList.add('preset-' + this.theme);
    }

    setColors() {
        if (!this.colors)
            return;

        let primaryRgb = Read2MeHelpers.hexToRgb(this.primaryColor);
        let secondaryRgb = Read2MeHelpers.hexToRgb(this.secondaryColor);

        if (primaryRgb === null || secondaryRgb === null)
            throw new Error('data-colors must be in hexadecimal format');

        this.playbackContainer.style['background-color'] = this.primaryColor;
        this.phonePlaybackContainer.style['background-color'] = this.primaryColor;
        this.phoneScrubber.style['background-color'] = this.primaryColor;

        let analyticsTitleBackground = 'rgba(' + primaryRgb.r + ',' + primaryRgb.g + ',' + primaryRgb.b + ',0.2)';
        this.analytics.querySelector('.read2me-analytics-title').style.background = analyticsTitleBackground;

        let phoneUiBackground = 'rgba(' + primaryRgb.r + ',' + primaryRgb.g + ',' + primaryRgb.b + ',0.1)';
        this.phoneUi.style['background-color'] = phoneUiBackground;

        let hoverCss =
            '#' + this.wrapper.id + ' .read2me-player-playback:hover {' +
                'background-color: ' + this.secondaryColor + ' !important;' +
            '}' +
            '#' + this.wrapper.id + ' .read2me-player-playback:hover svg,' +
            '#' + this.wrapper.id + ' .read2me-player svg.read2me-player-rewind:hover,' +
            '#' + this.wrapper.id + ' .read2me-player svg.read2me-player-forward:hover {' +
                'fill: ' + this.primaryColor + ' !important;' +
            '}' +
            '#' + this.wrapper.id + '.preset-green .read2me-dropdown a:hover {' +
                'background-color: #fbb99d !important;' +
            '}';

        let style = document.createElement('style');
        style.appendChild(document.createTextNode(hoverCss));
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    setWidth() {
        if (Read2MeHelpers.isPhone()) {
            this.player.style.width = this.wrapper.style.width = this.phoneUi.style.width = '100%';

            return;
        }

        if (this.width === null) {
            this.wrapper.style.width = this.player.style.width = '570px';
        } else {
            this.wrapper.style.width = this.player.style.width = this.phoneUi.style.width = this.width;
        }
    }

    isPlayButtonShown() {
        let isPhoneButtonShown = this.phonePlaybackContainer.classList.contains(this.phonePausedClass);
        let isDesktopButtonShown = !this.play.classList.contains('hidden');

        return isPhoneButtonShown && isDesktopButtonShown;
    }

    displayPlayButton() {
        this.play.classList.remove('hidden');
        this.pause.classList.add('hidden');
        this.replay.classList.add('hidden');
        this.phonePlaybackContainer.classList.add(this.phonePausedClass);
        this.phonePlaybackContainer.classList.remove(this.phonePlayingClass);
        this.phonePlaybackContainer.classList.remove(this.phoneFinishedClass);
    }

    isPauseButtonShown() {
        let phonePausedShown = this.phonePlaybackContainer.classList.contains(this.phonePlayingClass);
        let desktopPauseShown = !this.pause.classList.contains('hidden');

        return phonePausedShown && desktopPauseShown;
    }

    displayPauseButton() {
        this.pause.classList.remove('hidden');
        this.play.classList.add('hidden');
        this.replay.classList.add('hidden');
        this.phonePlaybackContainer.classList.add(this.phonePlayingClass);
        this.phonePlaybackContainer.classList.remove(this.phonePausedClass);
        this.phonePlaybackContainer.classList.remove(this.phoneFinishedClass);
    }

    isReplayButtonShown() {
        let phoneReplayShown = this.phonePlaybackContainer.classList.contains(this.phoneFinishedClass);
        let desktopReplayShown = !this.replay.classList.contains('hidden');

        return phoneReplayShown && desktopReplayShown;
    }

    displayReplayButton() {
        this.play.classList.add('hidden');
        this.pause.classList.add('hidden');
        this.replay.classList.remove('hidden');
        this.phonePlaybackContainer.classList.remove(this.phonePlayingClass);
        this.phonePlaybackContainer.classList.add(this.phoneFinishedClass);
    }

    _isPlaybackEventPermitted(time) {
        // don't allow events to fire more than once per half a second
        let isPermitted = true;

        if (Date.now() - this.lastPlaybackEvent < time)
            isPermitted = false;
        else
            this.lastPlaybackEvent = Date.now();

        return isPermitted;
    }

    handlePlayback() {
        [this.playbackContainer, this.phonePlaybackContainer].forEach( (elem, index) => {
            ['click', 'touchend'].forEach(eventType => {
                elem.addEventListener(eventType, () => {
                    if (!this._isPlaybackEventPermitted(500))
                        return;

                    if (this.isPlayButtonShown()) {
                        this.audioController.play();
                        this.displayPauseButton();

                        // if there's a click on standard design player and
                        // the stage2 view is not active, activate it
                        if (index === 0 && eventType === 'click' && !this.isPhoneStage2Active())
                            this.activatePhoneStage2();
                    } else if (this.isPauseButtonShown()) {
                        this.audioController.pause();
                        this.displayPlayButton();
                    } else if (this.isReplayButtonShown()) {
                        this._setListeningSessionId();
                        this.audioController.replay();
                        this.displayPauseButton();
                    }
                });
            });
        });

        // PHONE CONTROLS
        // stage 1 to stage 2 transition
        this.phoneStage1.addEventListener('ontouchend' in document.documentElement ? "touchend" : "click", () => {
            if (this.isPhoneLoadingInitiated)
                return false;

            this.isPhoneLoadingInitiated = true;
            this.phoneStage1.classList.add('read2me-stage1-loading');
            this.audioController.play();
            this.displayPauseButton();

            let canPlayDesktop;

            canPlayDesktop = setInterval(() => {
                if (this.audioController.isReadyToPlay()) {
                    this.activatePhoneStage2();
                    clearInterval(canPlayDesktop);
                }
            }, 100);
        });
    }

    handleQuickControls() {
        let phoneRewind = this.phoneUi.querySelector('.read2me-player-rewind');
        let phoneForward = this.phoneUi.querySelector('.read2me-player-forward');
        let tabletDesktopRewind = this.player.querySelector('.read2me-player-rewind');
        let tabletDesktopForward = this.player.querySelector('.read2me-player-forward');

        phoneRewind.addEventListener('click', () => {
            this.audioController.rewindForXSeconds(10);

            if (this.isReplayButtonShown()) {
                this.displayPlayButton(); // tablet/desktop
            }
        });
        phoneForward.addEventListener('click', () => {
            this.audioController.forwardForXSeconds(10);
        });

        ['click', 'touchend'].forEach(eventType => {
            tabletDesktopRewind.addEventListener(eventType, () => {
                if (!this._isPlaybackEventPermitted(250))
                    return;

                this.audioController.rewindForXSeconds(10);

                if (this.isReplayButtonShown()) {
                    this.displayPlayButton(); // tablet/desktop
                }
            });

            tabletDesktopForward.addEventListener(eventType, () => {
                if (!this._isPlaybackEventPermitted(250))
                    return;

                this.audioController.forwardForXSeconds(10);
            });
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

        this.scrubberPhoneContainer.addEventListener('click', (e) => {
            let pt = e.changedTouches && e.changedTouches[0] || e;
            let barProperties = this.scrubberPhone.getBoundingClientRect();
            let percent = (pt.clientX - barProperties.left) / barProperties.width; // e.g. 0.82
            let percentReversed = 1 - percent;
            percentReversed = Math.round(percentReversed * 100); // in real %, e.g. 82%

            // update scrubber progress
            this.phoneScrubber.style['transform'] = 'translateX(-' + percentReversed + '%)';

            // update audio time
            this.audioController.setCurrentTime(Math.round(percent * this.audioController.getDuration()));
        });
    }

    handleSpeakingRateChange() {
        let phoneSpeakingRate = this.phoneUi.querySelector('.read2me-speaking-rate');
        let tabletDesktopSpeakingRate = this.player.querySelector('.read2me-speaking-rate');

        let callback = (elem) => {
            // allow from 0.5 to 1.5 using .25 as increments:
            // => 0.5, 0.75, 1, 1.25, 1.5
            // when 1.5 is tapped then go to 0.5
            elem.textContent = (parseFloat(elem.textContent) + 0.25).toString();

            if (parseFloat(elem.textContent) > 1.5)
                elem.textContent = '0.5';

            let newSpeed = elem.textContent;

            this.audioController.setPlaySpeed(parseFloat(newSpeed));
            phoneSpeakingRate.value = phoneSpeakingRate.innerHTML = newSpeed;
            tabletDesktopSpeakingRate.value = tabletDesktopSpeakingRate.innerHTML = newSpeed;
        };

        phoneSpeakingRate.addEventListener('click', () => {
            callback(phoneSpeakingRate);
        });

        ['click', 'touchend'].forEach(eventType => {
            tabletDesktopSpeakingRate.addEventListener(eventType, () => {
                if (!this._isPlaybackEventPermitted(250))
                    return;

                callback(tabletDesktopSpeakingRate);
            });
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
        this.menu.addEventListener('click', () => {
            this.menu.classList.toggle('read2me-dropdown-visible');
        });

        document.addEventListener('click', (e) => {
            let target = e.target || e.srcElement;

            if (!this.wrapper.contains(target))
                this.menu.classList.remove('read2me-dropdown-visible');

            if (
                !target.classList.contains('read2me-menu')
                &&
                !target.parentNode.classList.contains('read2me-menu')
                &&
                !target.parentNode.classList.contains('read2me-dropdown-trigger')
            ) {
                this.menu.classList.remove('read2me-dropdown-visible');
            }
        });

        this.displayAnalyticsLink.addEventListener('click', (e) => {
            if (this.highchart !== null) {
                this.wrapper.classList.add('read2me-analytics-view');

                e.preventDefault(); // prevents the browser from going to the top
                return;
            }

            this.displayLoader();

            // load Highcharts if doesn't already exist
            if (typeof Highcharts === 'undefined') {
                Read2MeHelpers.loadJs('https://code.highcharts.com/6.1/highcharts.js', () => {
                    this.isHighchartsJsLoaded = true;
                });
            } else {
                this.isHighchartsJsLoaded = true;
            }

            // load flags
            Read2MeHelpers.loadCss(
                'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.1.0/css/flag-icon.min.css',
                'read2me-flag-icon'
            );

            Read2MeAnalyticsBackendWrapper.getAnalytics(
                this.apiResponse.id,
                (response) => {
                    // success
                    if (response.result === 'no_data') {
                        this.hideLoader();
                        alert('Analytics will be available after the first playback');

                        return;
                    }

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

            e.preventDefault(); // prevents the browser from going to the top
        });

        this.refreshContentLink.addEventListener('click', (e) => {
            this.displayLoader();

            this.backendWrapper.refreshCreate(
                (response) => {
                    // cache invalidated and audio created
                    this.apiResponse = response.result;
                    this.changeAudioSource(this.apiResponse.audio_url, this.apiResponse.audio_length_seconds);
                },
                (response) => {
                    // error
                    this.hideLoader();
                    console.warn(response);
                }
            );

            e.preventDefault(); // prevents browser going to top
        });
    }

    changeAudioSource(source, duration) {
        let events = new Read2MeAudioEvents(this).getAll();

        this.audioController.pause();
        delete this.audioController;
        this.audioController = new Read2MeAudioController(source, events);

        this.configureSliders(duration);

        if (this.isPauseButtonShown()) // means it was playing
            this.audioController.play();

        // loader will be hidden automatically by the audio's canplay event
    }

    instantiateAnalytics(result) {
        this.highchart = Read2MeHelpers.getInterestDistributionHighchart(
            result, this.analytics.querySelector('.read2me-highcharts'), this._getGraphColorForTheme()
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

    _getGraphColorForTheme() {
        let color;

        if (this.hasColors)
            return this.primaryColor;

        switch (this.theme) {
            case 'blue':
                color = 'rgb(14,209,254)';
                break;
            case 'green':
                color = 'rgb(94,234,214)';
                break;
            default:
                color = 'rgb(112,112,112)';
        }

        return color;
    }

    handleAnalyticsMenuBindings() {
        let menuSlide1 = this.analytics.querySelector('.read2me-analytics-menu-slide1'); // trigger for playback & geo
        let menuSlide2 = this.analytics.querySelector('.read2me-analytics-menu-slide2'); // trigger for interest graph
        let slide2 = this.analytics.querySelector('.read2me-analytics-slide2'); // interest graph slide
        let title = this.analytics.querySelector('.read2me-analytics-title');

        menuSlide1.addEventListener('click', () => {
            // display interest graph
            slide2.classList.remove('read2me-analytics-slide2-visible');
            menuSlide1.classList.add('hidden');
            menuSlide2.classList.remove('hidden');
            title.classList.toggle('hidden');
        });

        menuSlide2.addEventListener('click', () => {
            // display playback and geo
            slide2.classList.add('read2me-analytics-slide2-visible');
            menuSlide2.classList.add('hidden');
            menuSlide1.classList.remove('hidden');
            title.classList.toggle('hidden');
        });

        this.closeAnalyticsLink.addEventListener('click', () => {
            this.wrapper.classList.remove('read2me-analytics-view');
        });
    }

    positionArticleFocusTitle() {
        if (parseInt(getComputedStyle(this.wrapper).width) > 570)
            this.analytics.querySelector('.read2me-analytics-title').style.left = '42.5%';
    }

    handleViewportResize() {
        window.addEventListener('resize', () => {
            this.setWidth();
            this.switchToMinimalDesignIfContainerTooNarrow();
            this.positionArticleFocusTitle();
        });
    }

    isPhoneStage2Active() {
        return this.wrapper.classList.contains('read2me-phone-stage2-active');
    }

    activatePhoneStage2() {
        this.wrapper.classList.add('read2me-phone-stage2-active');
    }
}