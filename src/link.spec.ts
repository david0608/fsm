import {
  assertBothExtends,
} from './type';
import {
  State,
  stateFnDefaultHalt,
  stateFnDefaultNull,
} from './state';
import {
  Transition,
} from './transition';
import {
  link,
} from './link';

interface Context {
  name: string
  age: number
}

describe('module link', () => {

  describe('function link()', () => {

    it('Should accept expected type as parameters.', () => {
      type E = [
        from: State<Context>,
        to: State<Context>,
        transition?: Transition<Context>
      ]
      type A = Parameters<typeof link<Context>>
      assertBothExtends<E, A, E>();
    });

    it('Should return expected type.', () => {
      type E = void
      type A = ReturnType<typeof link<Context>>
      assertBothExtends<E, A, E>();
    });

    it('Should link states with transition.', () => {
      const s1 = new State<Context>();
      const s2 = new State<Context>();
      const t = new Transition<Context>();
      link(s1, s2, t);
      expect(s1.transitions()[0] === t).toBe(true);
      expect(t.state() === s2).toBe(true);
    });

    it('Should link states with transitions in correct order.', () => {
      const s1 = new State<Context>();
      const s2 = new State<Context>();
      const s3 = new State<Context>();
      const t1 = new Transition<Context>();
      const t2 = new Transition<Context>();
      link(s1, s2, t1);
      link(s1, s3, t2);
      expect(s1.transitions()[0] === t1).toBe(true);
      expect(s1.transitions()[1] === t2).toBe(true);
      expect(t1.state() === s2).toBe(true);
      expect(t2.state() === s3).toBe(true);
    });

    it('Should set stateFn of source state to defaultNull if it is defaultHalt.', () => {
      const s1 = new State<Context>();
      const s2 = new State<Context>();
      const t = new Transition<Context>();
      expect(s1.stateFn() === stateFnDefaultHalt).toBe(true);
      link(s1, s2, t);
      expect(s1.stateFn() === stateFnDefaultNull).toBe(true);
    });

  });

});
