import Read2MeBackendWrapper from "./Read2MeBackendWrapper";

export default class Read2MeAnalyticsBackendWrapper {
    static getAnalytics(audioId, successCallback, errorCallback) {
        let requestUri =
            Read2MeBackendWrapper.getBaseUrl() + 'analytics/' + audioId;

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

        if (Read2MeAnalyticsBackendWrapper._logContains(listeningSessionId, currentPlaybackTime))
            return;

        if (currentPlaybackTime % interval !== 0 && currentPlaybackTime !== audioDuration)
            return;

        let requestUri = Read2MeBackendWrapper.getBaseUrl() + 'analytics/' + audioId + '?' +
            'pt=' + currentPlaybackTime +
            '&lsid=' + listeningSessionId;

        const request = new XMLHttpRequest();
        request.open('POST', requestUri, true);
        request.send();

        Read2MeAnalyticsBackendWrapper._addToLog(listeningSessionId, currentPlaybackTime);
    }

    static _addToLog(listeningSessionId, currentPlaybackTime) {
        if (!Read2MeAnalyticsBackendWrapper._log)
            Read2MeAnalyticsBackendWrapper._log = {};

        if (!Read2MeAnalyticsBackendWrapper._log[listeningSessionId])
            Read2MeAnalyticsBackendWrapper._log[listeningSessionId] = [];

        Read2MeAnalyticsBackendWrapper._log[listeningSessionId].push(currentPlaybackTime);
    }

    static _logContains(listeningSessionId, currentPlaybackTime) {
        if (!Read2MeAnalyticsBackendWrapper._log)
            return false;

        if (!Read2MeAnalyticsBackendWrapper._log[listeningSessionId])
            return false;

        if (Read2MeAnalyticsBackendWrapper._log[listeningSessionId].indexOf(currentPlaybackTime) === -1)
            return false;

        return true;
    }

}