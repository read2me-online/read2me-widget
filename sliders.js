var sliders = [];

sliders.push(new Slider('#read2me-widget-scrubber-player-1', {
    tooltip_position:'bottom',

    formatter: function (value) {
        return value;
    }
}));
sliders.push(new Slider('#read2me-widget-player-speaking-rate-1', {
    tooltip_position:'bottom',

    formatter: function (value) {
        return value + 'x';
    }
}));