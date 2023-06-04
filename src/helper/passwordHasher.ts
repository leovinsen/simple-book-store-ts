import bcrypt from 'bcrypt';
import { Service } from 'typedi';

// A class responsible for performing a one way hash on a plaintext password
// and for verifying a plaintext password against a hash.
//
// Uses bcrypt algorithm for hashing.
@Service()
export default class PasswordHasher {
    private _saltRounds = 10;

    /**
     * Performs a one way hash on a plaintext password.
     * 
     * @param password - plaintext passowrd
     */
    hash(password: string): string {
        return bcrypt.hashSync(password, this._saltRounds);
    }

    /**
     * Returns true if hashedPassword is indeed a hashed version of password.
     * Otherwise returns false.
     * 
     * @param password - plaintext password
     * @param hashedPassword - hashed psasword
     */
    verifyHash(password: string, hashedPassword: string): boolean {
        return bcrypt.compareSync(password, hashedPassword)
    }
}
