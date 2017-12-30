/*! =======================================================
                      VERSION  10.0.0              
========================================================= */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _typeof = "function" == typeof Symbol && "symbol" == _typeof2(Symbol.iterator) ? function (a) {
    return typeof a === "undefined" ? "undefined" : _typeof2(a);
} : function (a) {
    return a && "function" == typeof Symbol && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a === "undefined" ? "undefined" : _typeof2(a);
},
    windowIsDefined = "object" === ("undefined" == typeof window ? "undefined" : _typeof(window));!function (a) {
    if ("function" == typeof define && define.amd) define(["jquery"], a);else if ("object" === ("undefined" == typeof module ? "undefined" : _typeof(module)) && module.exports) {
        var b;try {
            b = require("jquery");
        } catch (c) {
            b = null;
        }module.exports = a(b);
    } else window && (window.Slider = a(window.jQuery));
}(function (a) {
    var b = "slider",
        c = "bootstrapSlider";windowIsDefined && !window.console && (window.console = {}), windowIsDefined && !window.console.log && (window.console.log = function () {}), windowIsDefined && !window.console.warn && (window.console.warn = function () {});var d;return function (a) {
        function b() {}function c(a) {
            function c(b) {
                b.prototype.option || (b.prototype.option = function (b) {
                    a.isPlainObject(b) && (this.options = a.extend(!0, this.options, b));
                });
            }function e(b, c) {
                a.fn[b] = function (e) {
                    if ("string" == typeof e) {
                        for (var g = d.call(arguments, 1), h = 0, i = this.length; i > h; h++) {
                            var j = this[h],
                                k = a.data(j, b);if (k) {
                                if (a.isFunction(k[e]) && "_" !== e.charAt(0)) {
                                    var l = k[e].apply(k, g);if (void 0 !== l && l !== k) return l;
                                } else f("no such method '" + e + "' for " + b + " instance");
                            } else f("cannot call methods on " + b + " prior to initialization; attempted to call '" + e + "'");
                        }return this;
                    }var m = this.map(function () {
                        var d = a.data(this, b);return d ? (d.option(e), d._init()) : (d = new c(this, e), a.data(this, b, d)), a(this);
                    });return !m || m.length > 1 ? m : m[0];
                };
            }if (a) {
                var f = "undefined" == typeof console ? b : function (a) {
                    console.error(a);
                };return a.bridget = function (a, b) {
                    c(b), e(a, b);
                }, a.bridget;
            }
        }var d = Array.prototype.slice;c(a);
    }(a), function (a) {
        function e(b, c) {
            function d(a, b) {
                var c = "data-slider-" + b.replace(/_/g, "-"),
                    d = a.getAttribute(c);try {
                    return JSON.parse(d);
                } catch (e) {
                    return d;
                }
            }this._state = { value: null, enabled: null, offset: null, size: null, percentage: null, inDrag: !1, over: !1 }, this.ticksCallbackMap = {}, this.handleCallbackMap = {}, "string" == typeof b ? this.element = document.querySelector(b) : b instanceof HTMLElement && (this.element = b), c = c ? c : {};for (var e = Object.keys(this.defaultOptions), f = 0; f < e.length; f++) {
                var h = e[f],
                    i = c[h];i = "undefined" != typeof i ? i : d(this.element, h), i = null !== i ? i : this.defaultOptions[h], this.options || (this.options = {}), this.options[h] = i;
            }"auto" === this.options.rtl && (this.options.rtl = "rtl" === window.getComputedStyle(this.element).direction), "vertical" !== this.options.orientation || "top" !== this.options.tooltip_position && "bottom" !== this.options.tooltip_position ? "horizontal" !== this.options.orientation || "left" !== this.options.tooltip_position && "right" !== this.options.tooltip_position || (this.options.tooltip_position = "top") : this.options.rtl ? this.options.tooltip_position = "left" : this.options.tooltip_position = "right";var j,
                k,
                l,
                m,
                n,
                o = this.element.style.width,
                p = !1,
                q = this.element.parentNode;if (this.sliderElem) p = !0;else {
                this.sliderElem = document.createElement("div"), this.sliderElem.className = "slider";var r = document.createElement("div");r.className = "slider-track", k = document.createElement("div"), k.className = "slider-track-low", j = document.createElement("div"), j.className = "slider-selection", l = document.createElement("div"), l.className = "slider-track-high", m = document.createElement("div"), m.className = "slider-handle min-slider-handle", m.setAttribute("role", "slider"), m.setAttribute("aria-valuemin", this.options.min), m.setAttribute("aria-valuemax", this.options.max), n = document.createElement("div"), n.className = "slider-handle max-slider-handle", n.setAttribute("role", "slider"), n.setAttribute("aria-valuemin", this.options.min), n.setAttribute("aria-valuemax", this.options.max), r.appendChild(k), r.appendChild(j), r.appendChild(l), this.rangeHighlightElements = [];var s = this.options.rangeHighlights;if (Array.isArray(s) && s.length > 0) for (var t = 0; t < s.length; t++) {
                    var u = document.createElement("div"),
                        v = s[t]["class"] || "";u.className = "slider-rangeHighlight slider-selection " + v, this.rangeHighlightElements.push(u), r.appendChild(u);
                }var w = Array.isArray(this.options.labelledby);if (w && this.options.labelledby[0] && m.setAttribute("aria-labelledby", this.options.labelledby[0]), w && this.options.labelledby[1] && n.setAttribute("aria-labelledby", this.options.labelledby[1]), !w && this.options.labelledby && (m.setAttribute("aria-labelledby", this.options.labelledby), n.setAttribute("aria-labelledby", this.options.labelledby)), this.ticks = [], Array.isArray(this.options.ticks) && this.options.ticks.length > 0) {
                    for (this.ticksContainer = document.createElement("div"), this.ticksContainer.className = "slider-tick-container", f = 0; f < this.options.ticks.length; f++) {
                        var x = document.createElement("div");if (x.className = "slider-tick", this.options.ticks_tooltip) {
                            var y = this._addTickListener(),
                                z = y.addMouseEnter(this, x, f),
                                A = y.addMouseLeave(this, x);this.ticksCallbackMap[f] = { mouseEnter: z, mouseLeave: A };
                        }this.ticks.push(x), this.ticksContainer.appendChild(x);
                    }j.className += " tick-slider-selection";
                }if (this.tickLabels = [], Array.isArray(this.options.ticks_labels) && this.options.ticks_labels.length > 0) for (this.tickLabelContainer = document.createElement("div"), this.tickLabelContainer.className = "slider-tick-label-container", f = 0; f < this.options.ticks_labels.length; f++) {
                    var B = document.createElement("div"),
                        C = 0 === this.options.ticks_positions.length,
                        D = this.options.reversed && C ? this.options.ticks_labels.length - (f + 1) : f;B.className = "slider-tick-label", B.innerHTML = this.options.ticks_labels[D], this.tickLabels.push(B), this.tickLabelContainer.appendChild(B);
                }var E = function E(a) {
                    var b = document.createElement("div");b.className = "tooltip-arrow";var c = document.createElement("div");c.className = "tooltip-inner", a.appendChild(b), a.appendChild(c);
                },
                    F = document.createElement("div");F.className = "tooltip tooltip-main", F.setAttribute("role", "presentation"), E(F);var G = document.createElement("div");G.className = "tooltip tooltip-min", G.setAttribute("role", "presentation"), E(G);var H = document.createElement("div");H.className = "tooltip tooltip-max", H.setAttribute("role", "presentation"), E(H), this.sliderElem.appendChild(r), this.sliderElem.appendChild(F), this.sliderElem.appendChild(G), this.sliderElem.appendChild(H), this.tickLabelContainer && this.sliderElem.appendChild(this.tickLabelContainer), this.ticksContainer && this.sliderElem.appendChild(this.ticksContainer), this.sliderElem.appendChild(m), this.sliderElem.appendChild(n), q.insertBefore(this.sliderElem, this.element), this.element.style.display = "none";
            }if (a && (this.$element = a(this.element), this.$sliderElem = a(this.sliderElem)), this.eventToCallbackMap = {}, this.sliderElem.id = this.options.id, this.touchCapable = "ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch, this.touchX = 0, this.touchY = 0, this.tooltip = this.sliderElem.querySelector(".tooltip-main"), this.tooltipInner = this.tooltip.querySelector(".tooltip-inner"), this.tooltip_min = this.sliderElem.querySelector(".tooltip-min"), this.tooltipInner_min = this.tooltip_min.querySelector(".tooltip-inner"), this.tooltip_max = this.sliderElem.querySelector(".tooltip-max"), this.tooltipInner_max = this.tooltip_max.querySelector(".tooltip-inner"), g[this.options.scale] && (this.options.scale = g[this.options.scale]), p === !0 && (this._removeClass(this.sliderElem, "slider-horizontal"), this._removeClass(this.sliderElem, "slider-vertical"), this._removeClass(this.sliderElem, "slider-rtl"), this._removeClass(this.tooltip, "hide"), this._removeClass(this.tooltip_min, "hide"), this._removeClass(this.tooltip_max, "hide"), ["left", "right", "top", "width", "height"].forEach(function (a) {
                this._removeProperty(this.trackLow, a), this._removeProperty(this.trackSelection, a), this._removeProperty(this.trackHigh, a);
            }, this), [this.handle1, this.handle2].forEach(function (a) {
                this._removeProperty(a, "left"), this._removeProperty(a, "right"), this._removeProperty(a, "top");
            }, this), [this.tooltip, this.tooltip_min, this.tooltip_max].forEach(function (a) {
                this._removeProperty(a, "left"), this._removeProperty(a, "right"), this._removeProperty(a, "top"), this._removeClass(a, "right"), this._removeClass(a, "left"), this._removeClass(a, "top");
            }, this)), "vertical" === this.options.orientation ? (this._addClass(this.sliderElem, "slider-vertical"), this.stylePos = "top", this.mousePos = "pageY", this.sizePos = "offsetHeight") : (this._addClass(this.sliderElem, "slider-horizontal"), this.sliderElem.style.width = o, this.options.orientation = "horizontal", this.options.rtl ? this.stylePos = "right" : this.stylePos = "left", this.mousePos = "pageX", this.sizePos = "offsetWidth"), this.options.rtl && this._addClass(this.sliderElem, "slider-rtl"), this._setTooltipPosition(), Array.isArray(this.options.ticks) && this.options.ticks.length > 0 && (this.options.max = Math.max.apply(Math, this.options.ticks), this.options.min = Math.min.apply(Math, this.options.ticks)), Array.isArray(this.options.value) ? (this.options.range = !0, this._state.value = this.options.value) : this.options.range ? this._state.value = [this.options.value, this.options.max] : this._state.value = this.options.value, this.trackLow = k || this.trackLow, this.trackSelection = j || this.trackSelection, this.trackHigh = l || this.trackHigh, "none" === this.options.selection ? (this._addClass(this.trackLow, "hide"), this._addClass(this.trackSelection, "hide"), this._addClass(this.trackHigh, "hide")) : ("after" === this.options.selection || "before" === this.options.selection) && (this._removeClass(this.trackLow, "hide"), this._removeClass(this.trackSelection, "hide"), this._removeClass(this.trackHigh, "hide")), this.handle1 = m || this.handle1, this.handle2 = n || this.handle2, p === !0) for (this._removeClass(this.handle1, "round triangle"), this._removeClass(this.handle2, "round triangle hide"), f = 0; f < this.ticks.length; f++) {
                this._removeClass(this.ticks[f], "round triangle hide");
            }var I = ["round", "triangle", "custom"],
                J = -1 !== I.indexOf(this.options.handle);if (J) for (this._addClass(this.handle1, this.options.handle), this._addClass(this.handle2, this.options.handle), f = 0; f < this.ticks.length; f++) {
                this._addClass(this.ticks[f], this.options.handle);
            }if (this._state.offset = this._offset(this.sliderElem), this._state.size = this.sliderElem[this.sizePos], this.setValue(this._state.value), this.handle1Keydown = this._keydown.bind(this, 0), this.handle1.addEventListener("keydown", this.handle1Keydown, !1), this.handle2Keydown = this._keydown.bind(this, 1), this.handle2.addEventListener("keydown", this.handle2Keydown, !1), this.mousedown = this._mousedown.bind(this), this.touchstart = this._touchstart.bind(this), this.touchmove = this._touchmove.bind(this), this.touchCapable) {
                var K = !1;try {
                    var L = Object.defineProperty({}, "passive", { get: function get() {
                            K = !0;
                        } });window.addEventListener("test", null, L);
                } catch (M) {}var N = K ? { passive: !0 } : !1;this.sliderElem.addEventListener("touchstart", this.touchstart, N), this.sliderElem.addEventListener("touchmove", this.touchmove, N);
            }if (this.sliderElem.addEventListener("mousedown", this.mousedown, !1), this.resize = this._resize.bind(this), window.addEventListener("resize", this.resize, !1), "hide" === this.options.tooltip) this._addClass(this.tooltip, "hide"), this._addClass(this.tooltip_min, "hide"), this._addClass(this.tooltip_max, "hide");else if ("always" === this.options.tooltip) this._showTooltip(), this._alwaysShowTooltip = !0;else {
                if (this.showTooltip = this._showTooltip.bind(this), this.hideTooltip = this._hideTooltip.bind(this), this.options.ticks_tooltip) {
                    var O = this._addTickListener(),
                        P = O.addMouseEnter(this, this.handle1),
                        Q = O.addMouseLeave(this, this.handle1);this.handleCallbackMap.handle1 = { mouseEnter: P, mouseLeave: Q }, P = O.addMouseEnter(this, this.handle2), Q = O.addMouseLeave(this, this.handle2), this.handleCallbackMap.handle2 = { mouseEnter: P, mouseLeave: Q };
                } else this.sliderElem.addEventListener("mouseenter", this.showTooltip, !1), this.sliderElem.addEventListener("mouseleave", this.hideTooltip, !1);this.handle1.addEventListener("focus", this.showTooltip, !1), this.handle1.addEventListener("blur", this.hideTooltip, !1), this.handle2.addEventListener("focus", this.showTooltip, !1), this.handle2.addEventListener("blur", this.hideTooltip, !1);
            }this.options.enabled ? this.enable() : this.disable();
        }var f = { formatInvalidInputErrorMsg: function formatInvalidInputErrorMsg(a) {
                return "Invalid input value '" + a + "' passed in";
            }, callingContextNotSliderInstance: "Calling context element does not have instance of Slider bound to it. Check your code to make sure the JQuery object returned from the call to the slider() initializer is calling the method" },
            g = { linear: { toValue: function toValue(a) {
                    var b = a / 100 * (this.options.max - this.options.min),
                        c = !0;if (this.options.ticks_positions.length > 0) {
                        for (var d, e, f, g = 0, h = 1; h < this.options.ticks_positions.length; h++) {
                            if (a <= this.options.ticks_positions[h]) {
                                d = this.options.ticks[h - 1], f = this.options.ticks_positions[h - 1], e = this.options.ticks[h], g = this.options.ticks_positions[h];break;
                            }
                        }var i = (a - f) / (g - f);b = d + i * (e - d), c = !1;
                    }var j = c ? this.options.min : 0,
                        k = j + Math.round(b / this.options.step) * this.options.step;return k < this.options.min ? this.options.min : k > this.options.max ? this.options.max : k;
                }, toPercentage: function toPercentage(a) {
                    if (this.options.max === this.options.min) return 0;if (this.options.ticks_positions.length > 0) {
                        for (var b, c, d, e = 0, f = 0; f < this.options.ticks.length; f++) {
                            if (a <= this.options.ticks[f]) {
                                b = f > 0 ? this.options.ticks[f - 1] : 0, d = f > 0 ? this.options.ticks_positions[f - 1] : 0, c = this.options.ticks[f], e = this.options.ticks_positions[f];break;
                            }
                        }if (f > 0) {
                            var g = (a - b) / (c - b);return d + g * (e - d);
                        }
                    }return 100 * (a - this.options.min) / (this.options.max - this.options.min);
                } }, logarithmic: { toValue: function toValue(a) {
                    var b = 0 === this.options.min ? 0 : Math.log(this.options.min),
                        c = Math.log(this.options.max),
                        d = Math.exp(b + (c - b) * a / 100);return Math.round(d) === this.options.max ? this.options.max : (d = this.options.min + Math.round((d - this.options.min) / this.options.step) * this.options.step, d < this.options.min ? this.options.min : d > this.options.max ? this.options.max : d);
                }, toPercentage: function toPercentage(a) {
                    if (this.options.max === this.options.min) return 0;var b = Math.log(this.options.max),
                        c = 0 === this.options.min ? 0 : Math.log(this.options.min),
                        d = 0 === a ? 0 : Math.log(a);return 100 * (d - c) / (b - c);
                } } };if (d = function d(a, b) {
            return e.call(this, a, b), this;
        }, d.prototype = { _init: function _init() {}, constructor: d, defaultOptions: { id: "", min: 0, max: 10, step: 1, precision: 0, orientation: "horizontal", value: 5, range: !1, selection: "before", tooltip: "show", tooltip_split: !1, handle: "round", reversed: !1, rtl: "auto", enabled: !0, formatter: function formatter(a) {
                    return Array.isArray(a) ? a[0] + " : " + a[1] : a;
                }, natural_arrow_keys: !1, ticks: [], ticks_positions: [], ticks_labels: [], ticks_snap_bounds: 0, ticks_tooltip: !1, scale: "linear", focus: !1, tooltip_position: null, labelledby: null, rangeHighlights: [] }, getElement: function getElement() {
                return this.sliderElem;
            }, getValue: function getValue() {
                return this.options.range ? this._state.value : this._state.value[0];
            }, setValue: function setValue(a, b, c) {
                a || (a = 0);var d = this.getValue();this._state.value = this._validateInputValue(a);var e = this._applyPrecision.bind(this);this.options.range ? (this._state.value[0] = e(this._state.value[0]), this._state.value[1] = e(this._state.value[1]), this._state.value[0] = Math.max(this.options.min, Math.min(this.options.max, this._state.value[0])), this._state.value[1] = Math.max(this.options.min, Math.min(this.options.max, this._state.value[1]))) : (this._state.value = e(this._state.value), this._state.value = [Math.max(this.options.min, Math.min(this.options.max, this._state.value))], this._addClass(this.handle2, "hide"), "after" === this.options.selection ? this._state.value[1] = this.options.max : this._state.value[1] = this.options.min), this.options.max > this.options.min ? this._state.percentage = [this._toPercentage(this._state.value[0]), this._toPercentage(this._state.value[1]), 100 * this.options.step / (this.options.max - this.options.min)] : this._state.percentage = [0, 0, 100], this._layout();var f = this.options.range ? this._state.value : this._state.value[0];return this._setDataVal(f), b === !0 && this._trigger("slide", f), d !== f && c === !0 && this._trigger("change", { oldValue: d, newValue: f }), this;
            }, destroy: function destroy() {
                this._removeSliderEventHandlers(), this.sliderElem.parentNode.removeChild(this.sliderElem), this.element.style.display = "", this._cleanUpEventCallbacksMap(), this.element.removeAttribute("data"), a && (this._unbindJQueryEventHandlers(), this.$element.removeData("slider"));
            }, disable: function disable() {
                return this._state.enabled = !1, this.handle1.removeAttribute("tabindex"), this.handle2.removeAttribute("tabindex"), this._addClass(this.sliderElem, "slider-disabled"), this._trigger("slideDisabled"), this;
            }, enable: function enable() {
                return this._state.enabled = !0, this.handle1.setAttribute("tabindex", 0), this.handle2.setAttribute("tabindex", 0), this._removeClass(this.sliderElem, "slider-disabled"), this._trigger("slideEnabled"), this;
            }, toggle: function toggle() {
                return this._state.enabled ? this.disable() : this.enable(), this;
            }, isEnabled: function isEnabled() {
                return this._state.enabled;
            }, on: function on(a, b) {
                return this._bindNonQueryEventHandler(a, b), this;
            }, off: function off(b, c) {
                a ? (this.$element.off(b, c), this.$sliderElem.off(b, c)) : this._unbindNonQueryEventHandler(b, c);
            }, getAttribute: function getAttribute(a) {
                return a ? this.options[a] : this.options;
            }, setAttribute: function setAttribute(a, b) {
                return this.options[a] = b, this;
            }, refresh: function refresh() {
                return this._removeSliderEventHandlers(), e.call(this, this.element, this.options), a && a.data(this.element, "slider", this), this;
            }, relayout: function relayout() {
                return this._resize(), this._layout(), this;
            }, _removeSliderEventHandlers: function _removeSliderEventHandlers() {
                if (this.handle1.removeEventListener("keydown", this.handle1Keydown, !1), this.handle2.removeEventListener("keydown", this.handle2Keydown, !1), this.options.ticks_tooltip) {
                    for (var a = this.ticksContainer.getElementsByClassName("slider-tick"), b = 0; b < a.length; b++) {
                        a[b].removeEventListener("mouseenter", this.ticksCallbackMap[b].mouseEnter, !1), a[b].removeEventListener("mouseleave", this.ticksCallbackMap[b].mouseLeave, !1);
                    }this.handle1.removeEventListener("mouseenter", this.handleCallbackMap.handle1.mouseEnter, !1), this.handle2.removeEventListener("mouseenter", this.handleCallbackMap.handle2.mouseEnter, !1), this.handle1.removeEventListener("mouseleave", this.handleCallbackMap.handle1.mouseLeave, !1), this.handle2.removeEventListener("mouseleave", this.handleCallbackMap.handle2.mouseLeave, !1);
                }this.handleCallbackMap = null, this.ticksCallbackMap = null, this.showTooltip && (this.handle1.removeEventListener("focus", this.showTooltip, !1), this.handle2.removeEventListener("focus", this.showTooltip, !1)), this.hideTooltip && (this.handle1.removeEventListener("blur", this.hideTooltip, !1), this.handle2.removeEventListener("blur", this.hideTooltip, !1)), this.showTooltip && this.sliderElem.removeEventListener("mouseenter", this.showTooltip, !1), this.hideTooltip && this.sliderElem.removeEventListener("mouseleave", this.hideTooltip, !1), this.sliderElem.removeEventListener("touchstart", this.touchstart, !1), this.sliderElem.removeEventListener("touchmove", this.touchmove, !1), this.sliderElem.removeEventListener("mousedown", this.mousedown, !1), window.removeEventListener("resize", this.resize, !1);
            }, _bindNonQueryEventHandler: function _bindNonQueryEventHandler(a, b) {
                void 0 === this.eventToCallbackMap[a] && (this.eventToCallbackMap[a] = []), this.eventToCallbackMap[a].push(b);
            }, _unbindNonQueryEventHandler: function _unbindNonQueryEventHandler(a, b) {
                var c = this.eventToCallbackMap[a];if (void 0 !== c) for (var d = 0; d < c.length; d++) {
                    if (c[d] === b) {
                        c.splice(d, 1);break;
                    }
                }
            }, _cleanUpEventCallbacksMap: function _cleanUpEventCallbacksMap() {
                for (var a = Object.keys(this.eventToCallbackMap), b = 0; b < a.length; b++) {
                    var c = a[b];delete this.eventToCallbackMap[c];
                }
            }, _showTooltip: function _showTooltip() {
                this.options.tooltip_split === !1 ? (this._addClass(this.tooltip, "in"), this.tooltip_min.style.display = "none", this.tooltip_max.style.display = "none") : (this._addClass(this.tooltip_min, "in"), this._addClass(this.tooltip_max, "in"), this.tooltip.style.display = "none"), this._state.over = !0;
            }, _hideTooltip: function _hideTooltip() {
                this._state.inDrag === !1 && this.alwaysShowTooltip !== !0 && (this._removeClass(this.tooltip, "in"), this._removeClass(this.tooltip_min, "in"), this._removeClass(this.tooltip_max, "in")), this._state.over = !1;
            }, _setToolTipOnMouseOver: function _setToolTipOnMouseOver(a) {
                function b(a, b) {
                    return b ? [100 - a.percentage[0], this.options.range ? 100 - a.percentage[1] : a.percentage[1]] : [a.percentage[0], a.percentage[1]];
                }var c = this.options.formatter(a ? a.value[0] : this._state.value[0]),
                    d = a ? b(a, this.options.reversed) : b(this._state, this.options.reversed);this._setText(this.tooltipInner, c), this.tooltip.style[this.stylePos] = d[0] + "%";
            }, _addTickListener: function _addTickListener() {
                return { addMouseEnter: function addMouseEnter(a, b, c) {
                        var d = function d() {
                            var b = a._state,
                                d = c >= 0 ? c : this.attributes["aria-valuenow"].value,
                                e = parseInt(d, 10);b.value[0] = e, b.percentage[0] = a.options.ticks_positions[e], a._setToolTipOnMouseOver(b), a._showTooltip();
                        };return b.addEventListener("mouseenter", d, !1), d;
                    }, addMouseLeave: function addMouseLeave(a, b) {
                        var c = function c() {
                            a._hideTooltip();
                        };return b.addEventListener("mouseleave", c, !1), c;
                    } };
            }, _layout: function _layout() {
                var a;if (a = this.options.reversed ? [100 - this._state.percentage[0], this.options.range ? 100 - this._state.percentage[1] : this._state.percentage[1]] : [this._state.percentage[0], this._state.percentage[1]], this.handle1.style[this.stylePos] = a[0] + "%", this.handle1.setAttribute("aria-valuenow", this._state.value[0]), isNaN(this.options.formatter(this._state.value[0])) && this.handle1.setAttribute("aria-valuetext", this.options.formatter(this._state.value[0])), this.handle2.style[this.stylePos] = a[1] + "%", this.handle2.setAttribute("aria-valuenow", this._state.value[1]), isNaN(this.options.formatter(this._state.value[1])) && this.handle2.setAttribute("aria-valuetext", this.options.formatter(this._state.value[1])), this.rangeHighlightElements.length > 0 && Array.isArray(this.options.rangeHighlights) && this.options.rangeHighlights.length > 0) for (var b = 0; b < this.options.rangeHighlights.length; b++) {
                    var c = this._toPercentage(this.options.rangeHighlights[b].start),
                        d = this._toPercentage(this.options.rangeHighlights[b].end);if (this.options.reversed) {
                        var e = 100 - d;d = 100 - c, c = e;
                    }var f = this._createHighlightRange(c, d);f ? "vertical" === this.options.orientation ? (this.rangeHighlightElements[b].style.top = f.start + "%", this.rangeHighlightElements[b].style.height = f.size + "%") : (this.options.rtl ? this.rangeHighlightElements[b].style.right = f.start + "%" : this.rangeHighlightElements[b].style.left = f.start + "%", this.rangeHighlightElements[b].style.width = f.size + "%") : this.rangeHighlightElements[b].style.display = "none";
                }if (Array.isArray(this.options.ticks) && this.options.ticks.length > 0) {
                    var g,
                        h = "vertical" === this.options.orientation ? "height" : "width";g = "vertical" === this.options.orientation ? "marginTop" : this.options.rtl ? "marginRight" : "marginLeft";var i = this._state.size / (this.options.ticks.length - 1);if (this.tickLabelContainer) {
                        var j = 0;if (0 === this.options.ticks_positions.length) "vertical" !== this.options.orientation && (this.tickLabelContainer.style[g] = -i / 2 + "px"), j = this.tickLabelContainer.offsetHeight;else for (k = 0; k < this.tickLabelContainer.childNodes.length; k++) {
                            this.tickLabelContainer.childNodes[k].offsetHeight > j && (j = this.tickLabelContainer.childNodes[k].offsetHeight);
                        }"horizontal" === this.options.orientation && (this.sliderElem.style.marginBottom = j + "px");
                    }for (var k = 0; k < this.options.ticks.length; k++) {
                        var l = this.options.ticks_positions[k] || this._toPercentage(this.options.ticks[k]);this.options.reversed && (l = 100 - l), this.ticks[k].style[this.stylePos] = l + "%", this._removeClass(this.ticks[k], "in-selection"), this.options.range ? l >= a[0] && l <= a[1] && this._addClass(this.ticks[k], "in-selection") : "after" === this.options.selection && l >= a[0] ? this._addClass(this.ticks[k], "in-selection") : "before" === this.options.selection && l <= a[0] && this._addClass(this.ticks[k], "in-selection"), this.tickLabels[k] && (this.tickLabels[k].style[h] = i + "px", "vertical" !== this.options.orientation && void 0 !== this.options.ticks_positions[k] ? (this.tickLabels[k].style.position = "absolute", this.tickLabels[k].style[this.stylePos] = l + "%", this.tickLabels[k].style[g] = -i / 2 + "px") : "vertical" === this.options.orientation && (this.options.rtl ? this.tickLabels[k].style.marginRight = this.sliderElem.offsetWidth + "px" : this.tickLabels[k].style.marginLeft = this.sliderElem.offsetWidth + "px", this.tickLabelContainer.style[g] = this.sliderElem.offsetWidth / 2 * -1 + "px"));
                    }
                }var m;if (this.options.range) {
                    m = this.options.formatter(this._state.value), this._setText(this.tooltipInner, m), this.tooltip.style[this.stylePos] = (a[1] + a[0]) / 2 + "%";var n = this.options.formatter(this._state.value[0]);this._setText(this.tooltipInner_min, n);var o = this.options.formatter(this._state.value[1]);this._setText(this.tooltipInner_max, o), this.tooltip_min.style[this.stylePos] = a[0] + "%", this.tooltip_max.style[this.stylePos] = a[1] + "%";
                } else m = this.options.formatter(this._state.value[0]), this._setText(this.tooltipInner, m), this.tooltip.style[this.stylePos] = a[0] + "%";if ("vertical" === this.options.orientation) this.trackLow.style.top = "0", this.trackLow.style.height = Math.min(a[0], a[1]) + "%", this.trackSelection.style.top = Math.min(a[0], a[1]) + "%", this.trackSelection.style.height = Math.abs(a[0] - a[1]) + "%", this.trackHigh.style.bottom = "0", this.trackHigh.style.height = 100 - Math.min(a[0], a[1]) - Math.abs(a[0] - a[1]) + "%";else {
                    "right" === this.stylePos ? this.trackLow.style.right = "0" : this.trackLow.style.left = "0", this.trackLow.style.width = Math.min(a[0], a[1]) + "%", "right" === this.stylePos ? this.trackSelection.style.right = Math.min(a[0], a[1]) + "%" : this.trackSelection.style.left = Math.min(a[0], a[1]) + "%", this.trackSelection.style.width = Math.abs(a[0] - a[1]) + "%", "right" === this.stylePos ? this.trackHigh.style.left = "0" : this.trackHigh.style.right = "0", this.trackHigh.style.width = 100 - Math.min(a[0], a[1]) - Math.abs(a[0] - a[1]) + "%";var p = this.tooltip_min.getBoundingClientRect(),
                        q = this.tooltip_max.getBoundingClientRect();"bottom" === this.options.tooltip_position ? p.right > q.left ? (this._removeClass(this.tooltip_max, "bottom"), this._addClass(this.tooltip_max, "top"), this.tooltip_max.style.top = "", this.tooltip_max.style.bottom = "22px") : (this._removeClass(this.tooltip_max, "top"), this._addClass(this.tooltip_max, "bottom"), this.tooltip_max.style.top = this.tooltip_min.style.top, this.tooltip_max.style.bottom = "") : p.right > q.left ? (this._removeClass(this.tooltip_max, "top"), this._addClass(this.tooltip_max, "bottom"), this.tooltip_max.style.top = "18px") : (this._removeClass(this.tooltip_max, "bottom"), this._addClass(this.tooltip_max, "top"), this.tooltip_max.style.top = this.tooltip_min.style.top);
                }
            }, _createHighlightRange: function _createHighlightRange(a, b) {
                return this._isHighlightRange(a, b) ? a > b ? { start: b, size: a - b } : { start: a, size: b - a } : null;
            }, _isHighlightRange: function _isHighlightRange(a, b) {
                return a >= 0 && 100 >= a && b >= 0 && 100 >= b ? !0 : !1;
            }, _resize: function _resize(a) {
                this._state.offset = this._offset(this.sliderElem), this._state.size = this.sliderElem[this.sizePos], this._layout();
            }, _removeProperty: function _removeProperty(a, b) {
                a.style.removeProperty ? a.style.removeProperty(b) : a.style.removeAttribute(b);
            }, _mousedown: function _mousedown(a) {
                if (!this._state.enabled) return !1;this._state.offset = this._offset(this.sliderElem), this._state.size = this.sliderElem[this.sizePos];var b = this._getPercentage(a);if (this.options.range) {
                    var c = Math.abs(this._state.percentage[0] - b),
                        d = Math.abs(this._state.percentage[1] - b);this._state.dragged = d > c ? 0 : 1, this._adjustPercentageForRangeSliders(b);
                } else this._state.dragged = 0;this._state.percentage[this._state.dragged] = b, this._layout(), this.touchCapable && (document.removeEventListener("touchmove", this.mousemove, !1), document.removeEventListener("touchend", this.mouseup, !1)), this.mousemove && document.removeEventListener("mousemove", this.mousemove, !1), this.mouseup && document.removeEventListener("mouseup", this.mouseup, !1), this.mousemove = this._mousemove.bind(this), this.mouseup = this._mouseup.bind(this), this.touchCapable && (document.addEventListener("touchmove", this.mousemove, !1), document.addEventListener("touchend", this.mouseup, !1)), document.addEventListener("mousemove", this.mousemove, !1), document.addEventListener("mouseup", this.mouseup, !1), this._state.inDrag = !0;var e = this._calculateValue();return this._trigger("slideStart", e), this._setDataVal(e), this.setValue(e, !1, !0), a.returnValue = !1, this.options.focus && this._triggerFocusOnHandle(this._state.dragged), !0;
            }, _touchstart: function _touchstart(a) {
                if (void 0 === a.changedTouches) return void this._mousedown(a);var b = a.changedTouches[0];this.touchX = b.pageX, this.touchY = b.pageY;
            }, _triggerFocusOnHandle: function _triggerFocusOnHandle(a) {
                0 === a && this.handle1.focus(), 1 === a && this.handle2.focus();
            }, _keydown: function _keydown(a, b) {
                if (!this._state.enabled) return !1;var c;switch (b.keyCode) {case 37:case 40:
                        c = -1;break;case 39:case 38:
                        c = 1;}if (c) {
                    if (this.options.natural_arrow_keys) {
                        var d = "vertical" === this.options.orientation && !this.options.reversed,
                            e = "horizontal" === this.options.orientation && this.options.reversed;(d || e) && (c = -c);
                    }var f = this._state.value[a] + c * this.options.step,
                        g = f / this.options.max * 100;if (this._state.keyCtrl = a, this.options.range) {
                        this._adjustPercentageForRangeSliders(g);var h = this._state.keyCtrl ? this._state.value[0] : f,
                            i = this._state.keyCtrl ? f : this._state.value[1];f = [h, i];
                    }return this._trigger("slideStart", f), this._setDataVal(f), this.setValue(f, !0, !0), this._setDataVal(f), this._trigger("slideStop", f), this._layout(), this._pauseEvent(b), delete this._state.keyCtrl, !1;
                }
            }, _pauseEvent: function _pauseEvent(a) {
                a.stopPropagation && a.stopPropagation(), a.preventDefault && a.preventDefault(), a.cancelBubble = !0, a.returnValue = !1;
            }, _mousemove: function _mousemove(a) {
                if (!this._state.enabled) return !1;var b = this._getPercentage(a);this._adjustPercentageForRangeSliders(b), this._state.percentage[this._state.dragged] = b, this._layout();var c = this._calculateValue(!0);return this.setValue(c, !0, !0), !1;
            }, _touchmove: function _touchmove(a) {
                if (void 0 !== a.changedTouches) {
                    var b = a.changedTouches[0],
                        c = b.pageX - this.touchX,
                        d = b.pageY - this.touchY;this._state.inDrag || ("vertical" === this.options.orientation && 5 >= c && c >= -5 && (d >= 15 || -15 >= d) ? this._mousedown(a) : 5 >= d && d >= -5 && (c >= 15 || -15 >= c) && this._mousedown(a));
                }
            }, _adjustPercentageForRangeSliders: function _adjustPercentageForRangeSliders(a) {
                if (this.options.range) {
                    var b = this._getNumDigitsAfterDecimalPlace(a);b = b ? b - 1 : 0;var c = this._applyToFixedAndParseFloat(a, b);0 === this._state.dragged && this._applyToFixedAndParseFloat(this._state.percentage[1], b) < c ? (this._state.percentage[0] = this._state.percentage[1], this._state.dragged = 1) : 1 === this._state.dragged && this._applyToFixedAndParseFloat(this._state.percentage[0], b) > c ? (this._state.percentage[1] = this._state.percentage[0], this._state.dragged = 0) : 0 === this._state.keyCtrl && this._state.value[1] / this.options.max * 100 < a ? (this._state.percentage[0] = this._state.percentage[1], this._state.keyCtrl = 1, this.handle2.focus()) : 1 === this._state.keyCtrl && this._state.value[0] / this.options.max * 100 > a && (this._state.percentage[1] = this._state.percentage[0], this._state.keyCtrl = 0, this.handle1.focus());
                }
            }, _mouseup: function _mouseup() {
                if (!this._state.enabled) return !1;this.touchCapable && (document.removeEventListener("touchmove", this.mousemove, !1), document.removeEventListener("touchend", this.mouseup, !1)), document.removeEventListener("mousemove", this.mousemove, !1), document.removeEventListener("mouseup", this.mouseup, !1), this._state.inDrag = !1, this._state.over === !1 && this._hideTooltip();var a = this._calculateValue(!0);return this._layout(), this._setDataVal(a), this._trigger("slideStop", a), !1;
            }, _calculateValue: function _calculateValue(a) {
                var b;if (this.options.range ? (b = [this.options.min, this.options.max], 0 !== this._state.percentage[0] && (b[0] = this._toValue(this._state.percentage[0]), b[0] = this._applyPrecision(b[0])), 100 !== this._state.percentage[1] && (b[1] = this._toValue(this._state.percentage[1]), b[1] = this._applyPrecision(b[1]))) : (b = this._toValue(this._state.percentage[0]), b = parseFloat(b), b = this._applyPrecision(b)), a) {
                    for (var c = [b, 1 / 0], d = 0; d < this.options.ticks.length; d++) {
                        var e = Math.abs(this.options.ticks[d] - b);e <= c[1] && (c = [this.options.ticks[d], e]);
                    }if (c[1] <= this.options.ticks_snap_bounds) return c[0];
                }return b;
            }, _applyPrecision: function _applyPrecision(a) {
                var b = this.options.precision || this._getNumDigitsAfterDecimalPlace(this.options.step);return this._applyToFixedAndParseFloat(a, b);
            }, _getNumDigitsAfterDecimalPlace: function _getNumDigitsAfterDecimalPlace(a) {
                var b = ("" + a).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);return b ? Math.max(0, (b[1] ? b[1].length : 0) - (b[2] ? +b[2] : 0)) : 0;
            }, _applyToFixedAndParseFloat: function _applyToFixedAndParseFloat(a, b) {
                var c = a.toFixed(b);return parseFloat(c);
            }, _getPercentage: function _getPercentage(a) {
                !this.touchCapable || "touchstart" !== a.type && "touchmove" !== a.type || (a = a.touches[0]);var b = a[this.mousePos],
                    c = this._state.offset[this.stylePos],
                    d = b - c;"right" === this.stylePos && (d = -d);var e = d / this._state.size * 100;return e = Math.round(e / this._state.percentage[2]) * this._state.percentage[2], this.options.reversed && (e = 100 - e), Math.max(0, Math.min(100, e));
            }, _validateInputValue: function _validateInputValue(a) {
                if (isNaN(+a)) {
                    if (Array.isArray(a)) return this._validateArray(a), a;throw new Error(f.formatInvalidInputErrorMsg(a));
                }return +a;
            }, _validateArray: function _validateArray(a) {
                for (var b = 0; b < a.length; b++) {
                    var c = a[b];if ("number" != typeof c) throw new Error(f.formatInvalidInputErrorMsg(c));
                }
            }, _setDataVal: function _setDataVal(a) {
                this.element.setAttribute("data-value", a), this.element.setAttribute("value", a), this.element.value = a;
            }, _trigger: function _trigger(b, c) {
                c = c || 0 === c ? c : void 0;var d = this.eventToCallbackMap[b];if (d && d.length) for (var e = 0; e < d.length; e++) {
                    var f = d[e];f(c);
                }a && this._triggerJQueryEvent(b, c);
            }, _triggerJQueryEvent: function _triggerJQueryEvent(a, b) {
                var c = { type: a, value: b };this.$element.trigger(c), this.$sliderElem.trigger(c);
            }, _unbindJQueryEventHandlers: function _unbindJQueryEventHandlers() {
                this.$element.off(), this.$sliderElem.off();
            }, _setText: function _setText(a, b) {
                "undefined" != typeof a.textContent ? a.textContent = b : "undefined" != typeof a.innerText && (a.innerText = b);
            }, _removeClass: function _removeClass(a, b) {
                for (var c = b.split(" "), d = a.className, e = 0; e < c.length; e++) {
                    var f = c[e],
                        g = new RegExp("(?:\\s|^)" + f + "(?:\\s|$)");d = d.replace(g, " ");
                }a.className = d.trim();
            }, _addClass: function _addClass(a, b) {
                for (var c = b.split(" "), d = a.className, e = 0; e < c.length; e++) {
                    var f = c[e],
                        g = new RegExp("(?:\\s|^)" + f + "(?:\\s|$)"),
                        h = g.test(d);h || (d += " " + f);
                }a.className = d.trim();
            }, _offsetLeft: function _offsetLeft(a) {
                return a.getBoundingClientRect().left;
            }, _offsetRight: function _offsetRight(a) {
                return a.getBoundingClientRect().right;
            }, _offsetTop: function _offsetTop(a) {
                for (var b = a.offsetTop; (a = a.offsetParent) && !isNaN(a.offsetTop);) {
                    b += a.offsetTop, "BODY" !== a.tagName && (b -= a.scrollTop);
                }return b;
            }, _offset: function _offset(a) {
                return { left: this._offsetLeft(a), right: this._offsetRight(a), top: this._offsetTop(a) };
            }, _css: function _css(b, c, d) {
                if (a) a.style(b, c, d);else {
                    var e = c.replace(/^-ms-/, "ms-").replace(/-([\da-z])/gi, function (a, b) {
                        return b.toUpperCase();
                    });b.style[e] = d;
                }
            }, _toValue: function _toValue(a) {
                return this.options.scale.toValue.apply(this, [a]);
            }, _toPercentage: function _toPercentage(a) {
                return this.options.scale.toPercentage.apply(this, [a]);
            }, _setTooltipPosition: function _setTooltipPosition() {
                var a = [this.tooltip, this.tooltip_min, this.tooltip_max];if ("vertical" === this.options.orientation) {
                    var b;b = this.options.tooltip_position ? this.options.tooltip_position : this.options.rtl ? "left" : "right";var c = "left" === b ? "right" : "left";a.forEach(function (a) {
                        this._addClass(a, b), a.style[c] = "100%";
                    }.bind(this));
                } else "bottom" === this.options.tooltip_position ? a.forEach(function (a) {
                    this._addClass(a, "bottom"), a.style.top = "22px";
                }.bind(this)) : a.forEach(function (a) {
                    this._addClass(a, "top"), a.style.top = -this.tooltip.outerHeight - 14 + "px";
                }.bind(this));
            } }, a && a.fn) {
            var h = void 0;a.fn.slider ? (windowIsDefined && window.console.warn("bootstrap-slider.js - WARNING: $.fn.slider namespace is already bound. Use the $.fn.bootstrapSlider namespace instead."), h = c) : (a.bridget(b, d), h = b), a.bridget(c, d), a(function () {
                a("input[data-provide=slider]")[h]();
            });
        }
    }(a), d;
});

