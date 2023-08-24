export type TimeoutId = ReturnType<typeof setTimeout>;
type ImmutablePrimitive = undefined | null | boolean | string | number | Function;
export type Immutable<T> = T extends ImmutablePrimitive ? T : T extends Array<infer U> ? ImmutableArray<U> : T extends Map<infer K, infer V> ? ImmutableMap<K, V> : T extends Set<infer M> ? ImmutableSet<M> : ImmutableObject<T>;
export type ImmutableArray<T> = ReadonlyArray<Immutable<T>>;
export type ImmutableMap<K, V> = ReadonlyMap<Immutable<K>, Immutable<V>>;
export type ImmutableSet<T> = ReadonlySet<Immutable<T>>;
export type ImmutableObject<T> = {
    readonly [K in keyof T]: Immutable<T[K]>;
};
export declare function asImmutable<T>(v: T): Immutable<T>;
export declare function assertExtends<_A extends B, B>(): void;
export declare function assertBothExtends<_A extends B, B extends C, C>(): void;
export type Constructor<T extends new (...args: any) => any> = T extends new (...args: infer A) => infer R ? new (...args: A) => R : never;
export type ConstructorParameters<T extends new (...args: any) => any> = T extends new (...args: infer A) => any ? A : never;
export {};
