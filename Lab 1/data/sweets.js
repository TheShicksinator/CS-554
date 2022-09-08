const mongoCollections = require("../config/mongoCollections");
const sweets = mongoCollections.sweets;
const { ObjectId } = require("mongodb");
const { checkString, checkId } = require("./validation");
const validSweetMoods = [
    "happy",
    "sad",
    "angry",
    "excited",
    "surprised",
    "loved",
    "blessed",
    "grateful",
    "blissful",
    "silly",
    "chill",
    "motivated",
    "emotional",
    "annoyed",
    "lucky",
    "determined",
    "bored",
    "hungry",
    "disappointed",
    "worried",
];

const getSweetById = async (id) => {
    id = checkId(id);
    const sweetCollection = await sweets();
    const sweet = await sweetCollection.findOne({ _id: ObjectId(id) });
    if (!sweet) throw "sweet not found";
    return sweet;
};

const getFiftySweets = async (setNumber = 1) => {
    if (typeof setNumber !== "number" || setNumber < 1)
        throw "setNumber must be a positive number";
    const sweetCollection = await sweets();
    const sweetList = await sweetCollection
        .find({})
        .skip((setNumber - 1) * 50)
        .limit(50)
        .toArray();
    if (sweetList.length === 0) throw "No sweets found";
    return sweetList;
};

const createSweet = async (sweetText, sweetMood, userThatPosted) => {
    sweetText = checkString(sweetText, "sweetText");
    sweetMood = checkString(sweetMood, "sweetMood");
    sweetMood = sweetMood.toLowerCase();
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

const updateSweet = async (id, updatedObject) => {
    id = checkId(id);
    let updatedPostData = {};
    if (updatedObject.sweetText)
        updatedPostData.sweetText = checkString(
            updatedObject.sweetText,
            "sweetText"
        );
    if (updatedObject.sweetMood)
        updatedPostData.sweetMood = checkString(
            updatedObject.sweetMood,
            "sweetMood"
        );
    const sweetCollection = await sweets();
    const updatedInfo = await sweetCollection.updateOne(
        { _id: ObjectId(id) },
        { $set: updatedPostData }
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
    const sweet = sweetCollection.findOne({ _id: ObjectId(id) });
    if (!sweet) throw "sweet not found";
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
        { _id: ObjectId(id) },
        { $push: { replies: newReply } }
    );
    if (!updatedInfo.acknowledged || !updatedInfo.modifiedCount)
        throw "Could not update sweet";
    const updatedSweet = await getSweetById(id);
    return updatedSweet;
};

const deleteSweetReply = async (sweetId, replyId) => {
    sweetId = checkId(sweetId);
    replyId = checkId(replyId);
    const sweetCollection = await sweets();
    const updatedInfo = await sweetCollection.updateOne(
        { _id: ObjectId(sweetId) },
        { $pull: { replies: { _id: ObjectId(replyId) } } }
    );
    if (!updatedInfo.acknowledged || !updatedInfo.modifiedCount)
        throw "Could not update sweet";
    const updatedSweet = await getSweetById(sweetId);
    return updatedSweet;
};

module.exports = {
    getSweetById,
    getFiftySweets,
    createSweet,
    replyToSweet,
    likeSweetToggle,
    updateSweet,
    deleteSweetReply,
};
