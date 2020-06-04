import {connect,clearDatabase, closeDatabase} from './db-handler'

import {User} from '../src/models'

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe('User ', () => {

    var user = {
        email: "puyaars@gmail.com"
    }

    it('can be created correctly', async () => {
        expect(async () => await User.create(user))
            .not
            .toThrow();
    });

    
    it('can find by email correctly', async () => {
        expect(async () => await User.find(user))
            .not
            .toThrow();
    });


})

