class Read2MePlayerBuilder {
    constructor() {
        const cssTarget = '.read2me-widget';
        const elements = document.querySelectorAll(cssTarget);

        elements.forEach((elem) => {
            Read2MePlayerBuilder._replaceBlueprintWithPlayer(elem);
        });
    }

    static _replaceBlueprintWithPlayer(elem) {
        let appId = 2; // @TODO
        let url = elem.getAttribute('data-url');
        let autoplay = elem.getAttribute('data-autoplay'); // @TODO
        let cssSelectors = elem.getAttribute('data-css-selectors');
        let title = elem.getAttribute('data-title'); // @TODO
        let thumbnail = elem.getAttribute('data-thumbnail'); // @TODO
        let ignoreContentChange = elem.getAttribute('data-ignore-content-change');

        autoplay = this._booleanStringToBoolean(autoplay);
        cssSelectors = this._cssSelectorsStringToArray(cssSelectors);
        ignoreContentChange = this._booleanStringToBoolean(ignoreContentChange);

        const player = new Read2MePlayer(appId, url, cssSelectors, ignoreContentChange);
        player.render();
    }

    static _cssSelectorsStringToArray(cssSelectors) {
        if (!cssSelectors)
            return;

        cssSelectors = cssSelectors.substring(1, cssSelectors.length - 1).split(',');
        cssSelectors = cssSelectors.map(selector => selector.trim());
        cssSelectors = cssSelectors.map(selector => this._trimByChar(selector, '"'));
        cssSelectors = cssSelectors.map(selector => this._trimByChar(selector, "'"));

        return cssSelectors;
    }

    static _booleanStringToBoolean(value) {
        if (value === 'true')
            value = true;
        else if (value === 'false')
            value = false;
        else
            throw 'Unsupported value for ignoreContentChange (can be "true" or "false", as a string)';

        return value;
    }

    // https://stackoverflow.com/a/43333491/1325575
    static _trimByChar(string, character) {
        const first = [...string].findIndex(char => char !== character);
        const last = [...string].reverse().findIndex(char => char !== character);

        return string.substring(first, string.length - last);
    }
}

Read2MeDocumentReady(() => {
    const playerBuilder = new Read2MePlayerBuilder();
});