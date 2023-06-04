export default class User {
    private _id: number;
    private _email: string;
    private _password: string;
    private _createdAt: Date;

    constructor(
        id: number,
        email: string,
        password: string,
        createdAt: Date,
    ) {
        this._id = id;
        this._email = email;
        this._password = password;
        this._createdAt = createdAt;
    }

    get id(): number {
        return this._id;
    }

    get email(): string {
        return this._email;
    }

    get password(): string {
        return this._password;
    }

    get createdAt(): Date {
        return this._createdAt;
    }
}
