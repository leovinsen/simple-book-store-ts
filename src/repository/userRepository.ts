import { Database } from "sqlite3";
import User from "../model/user";
import { Service } from "typedi";

@Service()
export default class UserRepository {
    private db: Database;

    constructor(
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
        return new Promise<User | null>((resolve, reject) => {
            const statement = this.db.prepare("SELECT id, email, password, created_at FROM users WHERE email = ?");
            statement.get<User>([email], (err, row) => {
                statement.finalize();
                if (err) {
                    reject(err)
                }

                if (row == undefined) {
                    resolve(null)
                } else {
                    resolve(row)
                }
            })
        });
    }

    /**
     * Finds a user in database by using their ID as filter condition.
     * 
     * @param id ID of the user
     * @returns the User or a `null` if no record was found
     */
    public async findUserByID(id: number): Promise<User | null> {
        return new Promise<User | null>((resolve, reject) => {
            const statement = this.db.prepare("SELECT id, email, password, created_at FROM users WHERE id = ?");
            statement.get<User>([id], (err, row) => {
                statement.finalize();
                if (err) {
                    reject(err)
                }

                if (row == undefined) {
                    resolve(null)
                } else {
                    resolve(row)
                }
            })
        });
    }

    /**
     * Inserts a new row into table `users`.
     * 
     * @param email email of the User. This value must be unique.
     * @param password password of the User. Make sure to hash before inserting.
     * @returns the inserted User record
     */
    public async createUser(email: string, password: string): Promise<User> {
        const stmt = this.db.prepare("INSERT INTO users (email, password) VALUES (?, ?)");
        stmt.run(email, password);
        stmt.finalize();

        return await this.findUserByEmail(email) as User;
    }
}
