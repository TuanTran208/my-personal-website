<template>
  <header class="top-bar-container">
    <div class="left-side">
      <a href="#" class="nc-logo">NC</a>
      <a href="#">Games <span class="arrow">▼</span></a>
    </div>
    <div class="right-side">
      <a href="#">Create Account</a>
      <a href="#">Log In</a>
    </div>
  </header>
</template>

<script>
export default {
  name: 'TopBar'
};
</script>

<style scoped>
.top-bar-container {
  background-color: #000000;
  color: #a0a0a0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  height: 45px;
  width: 100%;
  position: fixed; /* Fixes it to the top */
  top: 0;
  left: 0;
  z-index: 100; /* Ensures it's on top of other elements */
  font-size: 0.8rem;
}

.left-side, .right-side {
  display: flex;
  align-items: center;
}

.top-bar-container a {
  color: #a0a0a0;
  text-decoration: none;
  padding: 0 15px;
  transition: color 0.3s;
}

.top-bar-container a:hover {
  color: #ffffff;
}

.nc-logo {
  font-weight: bold;
  font-size: 1.5rem;
  color: #fff;
}

.arrow {
  font-size: 0.6rem;
  display: inline-block;
  margin-left: 4px;
}
</style>