var Read2MeHelpers = function () {
    function Read2MeHelpers() {
        _classCallCheck(this, Read2MeHelpers);
    }

    _createClass(Read2MeHelpers, null, [{
        key: "documentReady",
        value: function documentReady(fn) {
            if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
                fn();
            } else {
                document.addEventListener('DOMContentLoaded', fn);
            }
        }
    }, {
        key: "secondsToHumanReadableArray",
        value: function secondsToHumanReadableArray(durationInSeconds) {
            var hours = void 0,
                minutes = void 0,
                seconds = void 0;

            hours = Math.floor(durationInSeconds / 3600);
            minutes = Math.floor(durationInSeconds / 60 % 60);
            seconds = Math.floor(durationInSeconds % 60);

            return [seconds, minutes, hours];
        }
    }, {
        key: "secondsMinutesHoursToHumanReadable",
        value: function secondsMinutesHoursToHumanReadable(seconds, minutes, hours) {
            var res = '';
            seconds = seconds.toString();
            minutes = minutes.toString();
            hours = hours.toString();

            // only show hours if hours > 0
            if (hours > 0) {
                if (hours.length < 2) hours = '0' + hours;

                res += hours + ':';
            }

            if (minutes.length < 2) minutes = '0' + minutes;

            if (seconds.length < 2) seconds = '0' + seconds;

            res += minutes + ':' + seconds;

            return res;
        }
    }, {
        key: "getPageTitle",
        value: function getPageTitle() {
            var title = document.querySelector('title');

            return title === null ? null : title.text;
        }
    }, {
        key: "getOgImageUrl",
        value: function getOgImageUrl() {
            var tag = document.querySelector("meta[property='og:image']");

            return tag === null ? null : tag.getAttribute('content');
        }
    }, {
        key: "getWidgetTemplate",
        value: function getWidgetTemplate() {
            return document.querySelector('.read2me-widget-player.read2me-template').cloneNode(true);
        }
    }]);

    return Read2MeHelpers;
}();

