const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

class UserService {
    constructor(client) {
        this.User = client.db().collection("users");
    }

    // Define database extraction methods using mongodb API
    extractUserData(payload) {
        const user = {
            name: payload.name,
            email: payload.email,
            password: payload.password,
            address: payload.address,
            phone: payload.phone,
        };

        // Remove undefined fields
        Object.keys(user).forEach(
            (key) => user[key] == undefined && delete user[key]
        );
        return user;
    }

    async signin(payload) {
        const { email } = payload;
        return await this.User.findOne({
            email: email
        });
    }

    async findByEmail(email) {
        return await this.User.findOne({
            email: email,
        });
    }

    async signup(payload) {
        const user = this.extractUserData(payload);
        const hashPassword = bcrypt.hashSync(user?.password, 10);
        const result = await this.User.insertOne({
            ...user,
            password: hashPassword
        });
        return result.value;
    }
}

module.exports = UserService;