export class AlreadyExistsError extends Error {
    private _resourceName: string;
    public get resourceName(): string {
        return this._resourceName;
    }

    constructor(resourceName: string) {
        super(`${resourceName} already exists.`);
        this._resourceName = resourceName;
    }
}