var Read2MeAudioController = function () {
    function Read2MeAudioController(audioFileUrl) {
        var _this = this;

        _classCallCheck(this, Read2MeAudioController);

        this.audio = new Audio(audioFileUrl);
        this.canPlay = false;

        this.audio.addEventListener('canplay', function () {
            _this.canPlay = true;
        });
    }

    _createClass(Read2MeAudioController, [{
        key: "isReadyToPlay",
        value: function isReadyToPlay() {
            return this.canPlay;
        }
    }, {
        key: "play",
        value: function play() {
            this.audio.play();
        }
    }, {
        key: "pause",
        value: function pause() {
            this.audio.pause();
        }
    }, {
        key: "stop",
        value: function stop() {
            this.setCurrentTime(0);
        }
    }, {
        key: "replay",
        value: function replay() {
            this.setCurrentTime(0);
            this.play();
        }
    }, {
        key: "setCurrentTime",
        value: function setCurrentTime(time) {
            if (time < 0) time = 0;

            if (time > this.getDuration()) time = this.getDuration();

            this.audio.currentTime = time;
        }
    }, {
        key: "getCurrentTime",
        value: function getCurrentTime() {
            return this.audio.currentTime;
        }
    }, {
        key: "setPlaySpeed",
        value: function setPlaySpeed(speed) {
            this.audio.playbackRate = speed;
        }
    }, {
        key: "getPlaySpeed",
        value: function getPlaySpeed() {
            return this.audio.playbackRate;
        }
    }, {
        key: "getDuration",
        value: function getDuration() {
            return this.audio.duration;
        }
    }, {
        key: "rewindForXSeconds",
        value: function rewindForXSeconds(x) {
            var result = this.audio.currentTime - x;

            if (result < 0) result = 0;

            this.audio.currentTime = result;
        }
    }, {
        key: "forwardForXSeconds",
        value: function forwardForXSeconds(x) {
            var result = this.audio.currentTime + x;

            if (result > this.getDuration()) result = this.getDuration();

            this.audio.currentTime = result;
        }
    }]);

    return Read2MeAudioController;
}();

