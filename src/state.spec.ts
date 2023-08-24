import {
  ConstructorParameters,
  assertBothExtends,
} from './type';
import {
  StateFn,
  State,
  stateFnDefaultHalt,
  stateFnDefaultNull,
} from './state';
import {
  Transition,
} from './transition';

describe('module state', () => {

  interface Context {
    name: string,
    age: number,
  }

  describe('type StateFn<C>', () => {

    it('Should accept expected type as parameters.', () => {
      type E = [context: Context]
      type A = Parameters<StateFn<Context>>
      assertBothExtends<E, A, E>();
    });

    it('Should return expected type.', () => {
      type E = Promise<void>
      type A = ReturnType<StateFn<Context>>
      assertBothExtends<E, A, E>();
    });

  });

  describe('class State<C>', () => {

    describe('constructor()', () => {

      it('Should accept expected type as parameters.', () => {
        type E = [
          options?: Partial<{
            preStateFn: StateFn<Context>
            stateFn: StateFn<Context>
            postStateFn: StateFn<Context>
          }>
        ]
        type A = ConstructorParameters<typeof State<Context>>
        assertBothExtends<E, A, E>();
      });

      it('Should initialize preStateFn to stateFnDefaultNull if preStateFn not provided.', () => {
        const s = new State<Context>();
        expect(s.preStateFn() === stateFnDefaultNull).toBe(true);
      });

      it('Should initialize preStateFn to provided value.', () => {
        const sf = () => Promise.resolve();
        const s = new State({ preStateFn: sf });
        expect(s.preStateFn() === sf).toBe(true);
      });

      it('Should initialize stateFn to stateFnDefaultHalt if stateFn not provided.', () => {
        const s = new State<Context>();
        expect(s.stateFn() === stateFnDefaultHalt).toBe(true);
      });

      it('Should initialize stateFn to provided value.', () => {
        const sf = () => Promise.resolve();
        const s = new State({ stateFn: sf });
        expect(s.stateFn() === sf).toBe(true);
      });

      it('Should initialize postStateFn to stateFnDefaultNull if postStateFn not provided.', () => {
        const s = new State<Context>();
        expect(s.postStateFn() === stateFnDefaultNull).toBe(true);
      });

      it('Should initialize postStateFn to provided value.', () => {
        const sf = () => Promise.resolve();
        const s = new State({ postStateFn: sf });
        expect(s.postStateFn() === sf).toBe(true);
      });

      it('Should initialize transitions to empty array.', () => {
        const s = new State<Context>();
        expect(s.transitions().length).toEqual(0);
      });

    });

    describe('preStateFn()', () => {

      it('Should accept expected type as parameters.', () => {
        const s = new State<Context>();
        type E = []
        type A = Parameters<typeof s.preStateFn>
        assertBothExtends<E, A, E>();
      });

      it('Should return expected type.', () => {
        const s = new State<Context>();
        type E = StateFn<Context>
        type A = ReturnType<typeof s.preStateFn>
        assertBothExtends<E, A, E>();
      });

      it('Should return expected value.', () => {
        const sf = (_c: Context) => Promise.resolve();
        const s = new State({ preStateFn: sf });
        expect(s.preStateFn() === sf).toBe(true);
      });

    });

    describe('stateFn()', () => {

      it('Should accept expected type as parameters.', () => {
        const s = new State<Context>();
        type E = []
        type A = Parameters<typeof s.stateFn>
        assertBothExtends<E, A, E>();
      });

      it('Should return expected type.', () => {
        const s = new State<Context>();
        type E = StateFn<Context>
        type A = ReturnType<typeof s.stateFn>
        assertBothExtends<E, A, E>();
      });

      it('Should return expected vlaue.', () => {
        const sf = (_c: Context) => Promise.resolve();
        const s = new State({ stateFn: sf });
        expect(s.stateFn() === sf).toBe(true);
      });

    });

    describe('postStateFn()', () => {

      it('Should accept expected type as parameters.', () => {
        const s = new State<Context>();
        type E = []
        type A = Parameters<typeof s.postStateFn>
        assertBothExtends<E, A, E>();
      });

      it('Should return expected type.', () => {
        const s = new State<Context>();
        type E = StateFn<Context>
        type A = ReturnType<typeof s.postStateFn>
        assertBothExtends<E, A, E>();
      });

      it('Should return expected vlaue.', () => {
        const sf = (_c: Context) => Promise.resolve();
        const s = new State({ postStateFn: sf });
        expect(s.postStateFn() === sf).toBe(true);
      });

    });

    describe('setStateFn()', () => {

      it('Should accept expected type as parameters.', () => {
        const s = new State<Context>();
        type E = [stateFn: StateFn<Context>]
        type A = Parameters<typeof s.setStateFn>
        assertBothExtends<E, A, E>();
      });

      it('Should return expected type.', () => {
        const s = new State<Context>();
        type E = void
        type A = ReturnType<typeof s.setStateFn>
        assertBothExtends<E, A, E>();
      });

      it('Should set stateFn property to provided value.', () => {
        const s = new State<Context>();
        const sf = (_c: Context) => Promise.resolve();
        s.setStateFn(sf);
        expect(s.stateFn() === sf).toBe(true);
      });

    });

    describe('addTransition()', () => {

      it('Should accept expected type as parameters.', () => {
        const s = new State<Context>();
        type E = [transition: Transition<Context>]
        type A = Parameters<typeof s.addTransition>
        assertBothExtends<E, A, E>();
      });

      it('Should return expected type.', () => {
        const s = new State<Context>();
        type E = void
        type A = ReturnType<typeof s.addTransition>
        assertBothExtends<E, A, E>();
      });

      it('Should add transition to the State in correct order.', () => {
        const s = new State<Context>();
        const t1 = new Transition<Context>;
        const t2 = new Transition<Context>;
        s.addTransition(t1);
        s.addTransition(t2);
        expect(s.transitions()[0] === t1).toBe(true);
        expect(s.transitions()[1] === t2).toBe(true);
      });

    });

    describe('transitions()', () => {

      it('Should accept expected type as parameter.', () => {
        const s = new State<Context>();
        type E = []
        type A = Parameters<typeof s.transitions>
        assertBothExtends<E, A, E>();
      });

      it('Should return expected type.', () => {
        const s = new State<Context>();
        type E = readonly Readonly<Transition<Context>>[]
        type A = ReturnType<typeof s.transitions>
        assertBothExtends<E, A, E>();
      });

      it('Should return transitions of the State.', () => {
        const s = new State<Context>();
        const t1 = new Transition<Context>;
        const t2 = new Transition<Context>;
        s.addTransition(t1);
        s.addTransition(t2);
        expect(s.transitions()[0] === t1).toBe(true);
        expect(s.transitions()[1] === t2).toBe(true);
      });

    });

  });

  describe('function stateFnDefaultNull()', () => {

    it('Should be expected type.', () => {
      type E = StateFn<any>
      type A = typeof stateFnDefaultNull
      assertBothExtends<E, A, E>();
    });

  });

  describe('function stateFnDefaultHalt())', () => {

    it('Should be expected type.', () => {
      type E = StateFn<any>
      type A = typeof stateFnDefaultHalt
      assertBothExtends<E, A, E>();
    });

  });

});
