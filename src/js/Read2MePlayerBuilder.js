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
        let autoplay = elem.getAttribute('data-autoplay');
        let sections = elem.getAttribute('data-sections');
        let title = elem.getAttribute('data-title');
        let thumbnail = elem.getAttribute('data-thumbnail');
        let ignoreContentChange = elem.getAttribute('data-ignore-content-change');

        const player = new Read2MePlayer(appId, url, sections, ignoreContentChange);
    }
}