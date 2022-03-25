export class ConditionalDeferred<T> {
    constructor(canResolve: (buffer:Buffer) => boolean) {
        this.canResolve = canResolve;
        this.promise = new Promise((resolve,reject) => {
            this.reject = reject;
            this.resolve = resolve;
        });
    }

    promise: Promise<T>;
    canResolve: (buffer:Buffer) => boolean;
    resolve: ((value: T | PromiseLike<T>) => void) | null = null;
    reject: ((reason?: any) => void) | null = null;
}