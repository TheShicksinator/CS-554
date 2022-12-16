<template>
    <div>
        <h1>Characters</h1>
        <div v-if="loading">
            <p>Loading...</p>
        </div>
        <div v-else>
            <div>
                <router-link class="links" :to="{ name: 'characters', params: { page: parseInt(page) - 1 } }" v-if="page > 1">Previous</router-link>
                <router-link class="links" :to="{ name: 'characters', params: { page: parseInt(page) + 1 } }" v-if="!lastPage">Next</router-link>
            </div>
            <div v-for="character in characters" :key="character.id">
                <router-link :to="{ name: 'characterDetails', params: { id: character.id } }">
                    <h2>{{ character.name }}</h2>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "CharacterPage",
    data() {
        return {
            characters: [],
            page: this.$route.params.page,
            loading: true,
            lastPage: false
        }
    },
    methods: {
        getCharacters(pageNum) {
            axios.get(`http://localhost:4000/api/characters/page/${parseInt(pageNum)}`)
                .then(response => {
                    this.characters = response.data.results;
                    if (this.characters.length === 0) {
                        this.$router.push({ name: '404' });
                    }
                    this.lastPage = (response.data.total - 1 - response.data.offset <= response.data.limit || response.data.results.length < response.data.limit);
                    this.loading = false;
                })
                .catch(error => {
                    console.log(error);
                    this.$router.push({ name: '404' });
                });
        },
    },
    created() {
        this.getCharacters(this.$route.params.page);
    },
    watch: {
        $route() {
            this.getCharacters(this.$route.params.page);
        }
    }

}
</script>

<style scoped></style>