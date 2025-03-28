export interface IResponse<T> {
    data: T | null;
    error: unknown | null;
}