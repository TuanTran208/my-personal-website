<template>
  <div class="downloads-container">
      <div class="downloads-content">
        <h1>Downloads</h1>
        <p>Choose the correct part.</p>
        <div class="links-wrapper">
          <a href="/api/download/updater.zip" class="download-link">
            <div class="icon-placeholder windows">U</div>
            <div class="link-text">
              <span class="main-text">Updater</span>
              <span class="sub-text">Updater.zip</span>
            </div>
          </a>
          <a href="/api/download/system.zip" class="download-link">
            <div class="icon-placeholder mac">S</div>
            <div class="link-text">
              <span class="main-text">System</span>
              <span class="sub-text">System.zip</span>
            </div>
          </a>
          <a href="/api/download/Full_Client_Classic.zip" class="download-link">
            <div class="icon-placeholder linux">F</div>
            <div class="link-text">
              <span class="main-text">Full Client</span>
              <span class="sub-text">Full_Client_Classic.zip</span>
            </div>
          </a>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'DownloadsView'
};
</script>

<style scoped>
.downloads-container {
  padding-top: 125px; /* Height of both navbars */
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: #1a1a1a;
  color: #e0e0e0;
  /* --- Key CSS Properties for the Background Image --- */
  background-image: url('../assets/background_image.jpeg');
  background-size: cover; /* Ensures the image covers the entire container */
  background-position: center; /* Centers the image */
  background-repeat: no-repeat; /* Prevents the image from repeating */
}

.downloads-content {
  width: 100%;
  max-width: 900px;
  padding: 40px;
  text-align: center;
}

h1 {
  font-family: 'Cinzel', serif;
  font-size: 3.5rem;
  margin-bottom: 20px;
}

.links-wrapper {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.download-link {
  background-color: #2c2c2c;
  border: 1px solid #444;
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 20px;
  text-decoration: none;
  color: #e0e0e0;
  transition: all 0.3s ease;
}

.download-link:hover {
  background-color: #383838;
  border-color: #8e2de2;
  transform: translateY(-5px);
}

.icon-placeholder {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  border-radius: 5px;
  margin-right: 20px;
}

.icon-placeholder.windows {
  background-color: #0078d4;
}

.icon-placeholder.mac {
  background-color: #a0a0a0;
}

.icon-placeholder.linux {
  background-color: #dd4814;
}

.link-text {
  text-align: left;
}

.link-text .main-text {
  font-size: 1.2rem;
  font-weight: bold;
  display: block;
}

.link-text .sub-text {
  font-size: 0.9rem;
  opacity: 0.7;
}
</style>