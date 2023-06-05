export class InsufficientPermissionError extends Error {
    constructor() {
        super('Insufficient permission');
    }
}
