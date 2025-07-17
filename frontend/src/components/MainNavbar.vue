<template>
  <nav class="main-nav-container">
    <div class="left-side">
      <h1 class="game-logo">LINEAGE II</h1>
      <ul class="nav-links">
        <li><a href="#">Facebook<span class="external-link-icon">↗</span></a></li>
        <li><a href="#">Discord <span class="external-link-icon">↗</span></a></li>
      </ul>
    </div>
    <div class="right-side">
      <button class="download-button" @click="downloadFile" :disabled="isLoading">
        <span class="main-text">DOWNLOAD</span>
      </button>
    </div>
  </nav>
</template>

<script>
// We move the download logic here from the old DownloadButton.vue
import axios from 'axios';

export default {
  name: 'MainNavbar',
  data() {
    return {
      isLoading: false
    }
  },
  methods: {
    async downloadFile() {
      this.isLoading = true;
      alert('Download started!'); // Placeholder for actual download logic

      try {
        const response = await axios.get('http://localhost:3000/api/download/my-secret-file.txt', {
          responseType: 'blob',
          headers: { 'Authorization': 'Bearer my-secret-token' }
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'my-secret-file.txt');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

      } catch (error) {
        alert("Download failed. You might not have permission.");
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.main-nav-container {
  background-color: rgba(26, 26, 26, 0.85);
  backdrop-filter: blur(5px);
  border-bottom: 1px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  height: 80px;
  width: 100%;
  position: fixed;
  top: 45px; /* Positioned below the TopBar */
  left: 0;
  z-index: 99;
}

.left-side, .right-side {
  display: flex;
  align-items: center;
}

.game-logo {
  font-family: 'Cinzel', serif;
  font-size: 2.5rem;
  color: #e0e0e0;
  letter-spacing: 2px;
  margin-right: 40px;
}

.nav-links {
  list-style: none;
  display: flex;
}

.nav-links li a {
  color: #d0d0d0;
  text-decoration: none;
  padding: 0 18px;
  font-size: 1rem;
  font-weight: bold;
  transition: color 0.3s;
}

.nav-links li a:hover {
  color: #ffffff;
}

.arrow {
  font-size: 0.6rem;
  display: inline-block;
  margin-left: 4px;
}

.external-link-icon {
  font-family: sans-serif;
  transform: rotate(-45deg);
  display: inline-block;
}

/* Big purple download button */
.download-button {
  background: linear-gradient(to right, #8e2de2, #4a00e0);
  color: white;
  border: none;
  border-radius: 5px;
  padding: 15px 30px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.download-button:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(142, 45, 226, 0.7);
}

.download-button .main-text {
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 1px;
}

.download-button .sub-text {
  font-size: 0.7rem;
  opacity: 0.8;
  text-transform: uppercase;
}
</style>