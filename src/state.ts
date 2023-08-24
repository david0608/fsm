import {
  Transition,
} from './transition';
import {
  sleep,
} from './utils';

export type StateFn<C> =
  (context: C) => Promise<void>

export interface StateOptions<C> {
  preStateFn: StateFn<C>,
  stateFn: StateFn<C>,
  postStateFn: StateFn<C>,
}

export class State<C> {
  private _preStateFn: StateFn<C>;
  private _stateFn: StateFn<C>;
  private _postStateFn: StateFn<C>;
  private _transitions: Transition<C>[];

  constructor(options?: Partial<StateOptions<C>>) {
    this._preStateFn = (options && options.preStateFn) || stateFnDefaultNull;
    this._stateFn = (options && options.stateFn) || stateFnDefaultHalt;
    this._postStateFn = (options && options.postStateFn) || stateFnDefaultNull;
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

  setStateFn(stateFn: StateFn<C>) {
    this._stateFn = stateFn;
  }

  addTransition(transition: Transition<C>) {
    this._transitions.push(transition);
  }

  transitions(): readonly Readonly<Transition<C>>[] {
    return this._transitions;
  }
}

export class SleepState extends State<any> {
  constructor(
    ms: number
  )
  {
    super({ stateFn: () => sleep(ms) });
  }
}

export const stateFnDefaultNull: StateFn<any> =
  (_) => Promise.resolve();

export const stateFnDefaultHalt: StateFn<any> =
  (_) => new Promise(() => {});
