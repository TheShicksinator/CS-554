<template>
    <div>
        <h1>Stories</h1>
        <div v-if="loading">
            <p>Loading...</p>
        </div>
        <div v-else>
            <div>
                <router-link class="links" :to="{ name: 'stories', params: { page: parseInt(page) - 1 } }" v-if="page > 1">Previous</router-link>
                <router-link class="links" :to="{ name: 'stories', params: { page: parseInt(page) + 1 } }" v-if="!lastPage">Next</router-link>
            </div>
            <div v-for="story in stories" :key="story.id">
                <router-link :to="{ name: 'storyDetails', params: { id: story.id } }">
                    <h2>{{ story.title }}</h2>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "StoryPage",
    data() {
        return {
            stories: [],
            page: this.$route.params.page,
            loading: true,
            lastPage: false
        }
    },
    methods: {
        getStories(pageNum) {
            axios.get(`http://localhost:4000/api/stories/page/${parseInt(pageNum)}`)
                .then(response => {
                    this.stories = response.data.results;
                    if (this.stories.length === 0) {
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
        this.getStories(this.$route.params.page);
    },
    watch: {
        $route() {
            this.getStories(this.$route.params.page);
        }
    }

}
</script>

<style scoped></style>