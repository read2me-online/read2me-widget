'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Read2MeBackendWrapper = function () {
    function Read2MeBackendWrapper(appId, url) {
        var cssSelectors = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var ignoreContentChange = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        var requestSource = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'custom';

        _classCallCheck(this, Read2MeBackendWrapper);

        this.apiUrl = 'https://api-dev.read2me.online/convert/1.0.0/webpage/'; //@TODO change

        // set params as object properties
        this.appId = appId;
        this.url = url;
        this.cssSelectors = cssSelectors;
        this.ignoreContentChange = ignoreContentChange;
        this.requestSource = requestSource;

        this._validateRequiredParams();
        this._validateOptionalParams();
        this._normaliseParams();
    }

    _createClass(Read2MeBackendWrapper, [{
        key: '_validateRequiredParams',
        value: function _validateRequiredParams() {
            if (typeof this.appId === 'undefined') throw 'First param to Read2MePlayer must be an App Id.';

            if (typeof this.appId !== 'number') throw 'Public API key must be a number.';

            if (typeof this.url !== 'string') throw 'Second param to Read2MePlayer (url) must be a string.';

            if (this.url.length === 0) throw 'url must not be empty';
        }
    }, {
        key: '_validateOptionalParams',
        value: function _validateOptionalParams() {
            if (this.cssSelectors !== null && _typeof(this.cssSelectors) !== 'object') throw 'Third param to Read2MePlayer (cssSelectors) can be null or array.';

            if (typeof this.ignoreContentChange !== 'boolean') throw 'Fourth param to Read2MePlayer (ignoreContentChange) must be a boolean.';

            if (typeof this.requestSource !== 'string') throw 'Fifth param to Read2MeBackend must be a string';
        }
    }, {
        key: '_normaliseParams',
        value: function _normaliseParams() {
            if (typeof this.cssSelectors === 'undefined' || this.cssSelectors === null) this.cssSelectors = [];
        }
    }, {
        key: '_getIgnoreContentChangeAsString',
        value: function _getIgnoreContentChangeAsString() {
            return this.ignoreContentChange ? 'true' : 'false';
        }
    }, {
        key: 'getRequestUri',
        value: function getRequestUri() {
            return this.apiUrl + '?url=' + encodeURIComponent(this.url) + '&css_selectors=' + encodeURIComponent(this.cssSelectors.join('|')) + '&ignore_content_change=' + this._getIgnoreContentChangeAsString() + '&request_source=' + this.requestSource;
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
                errorCallback();
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
                errorCallback();
                console.warn('Connection to Read2Me API failed.');
            };

            request.send();
        }
    }]);

    return Read2MeBackendWrapper;
}();