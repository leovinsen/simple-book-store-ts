export class NotFoundError extends Error {
    private _resourceName: string;

    constructor(resourceName: string) {
        super(`The requested ${resourceName} is not found.`);
        this._resourceName = resourceName;
        this.name = this.constructor.name;
    }

    public get resourceName(): string {
        return this._resourceName;
    }
}
