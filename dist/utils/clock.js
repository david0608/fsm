"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clock = void 0;
const O = __importStar(require("fp-ts/Option"));
const ClockStatus = {
    Reached: 'reached',
    Canceled: 'canceled',
    Idle: 'idle',
};
class Clock {
    constructor(duration) {
        this._duration = duration;
        this._clockJob = O.none;
    }
    init() {
        this.cancel();
        let resolve = (_) => { };
        const promise = new Promise((res, _) => { resolve = res; });
        const timeoutId = setTimeout(() => {
            if (O.isSome(this._clockJob)) {
                this._clockJob.value.resolve(ClockStatus.Reached);
                this._clockJob = O.none;
            }
        }, this._duration);
        this._clockJob = O.some({
            timeoutId,
            promise,
            resolve,
        });
    }
    cancel() {
        if (O.isSome(this._clockJob)) {
            clearTimeout(this._clockJob.value.timeoutId);
            this._clockJob.value.resolve(ClockStatus.Canceled);
            this._clockJob = O.none;
        }
    }
    wait() {
        if (O.isSome(this._clockJob)) {
            return this._clockJob.value.promise;
        }
        else {
            return Promise.resolve(ClockStatus.Idle);
        }
    }
}
exports.Clock = Clock;
