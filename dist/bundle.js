'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Read2MeBackend = function () {
    function Read2MeBackend(appId, url, cssSelectors, ignoreContentChange) {
        _classCallCheck(this, Read2MeBackend);

        this.apiUrl = 'https://api-dev.read2me.online/convert/1.0.0/webpage/'; //@TODO change

        // check for illegal params
        if (typeof appId === 'undefined') throw 'First param to Read2MePlayer must be an App Id.';

        if (typeof appId !== 'number') throw 'Public API key must be a number.';

        if (typeof url !== 'string') throw 'Second param to Read2MePlayer (url) must be a string.';

        if (url.length === 0) throw 'url must not be empty';

        if (typeof cssSelectors !== 'undefined' && cssSelectors !== null && (typeof cssSelectors === 'undefined' ? 'undefined' : _typeof(cssSelectors)) !== 'object') throw 'Third param to Read2MePlayer (cssSelectors) can be omitted, null or array.';

        if (typeof ignoreContentChange !== 'undefined' && ignoreContentChange !== null && typeof ignoreContentChange !== 'boolean') throw 'Fourth param to Read2MePlayer (ignoreContentChange) can be omitted, null or a boolean.';

        // set params as object properties
        this.appId = appId;
        this.url = url;
        this.cssSelectors = cssSelectors;
        this.ignoreContentChange = ignoreContentChange;

        // normalize certain params
        if (typeof this.cssSelectors === 'undefined' || this.cssSelectors === null) this.cssSelectors = [];

        if (typeof this.ignoreContentChange === 'undefined' || this.ignoreContentChange === null) this.ignoreContentChange = false;
    }

    _createClass(Read2MeBackend, [{
        key: '_getIgnoreContentChangeAsString',
        value: function _getIgnoreContentChangeAsString() {
            return this.ignoreContentChange ? 'true' : 'false';
        }
    }, {
        key: 'getRequestUri',
        value: function getRequestUri() {
            return this.apiUrl + '?url=' + encodeURIComponent(this.url) + '&css_selectors=' + encodeURIComponent(this.cssSelectors.join('|')) + '&ignore_content_change=' + this._getIgnoreContentChangeAsString();
        }
    }, {
        key: 'get',
        value: function get(audioFoundCallback, audioNotFoundCallback, errorCallback) {
            var request = new XMLHttpRequest();
            request.open('GET', this.getRequestUri(), true);
            request.setRequestHeader('X-App-Id', this.appId);

            request.onload = function () {
                var response = JSON.parse(request.responseText);

                if (request.status >= 200 && request.status < 400) {
                    audioFoundCallback(response);
                } else if (request.status === 404) {
                    audioNotFoundCallback(response);
                } else {
                    errorCallback(response);
                }
            };

            request.onerror = function () {
                console.warn('Connection to Read2Me backend API failed.');
            };

            request.send();
        }
    }, {
        key: 'create',
        value: function create(audioCreatedCallback, errorCallback) {
            var request = new XMLHttpRequest();
            request.open('POST', this.getRequestUri(), true);
            request.setRequestHeader('X-App-Id', this.appId);

            request.onload = function () {
                var response = JSON.parse(request.responseText);

                if (request.status >= 200 && request.status < 400) {
                    audioCreatedCallback(response);
                } else {
                    errorCallback(response);
                }
            };

            request.onerror = function () {
                console.warn('Connection to Read2Me API failed.');
            };

            request.send();
        }
    }]);

    return Read2MeBackend;
}();

var Read2MePlayer = function () {
    function Read2MePlayer(appId, url, cssSelectors, ignoreContentChange) {
        _classCallCheck(this, Read2MePlayer);

        this.eventListeners = {};
        this.audio = new Audio();
        this.isPlaying = false;
        this.backend = new Read2MeBackend(appId, url, cssSelectors, ignoreContentChange);
    }

    _createClass(Read2MePlayer, [{
        key: 'play',
        value: function play() {
            this.audio.play();
            this.isPlaying = true;
        }
    }, {
        key: 'pause',
        value: function pause() {
            this.audio.pause();
            this.isPlaying = false;
        }
    }, {
        key: 'stop',
        value: function stop() {
            this.setCurrentTime(0);
            this.isPlaying = false;
        }
    }, {
        key: 'replay',
        value: function replay() {
            this.setCurrentTime(0);
            this.play();
        }
    }, {
        key: 'isPlaying',
        value: function isPlaying() {
            return this.isPlaying;
        }
    }, {
        key: 'setCurrentTime',
        value: function setCurrentTime(time) {
            this.audio.currentTime = time;
        }
    }, {
        key: 'getCurrentTime',
        value: function getCurrentTime() {
            return this.audio.getCurrentTime;
        }
    }, {
        key: 'setPlaySpeed',
        value: function setPlaySpeed(speed) {
            this.audio.playbackRate = speed;
        }
    }, {
        key: 'getPlaySpeed',
        value: function getPlaySpeed() {
            return this.audio.playbackRate;
        }
    }, {
        key: 'addEventListener',
        value: function addEventListener(event, callback) {
            this.eventListeners[event] = callback;
        }
    }, {
        key: 'removeEventListener',
        value: function removeEventListener(event) {
            delete this.eventListeners[event];
        }
    }, {
        key: 'render',
        value: function render() {
            var _this = this;

            this.backend.get(
            // success
            function (response) {
                _this.audio.src = response.result.audio_url;
            },

            // audio not found, create the audio
            function () {
                _this.backend.create(
                // audio created
                function (response) {
                    _this.audio.src = response.result.audio_url;
                },
                // failure, unable to create audio
                function (response) {
                    console.warn(response);
                });
            },

            // error
            function (response) {
                console.warn(response);
            });

            if (typeof this.eventListeners['ready'] === 'function') this.eventListeners['ready']();
        }
    }]);

    return Read2MePlayer;
}();

var Read2MePlayerBuilder = function () {
    function Read2MePlayerBuilder() {
        _classCallCheck(this, Read2MePlayerBuilder);

        var cssTarget = '.read2me-widget';
        var elements = document.querySelectorAll(cssTarget);

        elements.forEach(function (elem) {
            Read2MePlayerBuilder._replaceBlueprintWithPlayer(elem);
        });
    }

    _createClass(Read2MePlayerBuilder, null, [{
        key: '_replaceBlueprintWithPlayer',
        value: function _replaceBlueprintWithPlayer(elem) {
            var url = elem.getAttribute('data-url');
            var autoplay = elem.getAttribute('data-autoplay');
            var sections = elem.getAttribute('data-sections');
            var title = elem.getAttribute('data-title');
            var thumbnail = elem.getAttribute('data-thumbnail');
            var ignoreContentChange = elem.getAttribute('data-ignore-content-change');

            new Read2MePlayer(2, url, sections, ignoreContentChange);
        }
    }]);

    return Read2MePlayerBuilder;
}();