export class Timer {
  private _from: number;
  private _duration: number;

  constructor(duration: number) {
    this._from = Date.now();
    this._duration = duration;
  }

  init() {
    this._from = Date.now();
  }

  elapsed() {
    return (Date.now() - this._from) >= this._duration;
  }

  remains() {
    return this._duration - (Date.now() - this._from);
  }
}
