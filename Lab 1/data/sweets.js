const mongoCollections = require("./mongoCollections");
const sweets = mongoCollections.sweets;
const { ObjectId } = require("mongodb");
const { checkString, checkId } = require("./validation");
const validSweetMoods = [
    "Happy",
    "Sad",
    "Angry",
    "Excited",
    "Surprised",
    "Loved",
    "Blessed",
    "Greatful",
    "Blissful",
    "Silly",
    "Chill",
    "Motivated",
    "Emotional",
    "Annoyed",
    "Lucky",
    "Determined",
    "Bored",
    "Hungry",
    "Disappointed",
    "Worried",
];

const getSweetById = async (id) => {
    id = checkId(id);
    const sweetCollection = await sweets();
    const sweet = await sweetCollection.findOne({ _id: ObjectId(id) });
    if (!sweet) throw "sweet not found"; //as
    return sweet;
};

const getFiftySweets = async (setNumber) => {};

const createSweet = async (sweetText, sweetMood, userThatPosted) => {
    sweetText = checkString(sweetText, "sweetText");
    sweetMood = checkString(sweetMood, "sweetMood");
    if (!validSweetMoods.includes(sweetMood))
        throw (
            "Invalid sweet mood. Valid moods are: " + validSweetMoods.join(", ")
        );
    const sweetCollection = await sweets();
    const newSweet = {
        sweetText: sweetText,
        sweetMood: sweetMood,
        userThatPosted: userThatPosted,
        replies: [],
        likes: [],
    };
    const insertInfo = await sweetCollection.insertOne(newSweet);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw "Could not add sweet";
    const newId = insertInfo.insertedId;
    const sweet = await getSweetById(newId);
    return sweet;
};

const updateSweet = async (id, sweetText, sweetMood) => {
    id = checkId(id);
    sweetText = checkString(sweetText, "sweetText");
    sweetMood = checkString(sweetMood, "sweetMood");
    if (!validSweetMoods.includes(sweetMood))
        throw (
            "Invalid sweet mood. Valid moods are: " + validSweetMoods.join(", ")
        );
    const sweetCollection = await sweets();
    const updatedInfo = await sweetCollection.updateOne(
        { _id: ObjectId(id) },
        { $set: { sweetText: sweetText, sweetMood: sweetMood } }
    );
    if (!updatedInfo.acknowledged || !updatedInfo.modifiedCount)
        throw "Could not update sweet";
    const updatedSweet = await getSweetById(id);
    return updatedSweet;
};

const likeSweetToggle = async (id, userThatLikedId) => {
    id = checkId(id);
    userThatLikedId = checkId(userThatLikedId);
    const sweetCollection = await sweets();
    const sweet = await getSweetById(id);
    const updatedInfo = await sweetCollection.updateOne(
        { _id: ObjectId(id) },
        sweet.likes.includes(userThatLikedId)
            ? { $pull: { likes: userThatLikedId } }
            : { $push: { likes: userThatLikedId } }
    );
    if (!updatedInfo.acknowledged || !updatedInfo.modifiedCount)
        throw "Could not update sweet";
    const updatedSweet = await getSweetById(id);
    return updatedSweet;
};

const replyToSweet = async (id, userThatReplied, replyText) => {
    id = checkId(id);
    replyText = checkString(replyText, "replyText");
    const sweetCollection = await sweets();
    const newReply = {
        _id: ObjectId(),
        userThatPostedReply: userThatReplied,
        reply: replyText,
    };
    const updatedInfo = await sweetCollection.updateOne(
        { _id: ObjectId(id) }, //TODO: does this count as supplying the id?
        { $push: { replies: newReply } }
    );
    if (!updatedInfo.acknowledged || !updatedInfo.modifiedCount)
        throw "Could not update sweet";
    const updatedSweet = await getSweetById(id);
    return updatedSweet;
};

module.exports = {
    getSweetById,
    getFiftySweets,
    createSweet,
};
