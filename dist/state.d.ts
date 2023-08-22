import { Transition } from './transition';
export type StateFn<C> = (context: C) => Promise<void>;
interface StateOptions<C> {
    preStateFn: StateFn<C>;
    stateFn: StateFn<C>;
    postStateFn: StateFn<C>;
}
export declare class State<C> {
    private _preStateFn;
    private _stateFn;
    private _postStateFn;
    private _transitions;
    constructor(options?: Partial<StateOptions<C>>);
    preStateFn(): StateFn<C>;
    stateFn(): StateFn<C>;
    postStateFn(): StateFn<C>;
    setStateFn(stateFn: StateFn<C>): void;
    addTransition(transition: Transition<C>): void;
    transitions(): readonly Readonly<Transition<C>>[];
}
export declare class SleepState extends State<any> {
    constructor(ms: number);
}
export declare const stateFnDefaultNull: StateFn<any>;
export declare const stateFnDefaultHalt: StateFn<any>;
export {};
