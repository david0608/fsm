declare const ClockStatus: {
    readonly Reached: "reached";
    readonly Canceled: "canceled";
    readonly Idle: "idle";
};
type ClockStatus = typeof ClockStatus[keyof typeof ClockStatus];
export declare class Clock {
    private _duration;
    private _clockJob;
    constructor(duration: number);
    init(): void;
    cancel(): void;
    wait(): Promise<ClockStatus>;
}
export {};
