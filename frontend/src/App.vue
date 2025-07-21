<template>
  <div id="app">
    <MainNavbar />
    <router-view />
  </div>
</template>

<script>
import MainNavbar from './components/MainNavbar.vue';

export default {
  name: 'App',
  components: {
    MainNavbar,
  }
};
</script>

<style>
/* Your global styles remain the same */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap');
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  font-family: 'Helvetica Neue', sans-serif;
  background-color: #121212;
}
</style>