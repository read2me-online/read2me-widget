import Read2MeHelpers from './Read2MeHelpers'
import Read2MePlayerBuilder from "./Read2MePlayerBuilder";
import Read2MePolyfills from "./Read2MePolyfills";
import Read2MeBackendWrapper from "./Read2MeBackendWrapper";
import Read2MeAnalyticsBackendWrapper from "./Read2MeAnalyticsBackendWrapper";

Read2MeHelpers.documentReady(() => {
    if (Read2MeHelpers.isIe())
        return false;

    Read2MePolyfills.forEach();
    Read2MePolyfills.ArrayFrom();
    Read2MePolyfills.findIndex();
    const playerBuilder = new Read2MePlayerBuilder();

    window.Read2Me = {
        PlayerInstances: playerBuilder.playerInstances,
        BackendWrapper: Read2MeBackendWrapper,
        AnalyticsBackendWrapper: Read2MeAnalyticsBackendWrapper
    };
});