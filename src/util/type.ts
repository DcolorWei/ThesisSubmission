export type Params<T>={
    [K in keyof T]: K extends string?T[K]:never
}