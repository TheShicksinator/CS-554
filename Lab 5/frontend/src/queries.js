import { gql } from "@apollo/client";

const GET_UNSPLASH_PHOTOS = gql`
    query getUnsplashImages($pageNum: Int) {
        unsplashImages(pageNum: $pageNum) {
            id
            url
            description
            posterName
            userPosted
            binned
        }
    }
`;

const GET_BINNED_IMAGES = gql`
    query getBinnedImages {
        binnedImages {
            id
            url
            description
            posterName
            userPosted
            binned
        }
    }
`;

const BIN_IMAGE_CHANGE = gql`
    mutation binImageChange($id: ID!, $binned: Boolean!) {
        updateImage(id: $id, binned: $binned) {
            id
            url
            description
            posterName
            userPosted
            binned
        }
    }
`;

const GET_USER_POSTS = gql`
    query getUserPosts {
        userPostedImages {
            id
            url
            description
            posterName
            userPosted
            binned
        }
    }
`;

const DELETE = gql`
    mutation deleteImage($id: ID!) {
        deleteImage(id: $id) {
            id
        }
    }
`;

const UPLOAD = gql`
    mutation uploadImage(
        $url: String!
        $description: String
        $posterName: String
    ) {
        uploadImage(
            url: $url
            description: $description
            posterName: $posterName
        ) {
            id
            url
            description
        }
    }
`;

export default {
    GET_UNSPLASH_PHOTOS,
    GET_BINNED_IMAGES,
    BIN_IMAGE_CHANGE,
    GET_USER_POSTS,
    DELETE,
    UPLOAD,
};
