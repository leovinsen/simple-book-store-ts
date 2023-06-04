export class CustomError extends Error {
    private httpStatusCode: number;

    constructor(
        httpStatusCode: number,
        message: string,
    ) {
        super(message);

        this.name = this.constructor.name;
        this.httpStatusCode = httpStatusCode;
    }

    get HttpStatusCode() {
        return this.httpStatusCode;
    }

    get JSON() {
        return {
            errorMessage: this.message,
            stack: this.stack,
        };
    }
}
