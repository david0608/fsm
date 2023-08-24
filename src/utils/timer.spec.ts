import {
  Timer,
} from './timer';
import {
  sleep,
} from './sleep';
import {
  assertBothExtends,
  ConstructorParameters,
} from '../type';

describe('module utils/timer', () => {

  describe('class Timer', () => {

    describe('constructor()', () => {

      it('Should sccept expected type a parameters.', () => {
        type E = [duration: number]
        type A = ConstructorParameters<typeof Timer>
        assertBothExtends<E, A, E>();
      });

    });

    describe('init()', () => {

      it('Should accept expected type a parameters.', () => {
        const t = new Timer(0);
        type E = []
        type A = Parameters<typeof t.init>
        assertBothExtends<E, A, E>();
      });

      it('Should return expected type.', () => {
        const t = new Timer(0);
        type E = void
        type A = ReturnType<typeof t.init>
        assertBothExtends<E, A, E>();
      });

      it('Should reset elapsed status.', async () => {
        const t = new Timer(50);
        await sleep(51);
        expect(t.elapsed()).toBe(true);
        t.init();
        expect(t.elapsed()).toBe(false);
        await sleep(51);
        expect(t.elapsed()).toBe(true);
      });

    });

    describe('elapsed()', () => {

      it('Should accept expected type a parameters.', () => {
        const t = new Timer(0);
        type E = []
        type A = Parameters<typeof t.elapsed>
        assertBothExtends<E, A, E>();
      });

      it('Should return expected type.', () => {
        const t = new Timer(0);
        type E = boolean
        type A = ReturnType<typeof t.elapsed>
        assertBothExtends<E, A, E>();
      });

      it('Should return true after duration reached.', async () => {
        const t = new Timer(100);
        expect(t.elapsed()).toBe(false);
        await sleep(101);
        expect(t.elapsed()).toBe(true);
      });

    });

    describe('remains()', () => {

      it('Should accept expected type a parameters.', () => {
        const t = new Timer(0);
        type E = []
        type A = Parameters<typeof t.remains>
        assertBothExtends<E, A, E>();
      });

      it('Should return expected type.', () => {
        const t = new Timer(0);
        type E = number
        type A = ReturnType<typeof t.remains>
        assertBothExtends<E, A, E>();
      });

      it('Should return remain duration.', async () => {
        const t = new Timer(100);
        await sleep(50);
        expect(t.remains() >= 45 && t.remains() <= 55).toBe(true);
      });

    });

  });

});
