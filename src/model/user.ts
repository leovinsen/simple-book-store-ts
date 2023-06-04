export default class User {
    readonly id: number;
    readonly email: string;
    readonly password: string;
    readonly createdAt: Date;

    constructor(
        id: number,
        email: string,
        password: string,
        createdAt: Date,
    ) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
    }

}
