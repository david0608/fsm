import {
  State,
  Transition,
  Manager,
  link,
} from '../dist';
import {
  sleep,
  Timer,
} from '../dist/utils';


/*  Device FSM
 *
 *  deviceWorking
 *    |
 *    + ?isDeviceBroken
 *    |
 *    v
 *  deviceBroken
 *    |
 *    + ?isDeviceGetFixed
 *    |
 *    v
 *  deviceWorking
 */

const DeviceStatus = {
  InOperation: 'in_operation',
  Broken: 'broken',
  GetFixed: 'get_fixed',
} as const;

type DeviceStatus = typeof DeviceStatus[keyof typeof DeviceStatus]

interface DeviceContext {
  status: DeviceStatus,
  failureRate: number,
}

const deviceWorking: State<DeviceContext> =
  new State(
    {
      preStateFn: async (context) => {
        context.status = DeviceStatus.InOperation;
      },
      stateFn: async () => {
        await sleep(500);
      },
    }
  );

const isDeviceBroken: Transition<DeviceContext> =
  new Transition(
    {
      conditionFn: (context) => {
        return Math.random() < context.failureRate;
      },
    }
  );

const deviceBroken: State<DeviceContext> =
  new State(
    {
      preStateFn: async (context) => {
        context.status = DeviceStatus.Broken;
      },
      stateFn: async () => {
        await sleep(500);
      },
    }
  );

const isDeviceGetFixed: Transition<DeviceContext> =
  new Transition(
    {
      conditionFn: (context) => {
        return context.status === DeviceStatus.GetFixed;
      },
    }
  );

link(deviceWorking, deviceBroken, isDeviceBroken);
link(deviceBroken, deviceWorking, isDeviceGetFixed);

class DeviceManager extends Manager<DeviceContext> {
  constructor(
    failureRate: number,
  ) {
    super(
      () => {
        return {
          status: DeviceStatus.InOperation,
          failureRate,
        };
      },
      deviceWorking,
    );
  }

  isInOperation() {
    return this.context().status === DeviceStatus.InOperation;
  }

  isBroken() {
    return this.context().status === DeviceStatus.Broken;
  }

  fix() {
    if (this.context().status === DeviceStatus.Broken) {
      this.context().status = DeviceStatus.GetFixed;
    }
  }
}


/*
 *  House keeper FSM
 *
 *  hkIdle
 *    |
 *    +-----+
 *    |     |
 *    |     + ?hkShouldFixLampStart
 *    |     |
 *    |     v
 *    |   hkFixLamp
 *    |     |
 *    |     +-----+
 *    |     |     |
 *    |     |     + ?hkShouldFixLampBreak
 *    |     |     |
 *    |     |     v
 *    |     |   hkIdle
 *    |     |
 *    |     + ?hkIsFixLampDone
 *    |     |
 *    |     v
 *    |   hkWaitLampRecover
 *    |     |
 *    |     + ?hkIsWaitLampRecoverDone
 *    |     |
 *    |     v
 *    |   hkIdle
 *    |
 *    +-----+
 *    |     |
 *    |     + ?hkShouldFixToiletStart
 *    |     |
 *    |     v
 *    |   hkFixToilet
 *    |     |
 *    |     +-----+
 *    |     |     |
 *    |     |     + ?hkShouldFixToiletBreak
 *    |     |     |
 *    |     |     v
 *    |     |   hkIdle
 *    |     |
 *    |     + ?hkIsFixToiletDone
 *    |     |
 *    |     v
 *    |   hkWaitToiletRecover
 *    |     |
 *    |     + ?hkIsWaitToiletRecoverDone
 *    |     |
 *    |     v
 *    |   hkIdle
 *    |
 *    + ?hkShouldFixElevatorStart
 *    |
 *    v
 *  hkFixElevator
 *    |
 *    + ?hkIsFixElevatorDone
 *    |
 *    v
 *  hkWaitElevatorRecover
 *    |
 *    + ?hkIsWaitElevatorRecoverDone
 *    |
 *    v
 *  hkIdle
 */

