import type {
  ExpectTrue,
  Equal,
} from '../src/type';
import {
  State,
  StateFn,
  stateFnDefaultHalt,
  stateFnDefaultNull,
} from '../src/state';
import {
  Transition,
} from '../src/transition';

describe('state module', () => {

  interface Context {
    name: string,
    age: number,
  }

  describe('type StateFn<Context>', () => {

    it('Should accept parameters of type [Context].', () => {
      type L = Parameters<StateFn<Context>>
      type R = [Context]
      type T = ExpectTrue<Equal<L, R>>
    });

    it('Should return type of Promise<void>.', () => {
      type L = ReturnType<StateFn<Context>>
      type R = Promise<void>
      type T = ExpectTrue<Equal<L, R>>
    });

  });

  describe('class State<Context>', () => {

    describe('constructor()', () => {

      it('Should initialize stateFn to stateFnDefaultHalt if stateFn not provided.', () => {
        const s = new State<Context>();
        expect(s.stateFn()).toEqual(stateFnDefaultHalt);
      });

      it('Should initialize stateFn to provided value.', () => {
        const sf = (c: Context) => Promise.resolve();
        const s = new State({ stateFn: sf });
        expect(s.stateFn()).toEqual(sf);
      });

      it('Should initialize transitions to empty array.', () => {
        const s = new State<Context>();
        expect(s.transitions().length).toEqual(0);
      });

    });

    describe('stateFn()', () => {

      it('Should accept no parameter.', () => {
        const s = new State<Context>();
        type L = Parameters<typeof s.stateFn>
        type R = []
        type T = ExpectTrue<Equal<L, R>>
      });

      it('Should return StateFn<Context> type.', () => {
        const s = new State<Context>();
        type L = ReturnType<typeof s.stateFn>
        type R = StateFn<Context>
        type T = ExpectTrue<Equal<L, R>>
      });

      it('Should return stateFn vlaue.', () => {
        const sf = (_c: Context) => Promise.resolve();
        const s = new State({ stateFn: sf });
        expect(s.stateFn()).toEqual(sf);
      });

    });

    describe('setStateFn()', () => {

      it('Should accept parameters of type [StateFn<Context>].', () => {
        const s = new State<Context>();
        type L = Parameters<typeof s.setStateFn>
        type R = [StateFn<Context>]
        type T = ExpectTrue<Equal<L, R>>
      });

      it('Should return void.', () => {
        const s = new State<Context>();
        type L = ReturnType<typeof s.setStateFn>
        type T = ExpectTrue<Equal<L, void>>
      });

      it('Should set stateFn property to provided value.', () => {
        const s = new State<Context>();
        const sf = (_c: Context) => Promise.resolve();
        s.setStateFn(sf);
        expect(s.stateFn()).toEqual(sf);
      });

    });

    describe('addTransition()', () => {

      it('Should accept parameters of type [Transition<Context>].', () => {
        const s = new State<Context>();
        type L = Parameters<typeof s.addTransition>
        type R = [Transition<Context>]
        type T = ExpectTrue<Equal<L, R>>
      });

      it('Should return void.', () => {
        const s = new State<Context>();
        type L = ReturnType<typeof s.addTransition>
        type R = void
        type T = ExpectTrue<Equal<L, R>>
      });

      it('Should add transition to the State in correct order.', () => {
        const s = new State<Context>();
        const t1 = new Transition<Context>;
        const t2 = new Transition<Context>;
        s.addTransition(t1);
        s.addTransition(t2);
        expect(s.transitions()).toEqual([t1, t2]);
      });

    });

    describe('transitions()', () => {

      it('Should accept no parameter.', () => {
        const s = new State<Context>();
        type L = Parameters<typeof s.transitions>
        type R = []
        type T = ExpectTrue<Equal<L, R>>
      });

      it('Should return type of readonly Readonly<Transition<Context>>[].', () => {
        const s = new State<Context>();
        type L = ReturnType<typeof s.transitions>
        type R = readonly Readonly<Transition<Context>>[]
        type T = ExpectTrue<Equal<L, R>>
      });

      it('Should return transitions of the State.', () => {
        const s = new State<Context>();
        const t1 = new Transition<Context>;
        const t2 = new Transition<Context>;
        s.addTransition(t1);
        s.addTransition(t2);
        expect(s.transitions()).toEqual([t1, t2]);
      });

    });

  });

  describe('stateFnDefaultNull()', () => {

    it('Should be type of StateFn<any>.', () => {
      type L = typeof stateFnDefaultNull
      type R = StateFn<any>
      type T = ExpectTrue<Equal<L, R>>
    });

  });

  describe('stateFnDefaultHalt', () => {

    it('Should be type of StateFn<any>.', () => {
      type L = typeof stateFnDefaultHalt
      type R = StateFn<any>
      type T = ExpectTrue<Equal<L, R>>
    });

  });

});
