/**
 * Looks for plug n' play widget blueprints and replaces them with
 * an actual interactive HTML player.
 */

class Read2MePlayerBuilder {
    constructor() {
        this.playerInstances = [];
        const cssTarget = '.read2me-widget';
        const elements = document.querySelectorAll(cssTarget);

        elements.forEach((elem) => {
            this._replaceBlueprintWithPlayer(elem);
        });
    }

    _replaceBlueprintWithPlayer(elem) {
        let appId = 2; // @TODO
        let url = elem.getAttribute('data-url');
        let autoplay = elem.getAttribute('data-autoplay'); // @TODO
        let cssSelectors = elem.getAttribute('data-css-selectors');
        let title = elem.getAttribute('data-title'); // @TODO
        let thumbnail = elem.getAttribute('data-thumbnail'); // @TODO
        let ignoreContentChange = elem.getAttribute('data-ignore-content-change');
        let theme = elem.getAttribute('data-player-theme');

        autoplay = this._booleanStringToBoolean(autoplay);
        cssSelectors = this._cssSelectorsStringToArray(cssSelectors);
        ignoreContentChange = this._booleanStringToBoolean(ignoreContentChange);

        let backendWrapper = new Read2MeBackendWrapper(appId, url, cssSelectors, ignoreContentChange, 'widget');
        this._makeApiCalls(backendWrapper, (responseResult) => {
            // success
            this.playerInstances.push(
                new Read2MeWidgetPlayer(
                    new Read2MeAudioController(responseResult.audio_url),
                    elem,
                    url,
                    title,
                    thumbnail,
                    autoplay,
                    this.playerInstances.length,
                    theme
                )
            );
        }, () => {
            // error
        });
    }

    _makeApiCalls(backendWrapper, success, error) {
        if (backendWrapper instanceof Read2MeBackendWrapper === false)
            throw 'Improper usage of _makeApiCalls, first arg must be an instance of Read2MeBackendWrapper';

        backendWrapper.get(
            // success
            (response) => {
                if (typeof success === 'function')
                    success(response.result);
            },

            // audio not found, create the audio
            () => {
                backendWrapper.create(
                    // audio created
                    (response) => {
                        if (typeof success === 'function')
                            success(response.result);
                    },
                    // failure, unable to create audio
                    (response) => {
                        if (typeof error === 'function')
                            error(response);
                        else
                            console.warn(response);
                    }
                )
            },

            // error
            (response) => {
                if (typeof error === 'function')
                    error(response);
                else
                    console.warn(response);
            }
        );
    }

    _cssSelectorsStringToArray(cssSelectors) {
        if (!cssSelectors)
            return;

        cssSelectors = cssSelectors.substring(1, cssSelectors.length - 1).split(',');
        cssSelectors = cssSelectors.map(selector => selector.trim());
        cssSelectors = cssSelectors.map(selector => this._trimByChar(selector, '"'));
        cssSelectors = cssSelectors.map(selector => this._trimByChar(selector, "'"));

        return cssSelectors;
    }

    _booleanStringToBoolean(value) {
        if (value === 'true')
            value = true;
        else if (value === 'false')
            value = false;
        else
            throw 'Unsupported value for ignoreContentChange (can be "true" or "false", as a string)';

        return value;
    }

    // https://stackoverflow.com/a/43333491/1325575
    _trimByChar(string, character) {
        const first = [...string].findIndex(char => char !== character);
        const last = [...string].reverse().findIndex(char => char !== character);

        return string.substring(first, string.length - last);
    }
}

Read2MeDocumentReady(() => {
    const playerBuilder = new Read2MePlayerBuilder();
});