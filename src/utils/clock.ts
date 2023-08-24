import {
  TimeoutId,
} from '../type';

export const ClockStatus = {
  Reached: 'reached',
  Canceled: 'canceled',
  Idle: 'idle',
} as const;

export type ClockStatus = typeof ClockStatus[keyof typeof ClockStatus]

interface ClockJob {
  timeoutId: TimeoutId
  promise: Promise<ClockStatus>
  resolve: (value: ClockStatus) => void
}

export class Clock {
  private _duration: number;
  private _clockJob: ClockJob | undefined;

  constructor(duration: number) {
    this._duration = duration;
    this._clockJob = undefined;
  }

  init() {
    this.cancel();

    let resolve = (_: ClockStatus) => { };
    const promise = new Promise<ClockStatus>((res, _) => { resolve = res; });
    const timeoutId = setTimeout(
      () => {
        if (this._clockJob) {
          this._clockJob.resolve(ClockStatus.Reached);
          this._clockJob = undefined;
        }
      },
      this._duration,
    );

    this._clockJob = {
      timeoutId,
      promise,
      resolve,
    };
  }

  cancel() {
    if (this._clockJob) {
      clearTimeout(this._clockJob.timeoutId);
      this._clockJob.resolve(ClockStatus.Canceled);
      this._clockJob = undefined;
    }
  }

  wait() {
    if (this._clockJob) {
      return this._clockJob.promise;
    }
    else {
      return Promise.resolve(ClockStatus.Idle);
    }
  }

  isWaiting() {
    return this._clockJob !== undefined;
  }
}
