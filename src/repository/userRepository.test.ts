import 'mocha';
import chai from 'chai';
import { Teardown, createTestDB } from '../database';
import { Database } from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';
import UserRepository from './userRepository';

let assert = chai.assert;

describe('UserRepository', () => {
    let db: Database;
    let teardown: Teardown;

    let userRepository: UserRepository;

    before(async () => {
        const database = await createTestDB(uuidv4());
        db = database.db;
        teardown = database.teardown;

        userRepository = new UserRepository(db);
    });

    after(() => {
        teardown();
    });

    describe('createUser', () => {
        it('should insert a new record into table user successfully', async () => {
            const email = "john.doe@mail.com";
            const password = "asdfghijkl"
            await userRepository.createUser(email, password);

            const user = await userRepository.findUserByEmail(email);
            assert.isNotNull(user);
            assert.equal(email, user!.email);
            assert.equal(password, user!.password);
        });
    });

    describe('findUserByEmail', () => {
        it('should find an existing user', async () => {
            const email = "jane.simmons@mail.com";
            const password = "password"
            await userRepository.createUser(email, password);

            const user = await userRepository.findUserByEmail(email);
            assert.isNotNull(user);
            assert.equal(email, user!.email);
            assert.equal(password, user!.password);
        });

        it('should return null if user is not found', async () => {
            const user = await userRepository.findUserByEmail("some.email@mail.com");
            assert.isNull(user);
        });
    })

    describe('findUserByID', () => {
        it('should find an existing user', async () => {
            const email = "jack.philips@mail.com";
            const password = "password"
            const createdUser = await userRepository.createUser(email, password);

            const user = await userRepository.findUserByID(createdUser.id);
            assert.isNotNull(user);
            assert.equal(createdUser.id, user!.id);
            assert.equal(createdUser.createdAt, user!.createdAt);
            assert.equal(email, user!.email);
            assert.equal(password, user!.password);
        });

        it('should return null if user is not found', async () => {
            const user = await userRepository.findUserByEmail("some.email@mail.com");
            assert.isNull(user);
        });
    })
});
