<template>
    <div>
        <h1>Stories</h1>
        <div v-if="loading">
            <p>Loading...</p>
        </div>
        <div v-else>
            <h2>{{story.title}}</h2>
            <div v-if="story.thumbnail">
                <img 
                    :src="story.thumbnail.path + '.' + story.thumbnail.extension"
                    :alt="story.title"
                    class="infoImg"
                />
            </div>
            <p>{{story.description}}</p>
            <h3 v-if="story.comics.items.length">Comics</h3>
            <ul>
                <li v-for="comic in story.comics.items" :key="comic.resourceURI">
                    <router-link 
                        :to="{name: 'comicDetails', params: { id: comic.resourceURI.split('/').pop()}}"
                    >
                        {{comic.name}}
                    </router-link>
                </li>
            </ul>
            <h3 v-if="story.characters.items.length">Characters</h3>
            <ul>
                <li v-for="character in story.characters.items" :key="character.resourceURI">
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
    name: "StoryDetails",
    data() {
        return {
            story: {},
            id: this.$route.params.id,
            loading: true,
        }
    },
    methods: {
        getStory(id) {
            axios.get(`http://localhost:4000/api/stories/${parseInt(id)}`)
                .then(response => {
                    this.story = response.data;
                    this.loading = false;
                })
                .catch(error => {
                    console.log(error);
                    this.$router.push({ name: '404' });
                });
        },
    },
    created() {
        this.getStory(this.$route.params.id);
    },
    watch: {
        $route() {
            this.getStory(this.$route.params.id);
        }
    }

}
</script>

<style scoped></style>