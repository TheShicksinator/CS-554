const { ObjectId } = require("mongodb");

module.exports = {
    checkId: (id) => {
        if (!id) throw "id is required";
        if (typeof id !== "string") throw "id must be a string";
        id = id.trim();
        if (id.length === 0) throw "id cannot be empty";
        if (!ObjectId.isValid(id)) throw "id is not valid";
        return id;
    },

    checkString: (strVal, varName) => {
        if (!strVal) throw `Error: You must supply a ${varName}!`;
        if (typeof strVal !== "string")
            throw `Error: ${varName} must be a string!`;
        strVal = strVal.trim();
        if (strVal.length === 0)
            throw `Error: ${varName} cannot be an empty string or string with just spaces`;
        if (!isNaN(strVal))
            throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
        return strVal;
    },
};
