import { Immutable } from './type';
import { State } from './state';
export type ConditionFn<C> = (context: Immutable<C>) => boolean;
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
    check(context: Immutable<C>): boolean;
    transition(context: C): void;
    state(): State<C>;
    setState(state: State<C>): void;
}
export {};
