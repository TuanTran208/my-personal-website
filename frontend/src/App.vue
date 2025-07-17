<template>
  <div id="app">
    <MainNavbar />
    <HeroSection />

    </div>
</template>

<script>
import MainNavbar from './components/MainNavbar.vue';
import HeroSection from './components/HeroSection.vue';

export default {
  name: 'App',
  components: {
    MainNavbar,
    HeroSection
  }
};
</script>

<style>
/* Global styles from before */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Helvetica Neue', sans-serif; /* Using a more standard UI font */
  background-color: #121212;
}
</style>