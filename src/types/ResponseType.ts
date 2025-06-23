export default interface ResponseType<T = null> {
    success: boolean;
    message?: string;
    data: T;
}