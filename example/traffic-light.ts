import {
  State,
  Transition,
  Manager,
  link,
} from '../dist';
import {
  Timer,
  sleep,
} from '../dist/utils';


/*  Traffic light FSM
 *
 *  tlGreen
 *    |
 *    + ?tlIsGreenDone
 *    |
 *    v
 *  tlYellow
 *    |
 *    + ?tlIsYellowDone
 *    |
 *    v
 *  tlRed
 *    |
 *    + ?tlIsRedDone
 *    |
 *    v
 *  tlGreen
 */

const Light = {
  Green: 'green',
  Yellow: 'yellow',
  Red: 'red',
} as const;

type Light = typeof Light[keyof typeof Light]

interface TrafficLightContext {
  currentLight: Light,
  greenTimer: Timer,
  yellowTimer: Timer,
  redTimer: Timer,
}

function createTrafficLightContext(): TrafficLightContext {
  return {
    currentLight: Light.Green,
    greenTimer: new Timer(5000),
    yellowTimer: new Timer(1000),
    redTimer: new Timer(5000),
  };
}

const tlGreen: State<TrafficLightContext> =
  new State(
    {
      preStateFn: async (context) => {
        console.log('Enter glGreen state.');
        context.currentLight = Light.Green;
        context.greenTimer.init();
      },
      stateFn: async (context) => {
        console.log(`Current in ${context.currentLight} light...`);
        await sleep(1000);
      },
      postStateFn: async () => {
        console.log('Exit glGreen state.');
      },
    }
  );

const tlIsGreenDone: Transition<TrafficLightContext> =
  new Transition(
    {
      conditionFn: (context) => {
        return context.greenTimer.elapsed();
      },
      transitionFn: () => {
        console.log('Green done!');
      },
    }
  );

const tlYellow: State<TrafficLightContext> =
  new State(
    {
      preStateFn: async (context) => {
        console.log('Enter glYellow state.');
        context.currentLight = Light.Yellow;
        context.yellowTimer.init();
      },
      stateFn: async (context) => {
        console.log(`Current in ${context.currentLight} light...`);
        await sleep(1000);
      },
      postStateFn: async () => {
        console.log('Exit glYellow state.');
      },
    }
  );

const tlIsYellowDone: Transition<TrafficLightContext> =
  new Transition(
    {
      conditionFn: (context) => {
        return context.yellowTimer.elapsed();
      },
      transitionFn: () => {
        console.log('Yellow done!');
      },
    }
  );

const tlRed: State<TrafficLightContext> =
  new State(
    {
      preStateFn: async (context) => {
        console.log('Enter glRed state.');
        context.currentLight = Light.Red;
        context.redTimer.init();
      },
      stateFn: async (context) => {
        console.log(`Current in ${context.currentLight} light...`);
        await sleep(1000);
      },
      postStateFn: async () => {
        console.log('Exit glRed state.');
      },
    }
  );

const tlIsRedDone: Transition<TrafficLightContext> =
  new Transition(
    {
      conditionFn: (context) => {
        return context.redTimer.elapsed();
      },
      transitionFn: () => {
        console.log('Red done!');
      },
    }
  );

link(tlGreen, tlYellow, tlIsGreenDone);
link(tlYellow, tlRed, tlIsYellowDone);
link(tlRed, tlGreen, tlIsRedDone);

const tlManager: Manager<TrafficLightContext> =
  new Manager(
    createTrafficLightContext,
    tlGreen,
  );

void tlManager.run();