interface HouseKeeperContext {
  elevatorManager: DeviceManager,
  elevatorFixTimer: Timer,
  toiletManager: DeviceManager,
  toiletFixTimer: Timer,
  lampManager: DeviceManager,
  lampFixTimer: Timer,
}

function createHouseKeeperContext(
  elevatorManager: DeviceManager,
  toiletManager: DeviceManager,
  lampManager: DeviceManager,
): HouseKeeperContext
{
  return {
    elevatorManager,
    elevatorFixTimer: new Timer(5000),
    toiletManager,
    toiletFixTimer: new Timer(3000),
    lampManager,
    lampFixTimer: new Timer(2000),
  };
}

const hkIdle: State<HouseKeeperContext> =
  new State(
    {
      stateFn: async (context) => {
        if (
          !context.elevatorManager.isBroken()
          && !context.toiletManager.isBroken()
          && !context.lampManager.isBroken()
        ) {
          console.log('Everything fine. I\'m on standby...');
          await sleep(1000);
        }
      },
      postStateFn: async () => {
        console.log('Something went wrong...');
      }
    }
  );

const hkShouldFixElevatorStart: Transition<HouseKeeperContext> =
  new Transition(
    {
      conditionFn: (context) => {
        return context.elevatorManager.isBroken();
      },
      transitionFn: () => {
        console.log('Elevator in trouble! Start to fix it.');
      },
    }
  );

const hkFixElevator: State<HouseKeeperContext> =
  new State(
    {
      preStateFn: async (context) => {
        context.elevatorFixTimer.init();
      },
      stateFn: async (context) => {
        if (!context.elevatorFixTimer.elapsed()) {
          console.log(
            'It is something hard to do to fix an elevator. ' +
            `I need ${Math.round(context.elevatorFixTimer.remains() / 100) / 10} more seconds...`
          );
          await sleep(Math.min(1000, context.elevatorFixTimer.remains()));
        }
      }
    }
  );

const hkIsFixElevatorDone: Transition<HouseKeeperContext> =
  new Transition(
    {
      conditionFn: (context) => {
        return context.elevatorFixTimer.elapsed();
      },
      transitionFn: (context) => {
        context.elevatorManager.fix();
      },
    }
  );

const hkWaitElevatorRecover: State<HouseKeeperContext> =
  new State(
    {
      stateFn: async (context) => {
        if (!context.elevatorManager.isInOperation()) {
          await sleep(250);
        }
      }
    }
  );

const hkIsWaitElevatorRecoverDone: Transition<HouseKeeperContext> =
  new Transition(
    {
      conditionFn: (context) => {
        return context.elevatorManager.isInOperation();
      },
      transitionFn: () => {
        console.log('Fix elevator done!');
      },
    }
  );

link(hkIdle, hkFixElevator, hkShouldFixElevatorStart);
link(hkFixElevator, hkWaitElevatorRecover, hkIsFixElevatorDone);
link(hkWaitElevatorRecover, hkIdle, hkIsWaitElevatorRecoverDone);

const hkShouldFixToiletStart: Transition<HouseKeeperContext> =
  new Transition(
    {
      conditionFn: (context) => {
        return context.toiletManager.isBroken();
      },
      transitionFn: () => {
        console.log('Toilet in trouble! Start to fix it.');
      },
    }
  );

const hkFixToilet: State<HouseKeeperContext> =
  new State(
    {
      preStateFn: async (context) => {
        context.toiletFixTimer.init();
      },
      stateFn: async (context) => {
        if (!context.toiletFixTimer.elapsed()) {
          console.log(
            'Uhh... I hate this job. ' +
            `I need ${Math.round(context.toiletFixTimer.remains() / 100) / 10} more seconds...`
          );
          await sleep(Math.min(1000, context.toiletFixTimer.remains()));
        }
      },
    }
  );

