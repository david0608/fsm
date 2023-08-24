import { Immutable } from './type';
import { State } from './state';

export type ConditionFn<C> =
  (context: Immutable<C>) => boolean

export type TransitionFn<C> =
  (context: C) => void

interface TransitionOptions<C> {
  conditionFn: ConditionFn<C>,
  transitionFn: TransitionFn<C>,
}

export class Transition<C> {
  private _conditionFn: ConditionFn<C>;
  private _transitionFn: TransitionFn<C>;
  private _state: State<C>;

  constructor(options?: Partial<TransitionOptions<C>>) {
    this._conditionFn = (options && options.conditionFn) || conditionFnDefaultTrue;
    this._transitionFn = (options && options.transitionFn) || transitionFnDefaultNull;
    this._state = new State();
  }

  conditionFn() {
    return this._conditionFn;
  }

  check(context: Immutable<C>) {
    return this._conditionFn(context);
  }

  transitionFn() {
    return this._transitionFn;
  }

  transition(context: C) {
    this._transitionFn(context);
  }

  state() {
    return this._state;
  }

  setState(state: State<C>) {
    this._state = state;
  }
}

export const conditionFnDefaultTrue: ConditionFn<any> =
  (_) => true;

export const transitionFnDefaultNull: TransitionFn<any> =
  (_) => {};
