export default class Read2MeHelpers {
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

    static getRemainingTime(duration, currentTime) {
        let remainingSeconds = Math.floor(duration - currentTime);

        if (remainingSeconds < 1)
            return '00:00';

        let remainingArray = Read2MeHelpers.secondsToHumanReadableArray(remainingSeconds);
        let remaining = Read2MeHelpers.secondsMinutesHoursToHumanReadable(
            remainingArray[0], remainingArray[1], remainingArray[2]
        );

        return '-' + remaining;
    }

    static getAllBlueprints() {
        return document.querySelectorAll('.read2me-widget');
    }

    static callbackForAllBlueprints(callback) {
        const widgets = this.getAllBlueprints();

        widgets.forEach(elem => {
            callback(elem);
        });
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
        return document.querySelector('.read2me-widget-wrapper.read2me-template').cloneNode(true);
    }

    static isIe()
    {
        let ua = window.navigator.userAgent;
        let msie = ua.indexOf("MSIE ");

        return msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./);
    }

    static isPhone() {
        return window.outerWidth < 768;
    }

    static isFirefox() {
        return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    }

    static isEdge() {
        return navigator.userAgent.indexOf('Edge') > -1;
    }

    static isSamsungBrowser() {
        return navigator.userAgent.indexOf('SamsungBrowser') > -1;
    }

    // source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    static getRandom4ByteUnsignedInt() {
        let min = 0;
        let max = 4294967295;

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static loadJs(url, callback) {
        let script = document.createElement('script');
        script.onload = function () {
            if (typeof callback === 'function')
                callback();
        };
        script.src = url;

        document.head.appendChild(script);
    }

    static loadCss(url, id) {
        if (document.getElementById(id)) // already inserted
            return;

        let head  = document.getElementsByTagName('head')[0];
        let link  = document.createElement('link');
        link.id   = id;
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href = url;
        link.media = 'all';
        head.appendChild(link);
    }

    static getInterestDistributionHighchart(result, container, colors) {
        let durationAxis = Object.keys(result.playback_count_per_second).map(Number);
        let countValues = Object.values(result.playback_count_per_second);

        return Highcharts.chart(container, {
            title: {
                text: null
            },
            legend: {
                enabled: false
            },
            xAxis: {
                title: {
                    text: null
                },
                min: 0.5,
                max: durationAxis.length - 1.5,
                startOnTick: false,
                endOnTick: false,
                lineWidth: 0,
                minorGridLineWidth: 0,
                lineColor: 'transparent',
                labels: {
                    enabled: false
                },
                minorTickLength: 0,
                tickLength: 0,
                categories: durationAxis
            },
            yAxis: {
                title: {
                    text: null
                },
                lineWidth: 0,
                minorGridLineWidth: 0,
                lineColor: 'transparent',
                labels: {
                    enabled: false
                },
                minorTickLength: 0,
                tickLength: 0,
                gridLineColor: 'transparent'
            },
            plotOptions: {
                series: {
                    marker: {
                        radius: 0,
                        lineColor: null, // inherit from series
                        symbol: 'circle',
                        states: {
                            hover: {
                                fillColor: null,
                                lineWidth: 2,
                                radius: 6
                            }
                        }
                    }
                }
            },
            series: [{
                data: countValues,
                type: 'areaspline'
            }],
            tooltip: {
                formatter: function() {
                    let index = this.point.index;
                    let tooltipData = result.playback_count_per_second_human_readable[index];
                    let count = tooltipData['count'];
                    let secondsToArray = Read2MeHelpers.secondsToHumanReadableArray(this.x);
                    let timeScrubberFormat = Read2MeHelpers.secondsMinutesHoursToHumanReadable(...secondsToArray);
                    
                    return 'Time: ' + timeScrubberFormat + '<br />Amount of people listened: ' + count;
                }
            },
            chart: {
                marginTop: 0,
                spacingBottom: 0,
                marginLeft: 0,
                spacingLeft: 0,
                marginRight: 0,
                style: {
                    fontFamily: 'Raleway'
                }
            },
            colors: [colors]
        });
    }
}