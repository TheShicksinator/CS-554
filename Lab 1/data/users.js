const bcrypt = require("bcrypt");
const saltRounds = 16;
const { ObjectId } = require("mongodb");
const mongoCollections = require("./mongoCollections");
const users = mongoCollections.users;
const { checkString, checkLogin, checkId } = require("./validation");

const authenticate = async (username, password) => {
    username = checkString(username, "username");
    password = checkString(password, "password");
    checkLogin(username, password);
    const userCollection = await users();
    const dbUser = await userCollection.findOne({
        username: username,
    });
    if (!dbUser) {
        throw "Invalid username or password: authenticate";
    }
    const password_verify = bcrypt.compare(password, dbUser.password);
    if (!password_verify) {
        throw "Invalid username or password: authenticate";
    }
    return { userId: dbUser._id.toString(), authenticated: true };
};

const getUserById = async (id) => {
    id = checkId(id);
    const userCollection = await users();
    const dbUser = await userCollection.findOne({
        _id: ObjectId(id),
    });
    if (!dbUser) {
        throw "User not found";
    }
    return dbUser;
};

const createUser = async (name, username, password) => {
    if (!name) throw "name not provided";
    if (typeof name !== "string") throw "name must be a string";
    if (name.trim().length === 0) throw "name cannot be empty";
    username = checkString(username, "username");
    password = checkString(password, "password");
    checkLogin(username, password);

    const userCollection = await users();
    const takenUsername = await userCollection.findOne({ username: username });
    if (takenUsername) throw "username already in use";
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = {
        name: name,
        username: username,
        password: hashedPassword,
    };
    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw "Could not create user";
    }
    return { userId: insertInfo.insertedId.toString(), userCreated: true };
};

module.exports = {};
