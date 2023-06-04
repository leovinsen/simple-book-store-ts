import { FieldIsInvalidError, FieldIsRequiredError } from "../error/validationError";
import { Validator } from "./validator";

export const validateEmail: Validator<string> = (email?: string | undefined): Error | null => {
    const fieldName = "Email";

    if (email == null || email == undefined || email === "") {
        return new FieldIsRequiredError(fieldName);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return new FieldIsInvalidError(fieldName);
    }

    return null
}
