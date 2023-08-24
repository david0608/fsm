import {
  Clock,
  ClockStatus,
} from './clock';
import {
  sleep,
} from './sleep';
import {
  assertExtends,
  assertBothExtends,
  ConstructorParameters,
} from '../type';

describe('module utils/clock', () => {

  describe('type ClockStatus', () => {

    it('Should only assignable by specific types.', () => {
      assertExtends<'reached', ClockStatus>();
      assertExtends<'canceled', ClockStatus>();
      assertExtends<'idle', ClockStatus>();
      // @ts-expect-error Should not assignable.
      assertExtends<'reachedd', ClockStatus>();
      // @ts-expect-error Should not assignable.
      assertExtends<'canceledd', ClockStatus>();
      // @ts-expect-error Should not assignable.
      assertExtends<'iidle', ClockStatus>();
      // @ts-expect-error Should not assignable.
      assertExtends<string, ClockStatus>();
      // @ts-expect-error Should not assignable.
      assertExtends<number, ClockStatus>();
      // @ts-expect-error Should not assignable.
      assertExtends<0, ClockStatus>();
    });

  });

  describe('class Clock', () => {

    describe('constructor()', () => {

      it('Should accept expected type as parameters.', () => {
        type E = [duration: number]
        type A = ConstructorParameters<typeof Clock>
        assertBothExtends<E, A, E>();
      });

    });

    describe('init()', () => {

      it('Should accept expected type as parameters.', () => {
        const c = new Clock(0);
        type E = []
        type A = Parameters<typeof c.init>
        assertBothExtends<E, A, E>();
      });

      it('Should return expected type.', () => {
        const c = new Clock(0);
        type E = void
        type A = ReturnType<typeof c.init>
        assertBothExtends<E, A, E>();
      });

      it('Should initialize Clock.', () => {
        const c = new Clock(100);
        expect(c.isWaiting()).toBe(false);
        c.init();
        expect(c.isWaiting()).toBe(true);
      });

    });

    describe('cancel()', () => {

      it('Should accept expected type as parameters.', () => {
        const c = new Clock(0);
        type E = []
        type A = Parameters<typeof c.cancel>
        assertBothExtends<E, A, E>();
      });

      it('Should return expected type.', () => {
        const c = new Clock(0);
        type E = void
        type A = ReturnType<typeof c.cancel>
        assertBothExtends<E, A, E>();
      });

      it('Should resolve waiting promises to ClockStatus.Canceled.', async () => {
        const c = new Clock(100);
        c.init();
        let s1: ClockStatus | undefined = undefined;
        let s2: ClockStatus | undefined = undefined;
        void c.wait().then((s) => s1 = s);
        void c.wait().then((s) => s2 = s);
        await sleep(50);
        c.cancel();
        await sleep(0);
        expect(s1).toEqual(ClockStatus.Canceled);
        expect(s2).toEqual(ClockStatus.Canceled);
      });

    });

    describe('wait()', () => {

      it('Should accept expected type as parameters.', () => {
        const c = new Clock(0);
        type E = []
        type A = Parameters<typeof c.wait>
        assertBothExtends<E, A, E>();
      });

      it('Should return expected type.', () => {
        const c = new Clock(0);
        type E = Promise<ClockStatus>
        type A = ReturnType<typeof c.wait>
        assertBothExtends<E, A, E>();
      });

      it('Returned Promise should resolve to ClockStatus.Idle if the clock is not inited.', async () => {
        const c = new Clock(100);
        let start = Date.now();
        expect(await c.wait()).toEqual(ClockStatus.Idle);
        expect(Date.now() - start < 10).toBe(true);
      });

      it('Returned Promise should resolve to ClockStatus.Reached after duration reached.', async () => {
        const c = new Clock(100);
        c.init();
        let s1: ClockStatus | undefined = undefined;
        let s2: ClockStatus | undefined = undefined;
        void c.wait().then((s) => s1 = s);
        void c.wait().then((s) => s2 = s);
        await sleep(50);
        expect(s1).toEqual(undefined);
        expect(s2).toEqual(undefined);
        await sleep(50);
        expect(s1).toEqual(ClockStatus.Reached);
        expect(s2).toEqual(ClockStatus.Reached);
      });

      it('Returned Promise should resolve to ClockStatus.Canceled after cancel.', async () => {
        const c = new Clock(100);
        c.init();
        let s1: ClockStatus | undefined = undefined;
        let s2: ClockStatus | undefined = undefined;
        void c.wait().then((s) => s1 = s);
        void c.wait().then((s) => s2 = s);
        await sleep(50);
        expect(s1).toEqual(undefined);
        expect(s2).toEqual(undefined);
        c.cancel();
        await sleep(0);
        expect(s1).toEqual(ClockStatus.Canceled);
        expect(s2).toEqual(ClockStatus.Canceled);
      });

    });

    describe('isWaiting()', () => {

      it('Should accept expected type as parameters.', () => {
        const c = new Clock(0);
        type E = []
        type A = Parameters<typeof c.isWaiting>
        assertBothExtends<E, A, E>();
      });

      it('Should return expected type.', () => {
        const c = new Clock(0);
        type E = boolean
        type A = ReturnType<typeof c.isWaiting>
        assertBothExtends<E, A, E>();
      });

      it('Should return true until duration reached.', async () => {
        const c = new Clock(100);
        c.init();
        expect(c.isWaiting()).toBe(true);
        await sleep(50);
        expect(c.isWaiting()).toBe(true);
        await sleep(50);
        expect(c.isWaiting()).toBe(false);
      });

      it('Should return true until cancel.', async () => {
        const c = new Clock(100);
        c.init();
        expect(c.isWaiting()).toBe(true);
        await sleep(50);
        expect(c.isWaiting()).toBe(true);
        c.cancel();
        expect(c.isWaiting()).toBe(false);
      });

    });

  });

});
