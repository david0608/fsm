"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stateFnDefaultHalt = exports.stateFnDefaultNull = exports.SleepState = exports.State = void 0;
const utils_1 = require("./utils");
class State {
    constructor(options) {
        this._preStateFn = (options && options.preStateFn) || exports.stateFnDefaultNull;
        this._stateFn = (options && options.stateFn) || exports.stateFnDefaultHalt;
        this._postStateFn = (options && options.postStateFn) || exports.stateFnDefaultNull;
        this._transitions = [];
    }
    preStateFn() {
        return this._preStateFn;
    }
    stateFn() {
        return this._stateFn;
    }
    postStateFn() {
        return this._postStateFn;
    }
    setStateFn(stateFn) {
        this._stateFn = stateFn;
    }
    addTransition(transition) {
        this._transitions.push(transition);
    }
    transitions() {
        return this._transitions;
    }
}
exports.State = State;
class SleepState extends State {
    constructor(ms) {
        super({ stateFn: () => (0, utils_1.sleep)(ms) });
    }
}
exports.SleepState = SleepState;
const stateFnDefaultNull = (_) => (0, utils_1.sleep)(0);
exports.stateFnDefaultNull = stateFnDefaultNull;
const stateFnDefaultHalt = (_) => new Promise(() => { });
exports.stateFnDefaultHalt = stateFnDefaultHalt;
