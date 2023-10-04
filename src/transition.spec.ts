import {
  ConstructorParameters,
  assertBothExtends,
} from './type';
import {
  State,
} from './state';
import {
  ConditionFn,
  TransitionFn,
  Transition,
  conditionFnDefaultTrue,
  transitionFnDefaultNull,
} from './transition';

describe('module transition', () => {

  interface Context {
    name: string
    age: number
  }

  describe('type ConditionFn<C>', () => {

    it('Should accept expected type as parameters.', () => {
      type E = [context: Context]
      type A = Parameters<ConditionFn<Context>>
      assertBothExtends<E, A, E>();
    });

    it('Should return expected type.', () => {
      type E = boolean
      type A = ReturnType<ConditionFn<Context>>
      assertBothExtends<E, A, E>();
    });

  });

  describe('type TransitionFn<C>', () => {

    it('Should accept expected type as parameters.', () => {
      type E = [context: Context]
      type A = Parameters<TransitionFn<Context>>
      assertBothExtends<E, A, E>();
    });

    it('Should return expected type.', () => {
      type E = void
      type A = ReturnType<TransitionFn<Context>>
      assertBothExtends<E, A, E>();
    });

  });

  describe('class Transition<C>', () => {

    describe('constructor()', () => {

      it('Should accept expected type as parameters.', () => {
        type E = [
          options?: Partial<{
            conditionFn: ConditionFn<Context>
            transitionFn: TransitionFn<Context>
          }>
        ]
        type A = ConstructorParameters<typeof Transition<Context>>
        assertBothExtends<E, A, E>();
      });

      it('Should initialize conditionFn to conditionFnDefaultTrue if conditionFn not provided.', () => {
        const t = new Transition<Context>();
        expect(t.conditionFn() === conditionFnDefaultTrue).toBe(true);
      });

      it('Should initialize conditionFn to provided value.', () => {
        const cf = () => false;
        const t = new Transition({ conditionFn: cf });
        expect(t.conditionFn() === cf).toBe(true);
      });

      it('Should initialize transitionFn to transitionFnDefaultNull if transitionFn not provided.', () => {
        const t = new Transition<Context>();
        expect(t.transitionFn() === transitionFnDefaultNull).toBe(true);
      });

      it('Should initialize transitionFn to provided value.', () => {
        const tf = () => { };
        const t = new Transition({ transitionFn: tf });
        expect(t.transitionFn() === tf).toBe(true);
      });

    });

    describe('conditionFn()', () => {

      it('Should accept expected type as parameters.', () => {
        const t = new Transition<Context>();
        type E = []
        type A = Parameters<typeof t.conditionFn>
        assertBothExtends<E, A, E>();
      });

      it('Should return expected type.', () => {
        const t = new Transition<Context>();
        type E = ConditionFn<Context>
        type A = ReturnType<typeof t.conditionFn>
        assertBothExtends<E, A, E>();
      });

      it('Should return expected value.', () => {
        const cf = () => false;
        const t = new Transition({ conditionFn: cf });
        expect(t.conditionFn() === cf).toBe(true);
      });

    });

    describe('check()', () => {

      it('Should accept expected type as parameters.', () => {
        const t = new Transition<Context>();
        type E = [context: Context]
        type A = Parameters<typeof t.check>
        assertBothExtends<E, A, E>();
      });

      it('Should return expected type.', () => {
        const t = new Transition<Context>();
        type E = boolean
        type A = ReturnType<typeof t.check>
        assertBothExtends<E, A, E>();
      });

      it('Should execute conditionFn once and return its return value.', () => {
        let check = 0;
        const cf = () => {
          check += 1;
          return check === 2;
        };
        const t = new Transition<undefined>({ conditionFn: cf });
        expect(t.check(undefined)).toBe(false);
        expect(check).toEqual(1);
        expect(t.check(undefined)).toBe(true);
        expect(check).toEqual(2);
      });

      it('Should pass accepted Context value to the underlying conditionFn.', () => {
        const context = { name: 'hello' };
        const cf = (ctx: typeof context) => ctx === context;
        const t = new Transition({ conditionFn: cf });
        expect(t.check(context)).toBe(true);
      });

    });

    describe('transitionFn()', () => {

      it('Should accept expected type as parameters.', () => {
        const t = new Transition<Context>();
        type E = []
        type A = Parameters<typeof t.transitionFn>
        assertBothExtends<E, A, E>();
      });

      it('Should return expected type.', () => {
        const t = new Transition<Context>();
        type E = TransitionFn<Context>
        type A = ReturnType<typeof t.transitionFn>
        assertBothExtends<E, A, E>();
      });

      it('Should return expected value.', () => {
        const tf = () => {};
        const t = new Transition({ transitionFn: tf });
        expect(t.transitionFn() === tf).toBe(true);
      });

    });

    describe('transition()', () => {

      it('Should accept expected type as parameters.', () => {
        const t = new Transition<Context>();
        type E = [context: Context]
        type A = Parameters<typeof t.transition>
        assertBothExtends<E, A, E>();
      });

      it('Should return expected type.', () => {
        const t = new Transition<Context>();
        type E = void
        type A = ReturnType<typeof t.transition>
        assertBothExtends<E, A, E>();
      });

      it('Should execute transitionFn once.', () => {
        let check = 0;
        const tf = () => { check += 1; };
        const t = new Transition<undefined>({ transitionFn: tf });
        t.transition(undefined);
        expect(check).toEqual(1);
        t.transition(undefined);
        expect(check).toEqual(2);
      });

      it('Should pass accepted Context value to the underlying transitionFn.', () => {
        const context = { name: 'hello' };
        const tf = (ctx: typeof context) => {
          expect(ctx === context).toBe(true);
        };
        const t = new Transition({ transitionFn: tf });
        t.transition(context);
      });

    });

    describe('state()', () => {

      it('Should accept expected type as parameters.', () => {
        const t = new Transition<Context>();
        type E = []
        type A = Parameters<typeof t.state>
        assertBothExtends<E, A, E>();
      });

      it('Should return expected type.', () => {
        const t = new Transition<Context>();
        type E = State<Context>
        type A = ReturnType<typeof t.state>
        assertBothExtends<E, A, E>();
      });

      it('Should return expected value.', () => {
        const s = new State<Context>();
        const t = new Transition<Context>();
        t.setState(s);
        expect(t.state() === s).toBe(true);
      });

    });

    describe('setState()', () => {

      it('Should accept expected type as parameters.', () => {
        const t = new Transition<Context>();
        type E = [state: State<Context>]
        type A = Parameters<typeof t.setState>
        assertBothExtends<E, A, E>();
      });

      it('Should return expected type.', () => {
        const t = new Transition<Context>();
        type E = void
        type A = ReturnType<typeof t.setState>
        assertBothExtends<E, A, E>();
      });

      it('Should set state to provided value.', () => {
        const s = new State<Context>();
        const t = new Transition<Context>();
        t.setState(s);
        expect(t.state() === s).toBe(true);
      });

    });

  });

  describe('function conditionFnDefaultTrue', () => {

    it('Should be expected type.', () => {
      type E = ConditionFn<any>
      type A = typeof conditionFnDefaultTrue
      assertBothExtends<E, A, E>();
    });

  });

  describe('function transitionFnDefaultNull', () => {

    it('Should be expected type.', () => {
      type E = TransitionFn<any>
      type A = typeof transitionFnDefaultNull
      assertBothExtends<E, A, E>();
    });

  });

});
