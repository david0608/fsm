"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.link = void 0;
const state_1 = require("./state");
const transition_1 = require("./transition");
function link(from, to, transition) {
    if (from.stateFn() === state_1.stateFnDefaultHalt) {
        from.setStateFn(state_1.stateFnDefaultNull);
    }
    transition = transition || new transition_1.Transition();
    from.addTransition(transition);
    transition.setState(to);
}
exports.link = link;
