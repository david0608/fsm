"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transitionFnDefaultNull = exports.conditionFnDefaultTrue = exports.Transition = void 0;
const state_1 = require("./state");
class Transition {
    constructor(options) {
        this._conditionFn = (options && options.conditionFn) || exports.conditionFnDefaultTrue;
        this._transitionFn = (options && options.transitionFn) || exports.transitionFnDefaultNull;
        this._state = new state_1.State();
    }
    conditionFn() {
        return this._conditionFn;
    }
    check(context) {
        return this._conditionFn(context);
    }
    transitionFn() {
        return this._transitionFn;
    }
    transition(context) {
        this._transitionFn(context);
    }
    state() {
        return this._state;
    }
    setState(state) {
        this._state = state;
    }
}
exports.Transition = Transition;
const conditionFnDefaultTrue = (_) => true;
exports.conditionFnDefaultTrue = conditionFnDefaultTrue;
const transitionFnDefaultNull = (_) => { };
exports.transitionFnDefaultNull = transitionFnDefaultNull;
