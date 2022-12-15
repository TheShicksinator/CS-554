<template>
    <div>
            <h1>Home</h1>
            <p>
                This site contains a GUI for display of information fetched from
                the Marvel API. You can see paginated lists of characters,
                comics, and stories, and view the details for each entry within
                them.
            </p>
            <br />
            <div>
                <router-link :to="{ name: 'characters', params: { page: 1 } }">Characters</router-link>
                <router-link :to="{ name: 'comics', params: { page: 1 } }">Comics</router-link>
                <router-link :to="{ name: 'stories', params: { page: 1 } }">Stories</router-link>
            </div>
        </div>
</template>