import 'mocha';
import chai from 'chai';
import PasswordHasher from './passwordHasher';

let assert = chai.assert;

describe('BcryptPasswordHasher hash test', () => {
    const passwordHasher = new PasswordHasher();
    const password = "pwd12345";
    const password2 = "asdfgjkl";

    it('should return a hash that is different from plaintext password', () => {
        assert.notEqual(passwordHasher.hash(password), password);
    });

    it('should verify that a hash against a plaintext password', () => {
        const hash = passwordHasher.hash(password);
        assert.isTrue(passwordHasher.verifyHash(password, hash));

        const anotherHash = passwordHasher.hash(password2);
        assert.isNotTrue(passwordHasher.verifyHash(password, anotherHash));
    })
});
