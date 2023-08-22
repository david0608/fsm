"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timer = exports.Clock = exports.sleep = void 0;
var sleep_1 = require("./sleep");
Object.defineProperty(exports, "sleep", { enumerable: true, get: function () { return sleep_1.sleep; } });
var clock_1 = require("./clock");
Object.defineProperty(exports, "Clock", { enumerable: true, get: function () { return clock_1.Clock; } });
var timer_1 = require("./timer");
Object.defineProperty(exports, "Timer", { enumerable: true, get: function () { return timer_1.Timer; } });
