import { State } from './state';
import { Transition } from './transition';
export declare function link<C>(from: State<C>, to: State<C>, transition?: Transition<C>): void;
