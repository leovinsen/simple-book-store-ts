export class MissingBearerTokenError extends Error {
    constructor() {
        super('Missing bearer token from request header');
    }
}
