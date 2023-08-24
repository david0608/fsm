import {
  ConstructorParameters,
  assertBothExtends,
} from './type';
import {
  State,
} from './state';
import {
  Transition,
} from './transition';
import {
  link,
} from './link';
import {
  Manager,
} from './manager';

interface Context {
  name: string,
  age: number,
}

function createContext() {
  return {
    name: 'hello',
    age: 123,
  };
}

describe('module manager', () => {

  describe('class Manager<C>', () => {

    describe('constructor()', () => {

      it('Should accept expected type as parameters.', () => {
        type E = [
          createContext: () => Context,
          initialState: State<Context>
        ]
        type A = ConstructorParameters<typeof Manager<Context>>
        assertBothExtends<E, A, E>();
      });

      it('Should initialize context as expected.', () => {
        const ctx = createContext();
        const s = new State<Context>();
        const m = new Manager(() => ctx, s);
        expect(m.context() === ctx).toBe(true);
      });

    });

    describe('context()', () => {

      it('Should accept expected type as parameters.', () => {
        const s = new State<Context>();
        const m = new Manager(createContext, s);
        type E = []
        type A = Parameters<typeof m.context>
        assertBothExtends<E, A, E>();
      });

      it('Should return expected type.', () => {
        const s = new State<Context>();
        const m = new Manager(createContext, s);
        type E = Context
        type A = ReturnType<typeof m.context>
        assertBothExtends<E, A, E>();
      });

      it('Should return expected value.', () => {
        const ctx = createContext();
        const s = new State<Context>();
        const m = new Manager(() => ctx, s);
        expect(m.context() === ctx).toBe(true);
      });

    });

    describe('forth()', () => {

      it('Should accept expected type as parameters.', () => {
        const s = new State<Context>();
        const m = new Manager(createContext, s);
        type E = []
        // @ts-expect-error forth is private.
        type A = Parameters<typeof m.forth>
        assertBothExtends<E, A, E>();
      });

      it('Should return expected type.', () => {
        const s = new State<Context>();
        const m = new Manager(createContext, s);
        type E = Promise<void>
        // @ts-expect-error forth is private.
        type A = ReturnType<typeof m.forth>
        assertBothExtends<E, A, E>();
      });

      it(
        'Should only call stateFn of current state and conditionFn of ' +
        'transitions connected to current state once, if no transition ' +
        'happened.',
        async () => {
          const context = createContext();

          const called = {
            pre: [0, 0, 0, 0, 0],
            s: [0, 0, 0, 0, 0],
            post: [0, 0, 0, 0, 0],
            c: [0, 0, 0, 0],
            t: [0, 0, 0, 0],
          };

          const states = [...Array(5).keys()].map(
            (i) => {
              return new State(
                {
                  preStateFn: async (ctx) => {
                    expect(ctx === context).toBe(true);
                    called.pre[i] += 1;
                  },
                  stateFn: async (ctx) => {
                    expect(ctx === context).toBe(true);
                    called.s[i] += 1;
                  },
                  postStateFn: async (ctx) => {
                    expect(ctx === context).toBe(true);
                    called.post[i] += 1;
                  },
                }
              );
            }
          );

          const transitions = [...Array(4).keys()].map(
            (i) => {
              return new Transition(
                {
                  conditionFn: (ctx) => {
                    expect(ctx === context).toBe(true);
                    called.c[i] += 1;
                    return false;
                  },
                  transitionFn: (ctx) => {
                    expect(ctx === context).toBe(true);
                    called.t[i] += 1;
                  },
                }
              );
            }
          );

          // @ts-expect-error Unchecked indexed access.
          link(states[0], states[1], transitions[0]);
          // @ts-expect-error Unchecked indexed access.
          link(states[0], states[2], transitions[1]);
          // @ts-expect-error Unchecked indexed access.
          link(states[1], states[3], transitions[2]);
          // @ts-expect-error Unchecked indexed access.
          link(states[1], states[4], transitions[3]);

          // @ts-expect-error Unchecked indexed access.
          const m = new Manager(() => context, states[0]);
          // @ts-expect-error forth is private.
          await m.forth();

          expect(called.pre).toEqual([0, 0, 0, 0, 0]);
          expect(called.s).toEqual([1, 0, 0, 0, 0]);
          expect(called.post).toEqual([0, 0, 0, 0, 0]);
          expect(called.c).toEqual([1, 1, 0, 0]);
          expect(called.t).toEqual([0, 0, 0, 0]);

          // @ts-expect-error forth is private.
          await m.forth();

          expect(called.pre).toEqual([0, 0, 0, 0, 0]);
          expect(called.s).toEqual([2, 0, 0, 0, 0]);
          expect(called.post).toEqual([0, 0, 0, 0, 0]);
          expect(called.c).toEqual([2, 2, 0, 0]);
          expect(called.t).toEqual([0, 0, 0, 0]);
        }
      );

      it(
        'Should only call stateFn of current state, postStateFn of current ' +
        'state, preStateFn of next state, condtionFn of transitions prior to ' +
        'the triggered transitioin, and transitionFn of the triggered transition ' +
        'once, if transition hanppened.',
        async () => {
          const context = createContext();

          const called = {
            pre: [0, 0, 0, 0, 0],
            s: [0, 0, 0, 0, 0],
            post: [0, 0, 0, 0, 0],
            c: [0, 0, 0, 0],
            t: [0, 0, 0, 0],
          };

          const states = [...Array(5).keys()].map(
            (i) => {
              return new State(
                {
                  preStateFn: async (ctx) => {
                    expect(ctx === context).toBe(true);
                    called.pre[i] += 1;
                  },
                  stateFn: async (ctx) => {
                    expect(ctx === context).toBe(true);
                    called.s[i] += 1;
                  },
                  postStateFn: async (ctx) => {
                    expect(ctx === context).toBe(true);
                    called.post[i] += 1;
                  },
                }
              );
            }
          );

          const shouldTransitions = [true, false, false, true];
          const transitions = [...Array(4).keys()].map(
            (i) => {
              return new Transition(
                {
                  // @ts-expect-error Unchecked indexed access.
                  conditionFn: (ctx) => {
                    expect(ctx === context).toBe(true);
                    called.c[i] += 1;
                    return shouldTransitions[i];
                  },
                  transitionFn: (ctx) => {
                    expect(ctx === context).toBe(true);
                    called.t[i] += 1;
                  },
                }
              );
            }
          );

          // @ts-expect-error Unchecked indexed access.
          link(states[0], states[1], transitions[0]);
          // @ts-expect-error Unchecked indexed access.
          link(states[0], states[2], transitions[1]);
          // @ts-expect-error Unchecked indexed access.
          link(states[1], states[3], transitions[2]);
          // @ts-expect-error Unchecked indexed access.
          link(states[1], states[4], transitions[3]);

          // @ts-expect-error Unchecked indexed access.
          const m = new Manager(() => context, states[0]);
          // @ts-expect-error forth is private.
          await m.forth();

          expect(called.pre).toEqual([0, 1, 0, 0, 0]);
          expect(called.s).toEqual([1, 0, 0, 0, 0]);
          expect(called.post).toEqual([1, 0, 0, 0, 0]);
          expect(called.c).toEqual([1, 0, 0, 0]);
          expect(called.t).toEqual([1, 0, 0, 0]);

          // @ts-expect-error forth is private.
          await m.forth();

          expect(called.pre).toEqual([0, 1, 0, 0, 1]);
          expect(called.s).toEqual([1, 1, 0, 0, 0]);
          expect(called.post).toEqual([1, 1, 0, 0, 0]);
          expect(called.c).toEqual([1, 0, 1, 1]);
          expect(called.t).toEqual([1, 0, 0, 1]);
        }
      );

    });

  });

});
