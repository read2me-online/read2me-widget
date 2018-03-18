import Read2MeBackendWrapper from "./Read2MeBackendWrapper";

export default class Read2MeAnalyticsBackendWrapper {
    static getAnalytics(audioId, successCallback, errorCallback) {
        let requestUri =
            Read2MeBackendWrapper.getBaseUrl() + 'analytics/?' +
            'aid=' + audioId;

        const request = new XMLHttpRequest();
        request.open('GET', requestUri, true);

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