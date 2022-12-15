import { createWebHistory, createRouter } from "vue-router";
import HomePage from "./components/HomePage.vue";
import CharacterPage from "./components/CharacterPage.vue";
import CharacterDetails from "./components/CharacterDetails.vue";
import ComicPage from "./components/ComicPage.vue";
import ComicDetails from "./components/ComicDetails.vue";
import StoriesPage from "./components/StoriesPage.vue";
import StoryDetails from "./components/StoryDetails.vue";
import ErrorPage from "./components/ErrorPage.vue";

const routes = [
    {
        path: "/",
        name: "home",
        component: HomePage,
    },
    {
        path: "/characters/page/:page",
        name: "characters",
        component: CharacterPage,
    },
    {
        path: "/characters/:id",
        name: "characterDetails",
        component: CharacterDetails,
    },
    {
        path: "/comics/page/:page",
        name: "comics",
        component: ComicPage,
    },
    {
        path: "/comics/:id",
        name: "comicDetails",
        component: ComicDetails,
    },
    {
        path: "/stories/page/:page",
        name: "stories",
        component: StoriesPage,
    },
    {
        path: "/stories/:id",
        name: "storyDetails",
        component: StoryDetails,
    },
    {
        path: "/404",
        name: "404",
        component: ErrorPage,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
