import bcrypt from 'bcrypt';

// A class responsible for performing a one way hash on a plaintext password
// and for verifying a plaintext password against a hash.
export interface PasswordHasher {
    /**
     * Performs a one way hash on a plaintext password.
     * 
     * @param password - plaintext passowrd
     */
    hash(password: string): string;

    /**
     * Returns true if hashedPassword is indeed a hashed version of password.
     * Otherwise returns false.
     * 
     * @param password - plaintext password
     * @param hashedPassword - hashed psasword
     */
    verifyHash(password: string, hashedPassword: string): boolean;
}

// A PasswordHasher that uses bcrypt algorithm for hashing.
export class BcryptPasswordHasher implements PasswordHasher {
    private _saltRounds = 10;

    hash(password: string): string {
        return bcrypt.hashSync(password, this._saltRounds);
    }

    verifyHash(password: string, hashedPassword: string): boolean {
        return bcrypt.compareSync(password, hashedPassword)
    }
}
