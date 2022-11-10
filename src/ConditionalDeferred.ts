export class ConditionalDeferred<T> {
    constructor(canResolve: (buffer:Buffer) => boolean) {
        this.autoResolve = Date.now();
        this.canResolve = canResolve;
        this.promise = new Promise((resolve,reject) => {
            this.reject = reject;
            this.resolve = resolve;
        });
    }

    promise: Promise<T>;
    autoResolve: number;
    canResolve: (buffer:Buffer) => boolean;
    resolve: ((value: T | PromiseLike<T>) => void) | null = null;
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    reject: ((reason?: any) => void) | null = null;
}