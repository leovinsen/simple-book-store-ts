export abstract class ValidationError extends Error {
    private _fieldName: string;

    constructor(fieldName: string) {
        super();
        this._fieldName = fieldName
    }

    public get fieldName(): string {
        return this._fieldName;
    }
}

export class FieldIsRequiredError extends ValidationError {
    constructor(fieldName: string) {
        super(fieldName);
        this.name = this.constructor.name;
        this.message = `${fieldName} is required.`;
    }
}

export class FieldIsInvalidError extends ValidationError {
    constructor(fieldName: string) {
        super(fieldName);
        this.name = this.constructor.name;
        this.message = `${fieldName} is invalid.`;
    }
}