const hkIsFixToiletDone: Transition<HouseKeeperContext> =
  new Transition(
    {
      conditionFn: (context) => {
        return context.toiletFixTimer.elapsed();
      },
      transitionFn: (context) => {
        context.toiletManager.fix();
      }
    }
  );

const hkWaitToiletRecover: State<HouseKeeperContext> =
  new State(
    {
      stateFn: async (context) => {
        if (!context.toiletManager.isInOperation()) {
          await sleep(250);
        }
      }
    }
  );

const hkIsWaitToiletRecoverDone: Transition<HouseKeeperContext> =
  new Transition(
    {
      conditionFn: (context) => {
        return context.toiletManager.isInOperation();
      },
      transitionFn: () => {
        console.log('Fix toilet done!');
      },
    }
  );

link(hkIdle, hkFixToilet, hkShouldFixToiletStart);
link(hkFixToilet, hkWaitToiletRecover, hkIsFixToiletDone);
link(hkWaitToiletRecover, hkIdle, hkIsWaitToiletRecoverDone);

const hkShouldFixToiletBreak: Transition<HouseKeeperContext> =
  new Transition(
    {
      conditionFn: (context) => {
        return context.elevatorManager.isBroken();
      },
      transitionFn: () => {
        console.log('Elevator in trouble! Suspend fixing toilet.');
      },
    }
  );

link(hkFixToilet, hkIdle, hkShouldFixToiletBreak);

const hkShouldFixLampStart: Transition<HouseKeeperContext>= 
  new Transition(
    {
      conditionFn: (context) => {
        return context.lampManager.isBroken();
      },
      transitionFn: () => {
        console.log('Lamp in trouble! Start to fix it.');
      },
    }
  );

const hkFixLamp: State<HouseKeeperContext> =
  new State(
    {
      preStateFn: async (context) => {
        context.lampFixTimer.init();
      },
      stateFn: async (context) => {
        if (!context.lampFixTimer.elapsed()) {
          console.log(
            'Fixing the lamp. ' +
            `I need ${Math.round(context.lampFixTimer.remains() / 100) / 10} more seconds...`
          );
          await sleep(Math.min(1000, context.lampFixTimer.remains()));
        }
      },
    }
  );

const hkIsFixLampDone: Transition<HouseKeeperContext> =
  new Transition(
    {
      conditionFn: (context) => {
        return context.lampFixTimer.elapsed();
      },
      transitionFn: (context) => {
        context.lampManager.fix();
      }
    }
  );

const hkWaitLampRecover: State<HouseKeeperContext> =
  new State(
    {
      stateFn: async (context) => {
        if (!context.lampManager.isInOperation()) {
          await sleep(250);
        }
      }
    }
  );

const hkIsWaitLampRecoverDone: Transition<HouseKeeperContext> =
  new Transition(
    {
      conditionFn: (context) => {
        return context.lampManager.isInOperation();
      },
      transitionFn: () => {
        console.log('Fix lamp done!');
      },
    }
  );

link(hkIdle, hkFixLamp, hkShouldFixLampStart);
link(hkFixLamp, hkWaitLampRecover, hkIsFixLampDone);
link(hkWaitLampRecover, hkIdle, hkIsWaitLampRecoverDone);

const hkShouldFixLampBreak: Transition<HouseKeeperContext> =
  new Transition(
    {
      conditionFn: (context) => {
        return (
          context.elevatorManager.isBroken()
          || context.toiletManager.isBroken()
        );
      },
      transitionFn: () => {
        console.log('Elevator or toilet in trouble! Suspend fixing lamp.');
      }
    }
  );

link(hkFixLamp, hkIdle, hkShouldFixLampBreak);


const elevatorManager = new DeviceManager(0.05);
const toiletManager = new DeviceManager(0.1);
const lampManager = new DeviceManager(0.3);
const houseKeeperManager = new Manager(
  () => createHouseKeeperContext(elevatorManager, toiletManager, lampManager),
  hkIdle,
);

void elevatorManager.run();
void toiletManager.run();
void lampManager.run();
void houseKeeperManager.run();
