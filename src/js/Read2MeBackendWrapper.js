class Read2MeBackendWrapper {
    constructor(appId, url, cssSelectors = null, ignoreContentChange = false, requestSource = 'custom') {
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
            throw 'Third param to Read2MePlayer (cssSelectors) can be null or array.';

        if (typeof this.ignoreContentChange !== 'boolean')
            throw 'Fourth param to Read2MePlayer (ignoreContentChange) must be a boolean.';

        if (typeof this.requestSource !== 'string')
            throw 'Fifth param to Read2MeBackend must be a string';
    }

    _normaliseParams() {
        if (typeof this.cssSelectors === 'undefined' || this.cssSelectors === null)
            this.cssSelectors = [];
    }

    _getIgnoreContentChangeAsString() {
        return this.ignoreContentChange ? 'true' : 'false';
    }

    getRequestUri() {
        return this.apiUrl +
            '?url=' + encodeURIComponent(this.url) +
            '&css_selectors=' + encodeURIComponent(this.cssSelectors.join('|')) +
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
            console.warn('Connection to Read2Me API failed.');
        };

        request.send();
    }
}