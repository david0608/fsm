import { State } from './state';
export declare class Manager<C> {
    private _context;
    private _currentState;
    private _running;
    constructor(createContext: () => C, initialState: State<C>);
    context(): C;
    private forth;
    run(): Promise<void>;
}
