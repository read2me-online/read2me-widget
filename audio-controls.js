// class Read2MePlayer {
//     constructor(appId, url, cssSelectors, ignoreContentChange) {
//         this.eventListeners = {};
//         this.audio = new Audio();
//         this.isPlaying = false;
//         this.backend = new Read2MeBackend(appId, url, cssSelectors, ignoreContentChange);
//         return this;
//     }
//
//     play() {
//
//     }
//
//     get status() {
//
//     }
//     set status(value) {
//
//     }
//
// }

var Read2MePlayer = function(appId, url, cssSelectors, ignoreContentChange) {
    this.eventListeners = {};
    this.audio = new Audio();
    this.isPlaying = false;
    this.backend = new Read2MeBackend(appId, url, cssSelectors, ignoreContentChange);

    return this;
};

Read2MePlayer.prototype.play = function() {
    this.audio.play();
    this.isPlaying = true;
};

Read2MePlayer.prototype.pause = function() {
    this.audio.pause();
    this.isPlaying = false;
};

Read2MePlayer.prototype.stop = function() {
    this.setCurrentTime(0);
    this.isPlaying = false;
};

Read2MePlayer.prototype.replay = function() {
    this.setCurrentTime(0);
    this.play();
};

Read2MePlayer.prototype.isPlaying = function() {
    return this.isPlaying;
};

Read2MePlayer.prototype.setCurrentTime = function(time) {
    this.audio.currentTime = time;
};

Read2MePlayer.prototype.getCurrentTime = function() {
    return this.audio.getCurrentTime;
};

Read2MePlayer.prototype.setPlaySpeed = function(speed) {
    this.audio.playbackRate = speed;
};

Read2MePlayer.prototype.getPlaySpeed = function() {
    return this.audio.playbackRate;
};

Read2MePlayer.prototype.addEventListener = function(event, callback) {
    this.eventListeners[event] = callback;
};

Read2MePlayer.prototype.removeEventListener = function(event) {
    delete this.eventListeners[event];
};

Read2MePlayer.prototype.render = function() {
    var self = this;

    this.backend.get(
        function(response) { // success, audio found
            self.audio.src = response.result.audio_url;
        },
        function(response) { // audio not found, create the audio
            self.backend.create(
                function(response) { // success, audio created and can be used
                    self.audio.src = response.result.audio_url;
                },
                function (response) { // failure, unable to create audio
                    console.warn(response);
                }
            )
        },
        function(response) { // error
            console.warn(response);
        }
    );

    if (typeof self.eventListeners['ready'] === 'function')
        self.eventListeners['ready']();
};
