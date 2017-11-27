class Read2MeBackend {
    constructor(appId, url, cssSelectors, ignoreContentChange) {
        this.apiUrl = 'https://api-dev.read2me.online/convert/1.0.0/webpage/'; //@TODO change

        // check for illegal params
        if (typeof appId === 'undefined')
            throw 'First param to Read2MePlayer must be an App Id.';

        if (typeof appId !== 'number')
            throw 'Public API key must be a number.';

        if (typeof url !== 'string')
            throw 'Second param to Read2MePlayer (url) must be a string.';

        if (url.length === 0)
            throw 'url must not be empty';

        if (typeof cssSelectors !== 'undefined' && cssSelectors !== null && typeof cssSelectors !== 'object')
            throw 'Third param to Read2MePlayer (cssSelectors) can be omitted, null or array.';

        if (typeof ignoreContentChange !== 'undefined' && ignoreContentChange !== null && typeof ignoreContentChange !== 'boolean')
            throw 'Fourth param to Read2MePlayer (ignoreContentChange) can be omitted, null or a boolean.';

        // set params as object properties
        this.appId = appId;
        this.url = url;
        this.cssSelectors = cssSelectors;
        this.ignoreContentChange = ignoreContentChange;

        // normalize certain params
        if (typeof this.cssSelectors === 'undefined' || this.cssSelectors === null)
            this.cssSelectors = [];

        if (typeof this.ignoreContentChange === 'undefined' || this.ignoreContentChange === null)
            this.ignoreContentChange = false;
    }

    _getIgnoreContentChangeAsString() {
        return this.ignoreContentChange ? 'true' : 'false';
    }

    getRequestUri() {
        return this.apiUrl +
            '?url=' + encodeURIComponent(this.url) +
            '&css_selectors=' + encodeURIComponent(this.cssSelectors.join('|')) +
            '&ignore_content_change=' + this._getIgnoreContentChangeAsString();
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