var Read2MeBackendWrapper = function () {
    function Read2MeBackendWrapper(appId, url) {
        var cssSelectors = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var ignoreContentChange = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        var requestSource = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'custom';

        _classCallCheck(this, Read2MeBackendWrapper);

        this.apiUrl = 'https://api-dev.read2me.online/convert/1.0.0/webpage/'; //@TODO change

        // set params as object properties
        this.appId = appId;
        this.url = url;
        this.cssSelectors = cssSelectors;
        this.ignoreContentChange = ignoreContentChange;
        this.requestSource = requestSource;

        this._validateParams();
        this._normaliseParams();
    }

    _createClass(Read2MeBackendWrapper, [{
        key: "_validateParams",
        value: function _validateParams() {
            if (typeof this.appId === 'undefined') throw 'First param to Read2MePlayer must be an App Id.';

            if (typeof this.appId !== 'number') throw 'Public API key must be a number.';

            if (typeof this.url !== 'string') throw 'Second param to Read2MePlayer (url) must be a string.';

            if (this.url.length === 0) throw 'url must not be empty';

            if (this.cssSelectors !== null && _typeof2(this.cssSelectors) !== 'object') throw 'Third param to Read2MePlayer (cssSelectors) can be null or array.';

            if (typeof this.ignoreContentChange !== 'boolean') throw 'Fourth param to Read2MePlayer (ignoreContentChange) must be a boolean.';

            if (typeof this.requestSource !== 'string') throw 'Fifth param to Read2MeBackend must be a string';
        }
    }, {
        key: "_normaliseParams",
        value: function _normaliseParams() {
            if (typeof this.cssSelectors === 'undefined' || this.cssSelectors === null) this.cssSelectors = [];
        }
    }, {
        key: "_getIgnoreContentChangeAsString",
        value: function _getIgnoreContentChangeAsString() {
            return this.ignoreContentChange ? 'true' : 'false';
        }
    }, {
        key: "getRequestUri",
        value: function getRequestUri() {
            return this.apiUrl + '?url=' + encodeURIComponent(this.url) + '&css_selectors=' + encodeURIComponent(this.cssSelectors.join('|')) + '&ignore_content_change=' + this._getIgnoreContentChangeAsString() + '&request_source=' + this.requestSource;
        }
    }, {
        key: "get",
        value: function get(audioFoundCallback, audioNotFoundCallback, errorCallback) {
            var request = new XMLHttpRequest();
            request.open('GET', this.getRequestUri(), true);
            request.setRequestHeader('X-App-Id', this.appId);

            request.onload = function () {
                var response = JSON.parse(request.responseText);

                if (request.status >= 200 && request.status < 400) {
                    audioFoundCallback(response);
                } else if (request.status === 404) {
                    audioNotFoundCallback(response);
                } else {
                    errorCallback(response);
                }
            };

            request.onerror = function () {
                console.warn('Connection to Read2Me backend API failed.');
            };

            request.send();
        }
    }, {
        key: "create",
        value: function create(audioCreatedCallback, errorCallback) {
            var request = new XMLHttpRequest();
            request.open('POST', this.getRequestUri(), true);
            request.setRequestHeader('X-App-Id', this.appId);

            request.onload = function () {
                var response = JSON.parse(request.responseText);

                if (request.status >= 200 && request.status < 400) {
                    audioCreatedCallback(response);
                } else {
                    errorCallback(response);
                }
            };

            request.onerror = function () {
                console.warn('Connection to Read2Me API failed.');
            };

            request.send();
        }
    }]);

    return Read2MeBackendWrapper;
}();

