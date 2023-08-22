import * as O from 'fp-ts/Option';

type TimeoutId = ReturnType<typeof setTimeout>

const ClockStatus = {
  Reached: 'reached',
  Canceled: 'canceled',
  Idle: 'idle',
} as const;

type ClockStatus = typeof ClockStatus[keyof typeof ClockStatus]

interface ClockJob {
  timeoutId: TimeoutId
  promise: Promise<ClockStatus>
  resolve: (value: ClockStatus) => void
}

export class Clock {
  private _duration: number;
  private _clockJob: O.Option<ClockJob>;

  constructor(duration: number) {
    this._duration = duration;
    this._clockJob = O.none;
  }

  init() {
    this.cancel();

    let resolve = (_: ClockStatus) => { };
    const promise = new Promise<ClockStatus>((res, _) => { resolve = res; });
    const timeoutId = setTimeout(
      () => {
        if (O.isSome(this._clockJob)) {
          this._clockJob.value.resolve(ClockStatus.Reached);
          this._clockJob = O.none;
        }
      },
      this._duration,
    );

    this._clockJob = O.some(
      {
        timeoutId,
        promise,
        resolve,
      }
    );
  }

  cancel() {
    if (O.isSome(this._clockJob)) {
      clearTimeout(this._clockJob.value.timeoutId);
      this._clockJob.value.resolve(ClockStatus.Canceled);
      this._clockJob = O.none;
    }
  }

  wait() {
    if (O.isSome(this._clockJob)) {
      return this._clockJob.value.promise;
    }
    else {
      return Promise.resolve(ClockStatus.Idle);
    }
  }
}
