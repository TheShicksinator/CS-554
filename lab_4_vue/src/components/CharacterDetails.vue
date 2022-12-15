<template>
    <div>
        <h1>Characters</h1>
        <div v-if="loading">
            <p>Loading...</p>
        </div>
        <div v-else>
            <h2>{{character.name}}</h2>
            <!-- <img
                src={{character.thumbnail.path + '.' + character.thumbnail.extension}}
            /> -->
            <p>{{character.description}}</p>
            <h3 v-if="character.comics.items.length">Comics</h3>
            <ul>
                <div v-for="comic in character.comics.items" :key="comic.resourceURI">
                    <li>
                        <router-link 
                            :to="{name: 'comicDetails', params: { id: comic.resourceURI.split('/').pop()}}"
                        >
                            {{comic.name}}
                        </router-link>
                    </li>
                </div>
            </ul>
            <h3 v-if="character.stories.items.length">Stories</h3>
            <ul>
                <div v-for="story in character.stories.items" :key="story.resourceURI">
                    <li>
                        <router-link
                            :to="{name: 'storyDetails', params: { id: story.resourceURI.split('/').pop()}}"
                        >
                            {{story.name}}
                        </router-link>
                    </li>
                </div>
            </ul>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "CharacterPage",
    data() {
        return {
            character: {},
            id: this.$route.params.id,
            loading: true,
        }
    },
    methods: {
        getCharacter(id) {
            axios.get(`http://localhost:4000/api/characters/${parseInt(id)}`)
                .then(response => {
                    this.character = response.data;
                    this.loading = false;
                })
                .catch(error => {
                    console.log(error);
                    this.$router.push({ name: '404' });
                });
        },
    },
    created() {
        this.getCharacter(this.$route.params.id);
    },
    watch: {
        $route() {
            this.getCharacter(this.$route.params.id);
        }
    }

}
</script>

<style scoped></style>