const { ApolloServer, gql } = require("apollo-server");
const lodash = require("lodash");
const uuid = require("uuid");
const axios = require("axios");
const redis = require("redis");
const client = redis.createClient();

const accessKey = "iRmL63wsT_UInWAenD0vRK6D2cCcEGCeiUI_PDBU8sI";
const secretKey = "gcx48WCIkRc9Co5t341eWtZCA5Jv-CASl9RVZ_aqz7E";

const typeDefs = gql`
    type Query {
        unsplashImages(pageNum: Int): [ImagePost]
        binnedImages: [ImagePost]
        userPostedImages: [ImagePost]
    }

    type ImagePost {
        id: ID!
        url: String!
        description: String!
        posterName: String!
        userPosted: Boolean!
        binned: Boolean!
    }

    type Mutation {
        uploadImage(
            url: String!
            description: String
            posterName: String
        ): ImagePost
        updateImage(
            id: ID!
            url: String
            description: String
            posterName: String
            userPosted: Boolean
            binned: Boolean
        ): ImagePost
        deleteImage(id: ID!): ImagePost
    }
`;

const resolvers = {
    Query: {
        unsplashImages: async (_, args) => {
            const { pageNum } = args;
            const unsplashImages = await axios.get(
                `https://api.unsplash.com/photos/?client_id=${accessKey}&page=${pageNum}`
            );
            return unsplashImages.data.map((image) => {
                return {
                    id: image.id,
                    url: image.urls.full,
                    description: image.description,
                    posterName: image.user.name,
                    userPosted: false,
                    binned: false,
                };
            });
        },
        binnedImages: async () => {
            let binned = await client.get("binnedImages");
            if (!binned) {
                binned = [];
            }
            return binned;
        },
        userPostedImages: async () => {
            let userPosted = await client.get("userPostedImages");
            if (!userPosted) {
                userPosted = [];
            }
            return userPosted;
        },
    },

    Mutation: {
        uploadImage: async (_, args) => {
            const { url, description, posterName } = args;
            const image = {
                id: uuid.v4(),
                url: url,
                description: description ? description : "",
                posterName: posterName ? posterName : "",
                userPosted: true,
                binned: false,
            };
            let userPosted = await client.get("userPostedImages");
            if (!userPosted) {
                userPosted = [];
            }
            userPosted.push(image);
            client.set("userPostedImages", userPosted);
            return image;
        },

        updateImage: async (_, args) => {
            const { id, url, description, posterName, userPosted, binned } =
                args;
            // If this image was not previously in the cache, and the user bins it, then add it to the cache using data from React state.
            // If an image post that came from Unsplash and was unbinned (binned set to false), you should also remove it from the cache
            let binnedImages = await client.get("binnedImages");
            if (!binnedImages) {
                binnedImages = [];
            }
            let userPostedImages = await client.get("userPostedImages");
            if (!userPostedImages) {
                userPostedImages = [];
            }
            let image = lodash.find(binnedImages, { id: id });
            if (image && !binned) {
                lodash.remove(binnedImages, { id: id });
                client.set("binnedImages", binnedImages);
            }
            //TODO: bin cache confusion, ask TA
        },
    },
};
