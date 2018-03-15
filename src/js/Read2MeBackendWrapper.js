export default class Read2MeBackendWrapper {
    constructor(appId, url, cssSelectors = null, voice = null, ignoreContentChange = false, requestSource = 'custom') {
        this.apiUrl = Read2MeBackendWrapper.getBaseUrl();

        // set params as object properties
        this.appId = appId;
        this.url = url;
        this.cssSelectors = cssSelectors;
        this.voice = voice;
        this.ignoreContentChange = ignoreContentChange;
        this.requestSource = requestSource;

        this._validateRequiredParams();
        this._validateOptionalParams();
        this._normaliseParams();
    }

    static getBaseUrl() {
        return 'https://api-dev.read2me.online/convert/1.0.0/webpage/'; //@TODO change
    }

    _validateRequiredParams() {
        if (typeof this.appId === 'undefined')
            throw 'First param to Read2MePlayer must be an App Id.';

        if (typeof this.appId !== 'number')
            throw 'Public API key must be a number.';

        if (typeof this.url !== 'string')
            throw 'Second param to Read2MePlayer (url) must be a string.';

        if (this.url.length === 0)
            throw 'url must not be empty';
    }

    _validateOptionalParams() {
        if (this.cssSelectors !== null && typeof this.cssSelectors !== 'object')
            throw 'Third param to Read2MePlayer (cssSelectors) must be null or array.';

        if (this.voice !== null && typeof this.voice !== 'string')
            throw 'Fourth param to Read2MePlayer(voice) must be null or string';

        if (typeof this.ignoreContentChange !== 'boolean')
            throw 'Fifth param to Read2MePlayer (ignoreContentChange) must be a boolean.';

        if (typeof this.requestSource !== 'string')
            throw 'Sixth param to Read2MeBackend (requestSource) must be a string';
    }

    _normaliseParams() {
        if (typeof this.cssSelectors === 'undefined' || this.cssSelectors === null)
            this.cssSelectors = [];
    }

    _getIgnoreContentChangeAsString() {
        return this.ignoreContentChange ? 'true' : 'false';
    }

    getRequestUri() {
        let voice = this.voice !== null ? encodeURIComponent(this.voice) : '';

        return this.apiUrl +
            '?url=' + encodeURIComponent(this.url) +
            '&css_selectors=' + encodeURIComponent(this.cssSelectors.join('|')) +
            '&voice=' + voice +
            '&ignore_content_change=' + this._getIgnoreContentChangeAsString() +
            '&request_source=' + this.requestSource;
    }

    get(audioFoundCallback, audioNotFoundCallback, errorCallback) {
        const request = new XMLHttpRequest();
        request.open('GET', this.getRequestUri(), true);
        request.setRequestHeader('X-App-Id', this.appId);

        request.onload = function() {
            const response = JSON.parse(request.responseText);

            if (request.status >= 200 && request.status < 400) {
                audioFoundCallback(response);
            } else if (request.status === 404) {
                audioNotFoundCallback(response)
            } else {
                errorCallback(response);
            }
        };

        request.onerror = function() {
            errorCallback();
            console.warn('Connection to Read2Me backend API failed.');
        };

        request.send();
    }

    create(audioCreatedCallback, errorCallback) {
        const request = new XMLHttpRequest();
        request.open('POST', this.getRequestUri(), true);
        request.setRequestHeader('X-App-Id', this.appId);

        request.onload = function() {
            const response = JSON.parse(request.responseText);

            if (request.status >= 200 && request.status < 400) {
                audioCreatedCallback(response);
            } else {
                errorCallback(response);
            }
        };

        request.onerror = function() {
            errorCallback();
            console.warn('Connection to Read2Me API failed.');
        };

        request.send();
    }

    deleteCache(successCallback, errorCallback) {
        let requestUrl = this.apiUrl + 'cache/?' +
            'url=' + encodeURIComponent(this.url);

        const request = new XMLHttpRequest();
        request.open('DELETE', requestUrl, true);
        request.setRequestHeader('X-App-Id', this.appId);

        request.onload = function() {
            const response = JSON.parse(request.responseText);

            if (request.status >= 200 && request.status < 400) {
                successCallback(response);
            } else {
                errorCallback(response);
            }
        };

        request.onerror = function() {
            errorCallback();
            console.warn('Connection to Read2Me API failed.');
        };

        request.send();
    }

    refreshCreate(audioCreatedCallback, errorCallback) {
        this.deleteCache(
            (response) => {
                // cache invalidation - success
                this.create(
                    (response) => {
                        // audio created - success
                        audioCreatedCallback(response);

                    },
                    (response) => {
                        // audio not created - error
                        errorCallback(response);
                    }
                )
            },
            (response) => {
                // cache not invalidated - error
                errorCallback(response);
            }
        );
    }

    static sendAnalytics(audioId, currentPlaybackTime, audioDuration, listeningSessionId) {
        const interval = 15;
        currentPlaybackTime = Math.round(currentPlaybackTime);
        audioDuration = Math.round(audioDuration);

        if (currentPlaybackTime % interval !== 0 && currentPlaybackTime !== audioDuration)
            return;

        let requestUri = Read2MeBackendWrapper.getBaseUrl() + 'analytics/?' +
            'aid=' + audioId +
            '&pt=' + currentPlaybackTime +
            '&lsid=' + listeningSessionId;

        const request = new XMLHttpRequest();
        request.open('POST', requestUri, true);
        request.send();
    }
}