var Read2MeWidgetPlayer = function () {
    function Read2MeWidgetPlayer(widgetBlueprint, url) {
        var title = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var thumbnail = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
        var autoplay = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
        var playerId = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
        var theme = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;

        _classCallCheck(this, Read2MeWidgetPlayer);

        // sliders
        this.isScrubberBeingDragged = false;
        this.scrubber = null;
        this.speakingRate = null;

        // arguments
        this.widgetBlueprint = widgetBlueprint;
        this.url = url;
        this.title = title;
        this.thumbnail = thumbnail;
        this.autoplay = autoplay;
        this.playerId = playerId;
        this.theme = theme;

        this.player = Read2MeHelpers.getWidgetTemplate();
        this.playbackContainer = this.player.querySelector('.read2me-widget-player-playback');
        this.loader = this.player.querySelector('.read2me-widget-loader');
        widgetBlueprint.parentNode.replaceChild(this.player, this.widgetBlueprint);

        // UI playback controllers
        this.play = this.player.querySelector('.read2me-widget-player-playback-play');
        this.pause = this.player.querySelector('.read2me-widget-player-playback-pause');
        this.replay = this.player.querySelector('.read2me-widget-player-playback-replay');

        // set the player up
        this.setTitle();
        this.setThumbnail();
        this.setTheme();
        this.player.classList.remove('read2me-template');
        this.instantiateSliders();
    }

    _createClass(Read2MeWidgetPlayer, [{
        key: "finishInitialisation",
        value: function finishInitialisation(audioController, apiResponse) {
            if (audioController instanceof Read2MeAudioController === false) throw 'Invalid argument for Read2MeWidgetPlayer.finishInitialisation(); must be an instance of Read2MeAudioController';

            this.audioController = audioController;
            this.apiResponse = apiResponse;
            this.configureSliders();
            this.handleAutoplay();
            this.handlePlayback();
            this.handleQuickControls();
            this.handleScrubber();
            this.handleSpeakingRateChange();
            this.hideLoader();
            this.removePlaybackBufferingStyles();
        }
    }, {
        key: "instantiateSliders",
        value: function instantiateSliders() {
            // make ID and data-slider-id attributes unique for scrubber and speaking rate inputs
            // scrubber's node id: #read2me-widget-scrubber-player
            // speaking rate's node id: #read2me-widget-player-speaking-rate
            var scrubberId = 'read2me-widget-scrubber-player';
            var speakingRateId = 'read2me-widget-player-speaking-rate';

            var newScrubberId = scrubberId + '-' + this.playerId;
            var newSpeakingRateId = speakingRateId + '-' + this.playerId;

            // append playerId to their IDs to make them unique
            var scrubber = this.player.querySelector('#' + scrubberId);
            scrubber.setAttribute('id', newScrubberId);
            scrubber.setAttribute('data-slider-id', newScrubberId);

            var speakingRate = this.player.querySelector('#' + speakingRateId);
            speakingRate.setAttribute('id', newSpeakingRateId);
            speakingRate.setAttribute('data-slider-id', newSpeakingRateId);

            this.scrubber = new Slider('#' + newScrubberId, {
                tooltip_position: 'bottom',
                formatter: function formatter(seconds) {
                    var currentTimeArray = Read2MeHelpers.secondsToHumanReadableArray(seconds);

                    return Read2MeHelpers.secondsMinutesHoursToHumanReadable(currentTimeArray[0], currentTimeArray[1], currentTimeArray[2]);
                }
            });

            this.speakingRate = new Slider('#' + newSpeakingRateId, {
                tooltip_position: 'bottom',

                formatter: function formatter(value) {
                    return value + 'x';
                }
            });
        }
    }, {
        key: "configureSliders",
        value: function configureSliders() {
            this.scrubber.setAttribute('max', this.apiResponse.audio_length_seconds);
            this.scrubber.enable();
        }
    }, {
        key: "setTitle",
        value: function setTitle() {
            var container = this.player.querySelector('.read2me-widget-player-title span');
            var pageTitle = Read2MeHelpers.getPageTitle();

            if (this.title !== null) container.textContent = this.title;else if (pageTitle !== null) container.textContent = pageTitle;
        }
    }, {
        key: "setThumbnail",
        value: function setThumbnail() {
            var container = this.player.querySelector('.read2me-widget-player-thumbnail');
            var ogImage = Read2MeHelpers.getOgImageUrl();
            var defaultThumbnail = 'https://d22fip447qchhd.cloudfront.net/api/widget/static/images/default-thumbnail.png';

            if (this.thumbnail !== null) container.setAttribute('src', this.thumbnail);else if (ogImage !== null) container.setAttribute('src', ogImage);else container.setAttribute('src', defaultThumbnail);
        }
    }, {
        key: "handleAutoplay",
        value: function handleAutoplay() {
            var _this2 = this;

            if (!this.autoplay) return;

            this.audioController.audio.addEventListener('canplay', function () {
                _this2.audioController.audio.play();
            });
        }
    }, {
        key: "setTheme",
        value: function setTheme() {
            switch (this.theme) {
                case 'blue':
                    this.player.classList.add('preset-blue');
                    break;
                case 'white':
                    this.player.classList.add('preset-white');
                    break;
            }
        }
    }, {
        key: "handlePlayback",
        value: function handlePlayback() {
            var _this3 = this;

            this.playbackContainer.addEventListener('click', function () {
                if (_this3.isPlayButtonShown()) {
                    _this3.audioController.play();
                    _this3.displayLoader();
                    _this3.displayPauseButton();

                    _this3.audioController.audio.addEventListener('playing', function () {
                        _this3.hideLoader();
                    });
                } else if (_this3.isPauseButtonShown()) {
                    _this3.audioController.pause();
                    _this3.displayPlayButton();
                } else {
                    _this3.audioController.replay();
                    _this3.displayPauseButton();
                }
            });

            this.audioController.audio.addEventListener('ended', function () {
                _this3.displayReplayButton();
            });
        }
    }, {
        key: "isPlayButtonShown",
        value: function isPlayButtonShown() {
            return !this.play.classList.contains('hidden');
        }
    }, {
        key: "displayPlayButton",
        value: function displayPlayButton() {
            this.play.classList.remove('hidden');
            this.pause.classList.add('hidden');
            this.replay.classList.add('hidden');
        }
    }, {
        key: "isPauseButtonShown",
        value: function isPauseButtonShown() {
            return !this.pause.classList.contains('hidden');
        }
    }, {
        key: "displayPauseButton",
        value: function displayPauseButton() {
            this.play.classList.add('hidden');
            this.pause.classList.remove('hidden');
            this.replay.classList.add('hidden');
        }
    }, {
        key: "isReplayButtonShown",
        value: function isReplayButtonShown() {
            return !this.replay.classList.contains('hidden');
        }
    }, {
        key: "displayReplayButton",
        value: function displayReplayButton() {
            this.play.classList.add('hidden');
            this.pause.classList.add('hidden');
            this.replay.classList.remove('hidden');
        }
    }, {
        key: "handleQuickControls",
        value: function handleQuickControls() {
            var _this4 = this;

            var rewind = this.player.querySelector('.read2me-widget-rewind');
            var forward = this.player.querySelector('.read2me-widget-forward');

            rewind.addEventListener('click', function () {
                _this4.audioController.rewindForXSeconds(10);
            });

            forward.addEventListener('click', function () {
                _this4.audioController.forwardForXSeconds(10);
            });
        }
    }, {
        key: "handleScrubber",
        value: function handleScrubber() {
            var _this5 = this;

            this.scrubber.on('slideStart', function () {
                _this5.isScrubberBeingDragged = true;
            });

            this.scrubber.on('slideStop', function (newCurrentTime) {
                _this5.isScrubberBeingDragged = false;
                _this5.audioController.setCurrentTime(newCurrentTime);

                if (_this5.isReplayButtonShown() && newCurrentTime !== _this5.audioController.getDuration()) _this5.displayPlayButton();
            });

            this.audioController.audio.addEventListener('timeupdate', function () {
                if (_this5.isScrubberBeingDragged) return false;

                _this5.scrubber.setValue(Math.round(_this5.audioController.getCurrentTime()));
            });
        }
    }, {
        key: "handleSpeakingRateChange",
        value: function handleSpeakingRateChange() {
            var _this6 = this;

            this.speakingRate.on('change', function (values) {
                _this6.audioController.setPlaySpeed(values.newValue);
            });
        }
    }, {
        key: "displayLoader",
        value: function displayLoader() {
            this.loader.classList.remove('hidden');
        }
    }, {
        key: "hideLoader",
        value: function hideLoader() {
            this.loader.classList.add('hidden');
        }
    }, {
        key: "removePlaybackBufferingStyles",
        value: function removePlaybackBufferingStyles() {
            this.playbackContainer.classList.remove('read2me-playback-buffering');
        }
    }]);

    return Read2MeWidgetPlayer;
}();
/**
 * Looks for plug n' play widget blueprints and replaces them with
 * an actual interactive HTML player.
 */

