<template>
    <div>
        <h1>Comics</h1>
        <div v-if="loading">
            <p>Loading...</p>
        </div>
        <div v-else>
            <div>
                <router-link :to="{ name: 'comics', params: { page: parseInt(page) - 1 } }" v-if="page > 1">Previous</router-link>
                <router-link :to="{ name: 'comics', params: { page: parseInt(page) + 1 } }" v-if="!lastPage">Next</router-link>
            </div>
            <div v-for="comic in comics" :key="comic.id">
                <router-link :to="{ name: 'comicDetails', params: { id: comic.id } }">
                    <h2>{{ comic.name }}</h2>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "ComicPage",
    data() {
        return {
            comics: [],
            page: this.$route.params.page,
            loading: true,
            lastPage: false
        }
    },
    methods: {
        getComics(pageNum) {
            axios.get(`http://localhost:4000/api/comics/page/${parseInt(pageNum)}`)
                .then(response => {
                    this.comics = response.data.results;
                    if (this.comics.length === 0) {
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
        this.getComics(this.$route.params.page);
    },
    watch: {
        $route() {
            this.getComics(this.$route.params.page);
        }
    }

}
</script>

<style scoped></style>