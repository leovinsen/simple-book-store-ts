import { Database } from "better-sqlite3";
import User from "../model/user";
import { Inject, Service } from "typedi";
import diConfig from "../config/di";

@Service()
export default class UserRepository {
    private db: Database;

    constructor(
        @Inject(diConfig.database)
        db: Database
    ) {
        this.db = db;
    }

    /**
     * Finds a user in database by using their email as filter condition.
     * 
     * @param email email of the user
     * @returns the User or a `null` if no record was found
     */
    public async findUserByEmail(email: string): Promise<User | null> {
        const query = "SELECT id, email, password, created_at FROM users WHERE email = ? LIMIT 1";
        const row = this.db.prepare(query).get(email);
        if (row == undefined) {
            return null;
        }

        const castRow = row as { [key: string]: any };
        return new User(
            castRow.id,
            castRow.email,
            castRow.password,
            new Date(castRow.created_at)
        )
    }

    /**
     * Finds a user in database by using their ID as filter condition.
     * 
     * @param id ID of the user
     * @returns the User or a `null` if no record was found
     */
    public async findUserByID(id: number): Promise<User | null> {
        const query = "SELECT id, email, password, created_at FROM users WHERE id = ? LIMIT 1";
        const row = this.db.prepare(query).get(id);
        if (row == undefined) {
            return null;
        }

        const castRow = row as { [key: string]: any };
        return new User(
            castRow.id,
            castRow.email,
            castRow.password,
            new Date(castRow.created_at)
        )
    }

    /**
     * Inserts a new row into table `users`.
     * 
     * @param email email of the User. This value must be unique.
     * @param password password of the User. Make sure to hash before inserting.
     * @returns the inserted User record
     */
    public async createUser(email: string, password: string): Promise<User> {
        try {
            const stmt = this.db.prepare("INSERT INTO users (email, password) VALUES (?, ?)");
            stmt.run(email, password);
        } catch (e) {
            throw new Error(`Failed to insert user, e: ${e}`)
        }

        return await this.findUserByEmail(email) as User;
    }
}