var Read2MePlayerBuilder = function () {
    function Read2MePlayerBuilder() {
        var _this7 = this;

        _classCallCheck(this, Read2MePlayerBuilder);

        this.playerInstances = [];
        var cssTarget = '.read2me-widget';
        var elements = document.querySelectorAll(cssTarget);

        elements.forEach(function (elem) {
            _this7._replaceBlueprintWithPlayer(elem);
        });
    }

    _createClass(Read2MePlayerBuilder, [{
        key: "_replaceBlueprintWithPlayer",
        value: function _replaceBlueprintWithPlayer(elem) {
            var appId = 2; // @TODO
            var url = elem.getAttribute('data-url');
            var autoplay = elem.getAttribute('data-autoplay');
            var cssSelectors = elem.getAttribute('data-css-selectors');
            var title = elem.getAttribute('data-title');
            var thumbnail = elem.getAttribute('data-thumbnail');
            var ignoreContentChange = elem.getAttribute('data-ignore-content-change');
            var theme = elem.getAttribute('data-player-theme');

            autoplay = this._booleanStringToBoolean(autoplay);
            cssSelectors = this._cssSelectorsStringToArray(cssSelectors);
            ignoreContentChange = this._booleanStringToBoolean(ignoreContentChange);

            var backendWrapper = new Read2MeBackendWrapper(appId, url, cssSelectors, ignoreContentChange, 'widget');
            var player = new Read2MeWidgetPlayer(elem, url, title, thumbnail, autoplay, this.playerInstances.length, theme);

            this._makeApiCalls(backendWrapper, function (responseResult) {
                // success
                player.finishInitialisation(new Read2MeAudioController(responseResult.audio_url), responseResult);
            }, function () {
                // error
            });
        }
    }, {
        key: "_makeApiCalls",
        value: function _makeApiCalls(backendWrapper, success, error) {
            if (backendWrapper instanceof Read2MeBackendWrapper === false) throw 'Improper usage of _makeApiCalls, first arg must be an instance of Read2MeBackendWrapper';

            backendWrapper.get(
            // success
            function (response) {
                if (typeof success === 'function') success(response.result);
            },

            // audio not found, create the audio
            function () {
                backendWrapper.create(
                // audio created
                function (response) {
                    if (typeof success === 'function') success(response.result);
                },
                // failure, unable to create audio
                function (response) {
                    if (typeof error === 'function') error(response);else console.warn(response);
                });
            },

            // error
            function (response) {
                if (typeof error === 'function') error(response);else console.warn(response);
            });
        }
    }, {
        key: "_cssSelectorsStringToArray",
        value: function _cssSelectorsStringToArray(cssSelectors) {
            var _this8 = this;

            if (!cssSelectors) return;

            cssSelectors = cssSelectors.substring(1, cssSelectors.length - 1).split(',');
            cssSelectors = cssSelectors.map(function (selector) {
                return selector.trim();
            });
            cssSelectors = cssSelectors.map(function (selector) {
                return _this8._trimByChar(selector, '"');
            });
            cssSelectors = cssSelectors.map(function (selector) {
                return _this8._trimByChar(selector, "'");
            });

            return cssSelectors;
        }
    }, {
        key: "_booleanStringToBoolean",
        value: function _booleanStringToBoolean(value) {
            if (value === 'true') value = true;else if (value === 'false') value = false;else throw 'Unsupported value for ignoreContentChange (can be "true" or "false", as a string)';

            return value;
        }

        // https://stackoverflow.com/a/43333491/1325575

    }, {
        key: "_trimByChar",
        value: function _trimByChar(string, character) {
            var first = [].concat(_toConsumableArray(string)).findIndex(function (char) {
                return char !== character;
            });
            var last = [].concat(_toConsumableArray(string)).reverse().findIndex(function (char) {
                return char !== character;
            });

            return string.substring(first, string.length - last);
        }
    }]);

    return Read2MePlayerBuilder;
}();

Read2MeHelpers.documentReady(function () {
    var playerBuilder = new Read2MePlayerBuilder();
});