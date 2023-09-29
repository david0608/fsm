import {
  State,
  Manager,
} from '../dist';

const foo: State<void> =
  new State(
    {
      stateFn: async () => {
        console.log('foo');
      }
    }
  );

const bar: State<void> =
  new State(
    {
      stateFn: async () => {
        console.log('bar');
      }
    }
  );

const fooManager: Manager<void> =
  new Manager(
    () => {},
    foo,
  );

const barManager: Manager<void> =
  new Manager(
    () => {},
    bar,
  );

void fooManager.run();
void barManager.run();
