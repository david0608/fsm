import { asImmutable } from './type';
import { State } from './state';

export class Manager<C> {
  private _context: C;
  private _currentState: State<C>;
  private _running: boolean;

  constructor(
    createContext: () => C,
    initialState: State<C>,
  )
  {
    this._context = createContext();
    this._currentState = initialState;
    this._running = false;
  }

  context() {
    return this._context;
  }

  private async forth() {
    await this._currentState.stateFn()(this._context);

    for (const transition of this._currentState.transitions()) {
      if (transition.check(asImmutable(this._context))) {
        await this._currentState.postStateFn()(this.context());
        transition.transition(this._context);
        this._currentState = transition.state();
        await this._currentState.preStateFn()(this.context());
        return;
      }
    }
  }

  async run() {
    if (this._running) {
      return;
    }
    this._running = true;
    await this._currentState.preStateFn()(this.context());
    while (true) {
      await this.forth();
    }
  }
}
