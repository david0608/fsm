import {
  assertBothExtends,
} from '../type';
import {
  sleep,
} from './sleep';

describe('module utils/sleep', () => {

  describe('function sleep()', () => {

    it('Should accept expected type as parameters.', () => {
      type E = [ms: number]
      type A = Parameters<typeof sleep>
      assertBothExtends<E, A, E>();
    });

    it('Should return expected type.', () => {
      type E = Promise<void>
      type A = ReturnType<typeof sleep>
      assertBothExtends<E, A, E>();
    });

    it('Returned Promise should resolve after duration reached.', async () => {
      const start = Date.now();
      await sleep(100);
      expect(Date.now() - start).toBeGreaterThanOrEqual(99);
    });

  });

});
