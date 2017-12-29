/**
 * Takes in an instance of Read2MeAudioController and blueprint properties,
 * spawns the HTML audio player and makes its UI elements reactive.
 */
class Read2MeWidgetPlayer {
    constructor(Read2MeAudioController, url, title, thumbnail, autoplay) {
        if (Read2MeAudioController.audio instanceof Audio === false)
            throw 'Invalid first param for Read2MeWidgetPlayer';

        this.url = url;
        this.title = title;
        this.thumbnail = thumbnail;
        this.autoplay = autoplay;
    }
}