<template>
    <div>
        <h1>Comics</h1>
        <div v-if="loading">
            <p>Loading...</p>
        </div>
        <div v-else>
            <h2>{{comic.title}}</h2>
            <img
                :src="comic.thumbnail.path + '.' + comic.thumbnail.extension"
                :alt="comic.title"
                class="infoImg"
            />
            <p>{{comic.description}}</p>
            <h3 v-if="comic.stories.items.length">Stories</h3>
            <ul>
                <li v-for="story in comic.stories.items" :key="story.resourceURI">
                    <router-link 
                        :to="{name: 'storyDetails', params: { id: story.resourceURI.split('/').pop()}}"
                    >
                        {{story.name}}
                    </router-link>
                </li>
            </ul>
            <h3 v-if="comic.characters.items.length">Characters</h3>
            <ul>
                <li v-for="character in comic.characters.items" :key="character.resourceURI">
                    <router-link
                        :to="{name: 'characterDetails', params: { id: character.resourceURI.split('/').pop()}}"
                    >
                        {{character.name}}
                    </router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "ComicDetails",
    data() {
        return {
            comic: {},
            id: this.$route.params.id,
            loading: true,
        }
    },
    methods: {
        getComic(id) {
            axios.get(`http://localhost:4000/api/comics/${parseInt(id)}`)
                .then(response => {
                    this.comic = response.data;
                    this.loading = false;
                })
                .catch(error => {
                    console.log(error);
                    this.$router.push({ name: '404' });
                });
        },
    },
    created() {
        this.getComic(this.$route.params.id);
    },
    watch: {
        $route() {
            this.getComic(this.$route.params.id);
        }
    }

}
</script>

<style scoped></style>