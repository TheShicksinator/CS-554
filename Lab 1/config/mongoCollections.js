const dbConnection = require("./mongoConnection");

const getCollectionFn = (collection) => {
    let _col = undefined;

    return async () => {
        if (!_col) {
            _col = await dbConnection.dbConnection().collection(collection);
        }
        return _col;
    };
};

module.exports = {
    users: getCollectionFn("users"),
    sweets: getCollectionFn("sweets"),
};
