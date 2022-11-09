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
