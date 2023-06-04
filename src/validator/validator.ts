export type Validator<T> = (data?: T | undefined) => Error | null;

export type OnError = (err: Error) => void;

export const validateFn = (...validators: Validator<any>[]): Error | null => {
    for (let i = 0; i < validators.length; i++) {
        const validator = validators[i];
        const err = validator();
        if (err != null) {
            return err;
        }
    }

    return null;
}
