"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manager = void 0;
const type_1 = require("./type");
class Manager {
    constructor(createContext, initialState) {
        this._context = createContext();
        this._currentState = initialState;
        this._running = false;
    }
    context() {
        return this._context;
    }
    forth() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._currentState.stateFn()(this._context);
            for (const transition of this._currentState.transitions()) {
                if (transition.check((0, type_1.asImmutable)(this._context))) {
                    yield this._currentState.postStateFn()(this.context());
                    transition.transition(this._context);
                    this._currentState = transition.state();
                    yield this._currentState.preStateFn()(this.context());
                    return;
                }
            }
        });
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._running) {
                return;
            }
            this._running = true;
            yield this._currentState.preStateFn()(this.context());
            while (true) {
                yield this.forth();
            }
        });
    }
}
exports.Manager = Manager;
