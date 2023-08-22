export declare class Timer {
    private _from;
    private _duration;
    constructor(duration: number);
    init(): void;
    elapsed(): boolean;
    remains(): number;
}
