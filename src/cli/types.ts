export type CanBeUndefined<T> = T | undefined;
export type CanBeNull<T> = T | null;
export type Nullable<T> = CanBeNull<T> | CanBeUndefined<T>;