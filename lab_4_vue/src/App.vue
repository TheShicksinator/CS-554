<template>
  <div id="app-main">
    <header className="App-header">
        <br/>
        <router-link :to="{name: 'home'}">
            <h1>Vue Marvel API (Click Here For Home)</h1>
        </router-link>
    </header>
    <br />
    <router-view :key="$route.path"/>
  </div>
</template>

<script>

export default {
  name: 'App'
}
</script>

<style>
#app-main {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.links {
    margin: 20px;
    color: black;
}

.infoImg {
    width: 450px;
    height: auto;
}
</style>
