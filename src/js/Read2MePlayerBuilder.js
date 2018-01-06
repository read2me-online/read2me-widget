/**
 * Looks for plug n' play widget blueprints and replaces them with
 * an actual interactive HTML player.
 */

class Read2MePlayerBuilder {
    constructor() {
        this.playerInstances = [];
        const cssTarget = '.read2me-widget';
        const elements = document.querySelectorAll(cssTarget);

        elements.forEach(elem => {
            this._replaceBlueprintWithPlayer(elem);
        });
    }

    _replaceBlueprintWithPlayer(elem) {
        let appId = parseInt(elem.getAttribute('data-app-id'));
        let url = elem.getAttribute('data-url');
        let autoplay = elem.getAttribute('data-autoplay');
        let cssSelectors = elem.getAttribute('data-css-selectors');
        let title = elem.getAttribute('data-title');
        let thumbnail = elem.getAttribute('data-thumbnail');
        let ignoreContentChange = elem.getAttribute('data-ignore-content-change');
        let theme = elem.getAttribute('data-player-theme');
        let width = elem.getAttribute('data-player-width');

        autoplay = this._booleanStringToBoolean(autoplay);
        cssSelectors = this._cssSelectorsStringToArray(cssSelectors);
        ignoreContentChange = this._booleanStringToBoolean(ignoreContentChange);

        let backendWrapper = new Read2MeBackendWrapper(appId, url, cssSelectors, ignoreContentChange, 'widget');
        let playerId = this.playerInstances.length;
        this.playerInstances[playerId] =
            new Read2MeWidgetPlayer(elem, url, title, thumbnail, autoplay, playerId, theme, width);

        this._makeApiCalls(backendWrapper, (responseResult) => {
            // success
            this.playerInstances[playerId]
                .finishInitialisation(new Read2MeAudioController(responseResult.audio_url), responseResult);
        }, (response) => {
            this.playerInstances[playerId].hideLoader();
            console.warn(response);
        });
    }

    _makeApiCalls(backendWrapper, success, error) {
        backendWrapper.get(
            // success
            (response) => {
                success(response.result);
            },
            // audio not found, create the audio
            () => {
                backendWrapper.create(
                    // audio created
                    (response) => {
                        success(response.result);
                    },
                    // failure, unable to create audio
                    (response) => {
                        error(response);
                    }
                )
            },
            // error
            (response) => {
                error(response);
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

Read2MeHelpers.documentReady(() => {
    const playerBuilder = new Read2MePlayerBuilder();
});