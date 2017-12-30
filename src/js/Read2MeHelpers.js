class Read2MeHelpers {
    static documentReady(fn) {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    static secondsToHumanReadableArray(durationInSeconds) {
        let hours, minutes, seconds;

        hours = Math.floor(durationInSeconds / 3600);
        minutes = Math.floor((durationInSeconds / 60) % 60);
        seconds = Math.floor(durationInSeconds % 60);

        return [seconds, minutes, hours];
    }

    static secondsMinutesHoursToHumanReadable(seconds, minutes, hours) {
        let res = '';
        seconds = seconds.toString();
        minutes = minutes.toString();
        hours = hours.toString();

        // only show hours if hours > 0
        if (hours > 0) {
            if (hours.length < 2)
                hours = '0' + hours;

            res += hours + ':';
        }

        if (minutes.length < 2)
            minutes = '0' + minutes;

        if (seconds.length < 2)
            seconds = '0' + seconds;

        res += minutes + ':' + seconds;

        return res;
    }

    static getPageTitle() {
        let title = document.querySelector('title');

        return title === null ? null : title.text;
    }

    static getOgImageUrl() {
        let tag = document.querySelector("meta[property='og:image']");

        return tag === null ? null : tag.getAttribute('content');
    }

    static getWidgetTemplate() {
        return document.querySelector('.read2me-widget-player.read2me-template').cloneNode(true);
    }
}