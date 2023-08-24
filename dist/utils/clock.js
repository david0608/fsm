"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clock = exports.ClockStatus = void 0;
exports.ClockStatus = {
    Reached: 'reached',
    Canceled: 'canceled',
    Idle: 'idle',
};
class Clock {
    constructor(duration) {
        this._duration = duration;
        this._clockJob = undefined;
    }
    init() {
        this.cancel();
        let resolve = (_) => { };
        const promise = new Promise((res, _) => { resolve = res; });
        const timeoutId = setTimeout(() => {
            if (this._clockJob) {
                this._clockJob.resolve(exports.ClockStatus.Reached);
                this._clockJob = undefined;
            }
        }, this._duration);
        this._clockJob = {
            timeoutId,
            promise,
            resolve,
        };
    }
    cancel() {
        if (this._clockJob) {
            clearTimeout(this._clockJob.timeoutId);
            this._clockJob.resolve(exports.ClockStatus.Canceled);
            this._clockJob = undefined;
        }
    }
    wait() {
        if (this._clockJob) {
            return this._clockJob.promise;
        }
        else {
            return Promise.resolve(exports.ClockStatus.Idle);
        }
    }
    isWaiting() {
        return this._clockJob !== undefined;
    }
}
exports.Clock = Clock;
