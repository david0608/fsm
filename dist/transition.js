"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transition = void 0;
const state_1 = require("./state");
class Transition {
    constructor(options) {
        this._conditionFn = (options && options.conditionFn) || conditionFnDefaultTrue;
        this._transitionFn = (options && options.transitionFn) || transitionFnDefaultNull;
        this._state = new state_1.State();
    }
    check(context) {
        return this._conditionFn(context);
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
const transitionFnDefaultNull = (_) => { };
