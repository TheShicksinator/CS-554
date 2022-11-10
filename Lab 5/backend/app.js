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
        description: String
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
            let binned = JSON.parse(await client.get("binnedImages"));
            if (!binned) {
                binned = [];
            }
            console.log(binned);
            return binned;
        },
        userPostedImages: async () => {
            let userPosted = JSON.parse(await client.get("userPostedImages"));
            if (!userPosted) {
                userPosted = [];
            }
            console.log(userPosted);
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
            let userPosted = JSON.parse(await client.get("userPostedImages"));
            if (!userPosted) {
                userPosted = [];
            }
            userPosted.push(image);
            client.set("userPostedImages", JSON.stringify(userPosted));
            return image;
        },

        updateImage: async (_, args) => {
            const { id, url, description, posterName, userPosted, binned } =
                args;
            // If this image was not previously in the cache, and the user bins it, then add it to the cache using data from React state.
            // If an image post that came from Unsplash and was unbinned (binned set to false), you should also remove it from the cache
            let binnedImages = JSON.parse(await client.get("binnedImages"));
            if (!binnedImages) {
                binnedImages = [];
            }
            let imageIsBinned = !!binnedImages.find((image) => image.id === id);
            let userPostedImages = JSON.parse(
                await client.get("userPostedImages")
            );
            if (!userPostedImages) {
                userPostedImages = [];
            }
            let imageIsUserPosted = !!userPostedImages.find(
                (image) => image.id === id
            );
            let newImage = {
                id: id,
                url: url,
                description: description,
                posterName: posterName,
                userPosted: userPosted,
                binned: binned,
            };
            if (binned && !imageIsBinned) {
                binnedImages.push(newImage);
            }
            if (!binned && imageIsBinned) {
                binnedImages = binnedImages.filter((image) => image.id !== id);
            }
            if (userPosted && !imageIsUserPosted) {
                userPostedImages.push(newImage);
            }
            if (!userPosted && imageIsUserPosted) {
                userPostedImages = userPostedImages.filter(
                    (image) => image.id !== id
                );
            }
            client.set("binnedImages", JSON.stringify(binnedImages));
            client.set("userPostedImages", JSON.stringify(userPostedImages));
            return newImage;
        },
        deleteImage: async (_, args) => {
            const { id } = args;
            let userPostedImages = JSON.parse(
                await client.get("userPostedImages")
            );
            let binnedImages = JSON.parse(await client.get("binnedImages"));
            if (!userPostedImages) userPostedImages = [];

            if (!binnedImages) binnedImages = [];

            let imageToDelete = userPostedImages.find(
                (image) => image.id === id
            );
            if (!imageToDelete) {
                imageToDelete = binnedImages.find((image) => image.id === id);
            }
            if (!imageToDelete) {
                return null;
            }

            userPostedImages = userPostedImages.filter(
                (image) => image.id !== id
            );
            binnedImages = binnedImages.filter((image) => image.id !== id);
            client.set("userPostedImages", JSON.stringify(userPostedImages));
            client.set("binnedImages", JSON.stringify(binnedImages));
            return imageToDelete;
        },
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    cors: true,
    context: () => ({ client }),
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
