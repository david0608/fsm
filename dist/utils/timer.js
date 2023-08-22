"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timer = void 0;
class Timer {
    constructor(duration) {
        this._from = Date.now();
        this._duration = duration;
    }
    init() {
        this._from = Date.now();
    }
    elapsed() {
        return (Date.now() - this._from) >= this._duration;
    }
    remains() {
        return this._duration - (Date.now() - this._from);
    }
}
exports.Timer = Timer;
