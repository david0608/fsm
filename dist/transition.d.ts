import { State } from './state';
export type ConditionFn<C> = (context: C) => boolean;
export type TransitionFn<C> = (context: C) => void;
interface TransitionOptions<C> {
    conditionFn: ConditionFn<C>;
    transitionFn: TransitionFn<C>;
}
export declare class Transition<C> {
    private _conditionFn;
    private _transitionFn;
    private _state;
    constructor(options?: Partial<TransitionOptions<C>>);
    conditionFn(): ConditionFn<C>;
    check(context: C): boolean;
    transitionFn(): TransitionFn<C>;
    transition(context: C): void;
    state(): State<C>;
    setState(state: State<C>): void;
}
export declare const conditionFnDefaultTrue: ConditionFn<any>;
export declare const transitionFnDefaultNull: TransitionFn<any>;
export {};
