/**
 * Takes in an instance of Read2MeAudioController, widget blueprint node and blueprint properties,
 * replaces the blueprint node with the HTML audio player and makes the player's UI elements reactive.
 */
class Read2MeWidgetPlayer {
    constructor(Read2MeAudioController, widgetBlueprint, url, title, thumbnail, autoplay) {
        if (Read2MeAudioController.audio instanceof Audio === false)
            throw 'Invalid first param for Read2MeWidgetPlayer';

        this.url = url;
        this.title = title;
        this.thumbnail = thumbnail;
        this.autoplay = autoplay;

        let template = Read2MeWidgetPlayer.getTemplateClone();

        widgetBlueprint.parentNode.replaceChild(template, widgetBlueprint);
        template.classList.remove('read2me-template');
    }

    static getTemplateClone() {
        return document.querySelector('.read2me-widget-player.read2me-template').cloneNode(true);
    }
}