import { CustomError } from "../error/customError";
import { FieldIsRequiredError } from "../error/validationError"
import { Validator } from "./validator";

export const validatePassword: Validator<string> = (password?: string | undefined): Error | null => {
    const fieldName = "Password";

    if (password == null || password == undefined || password === "") {
        return new FieldIsRequiredError(fieldName);
    }

    if (password.length < 8) {
        return new CustomError(400, "Password has to be at least 8 characters long.");
    }

    return null
}
