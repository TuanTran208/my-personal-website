<template>
  <div>
    <button @click="downloadFile" :disabled="isLoading" class="themed-button">
      <span v-if="isLoading">Processing...</span>
      <span v-else>Download Now</span>
    </button>
    <p v-if="errorMessage" class="status-message error-message">{{ errorMessage }}</p>
    <p v-if="successMessage" class="status-message success-message">{{ successMessage }}</p>
  </div>
</template>

<script>
// The script part remains exactly the same as before
import axios from 'axios';

export default {
  name: 'DownloadButton',
  data() {
    return {
      isLoading: false,
      errorMessage: null,
      successMessage: null,
    };
  },
  methods: {
    async downloadFile() {
      this.isLoading = true;
      this.errorMessage = null;
      this.successMessage = null;

      try {
        const response = await axios.get('http://localhost:3000/api/download/my-secret-file.txt', {
          responseType: 'blob',
          headers: {
            'Authorization': 'Bearer my-secret-token'
          }
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'my-secret-file.txt');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        this.successMessage = "Download initiated successfully!";

      } catch (error) {
        this.errorMessage = "Download failed. You might not have permission.";
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.themed-button {
  background-color: #c89c3c; /* Gold color */
  color: #1a1a1a; /* Dark text */
  border: 2px solid #e4c57a;
  padding: 15px 40px;
  font-size: 1.2rem; /* 19.2px */
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.3s ease;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.5);
}

.themed-button:hover:not(:disabled) {
  background-color: #e4c57a;
  box-shadow: 0px 6px 20px rgba(200, 156, 60, 0.4);
  transform: translateY(-2px);
}

.themed-button:disabled {
  background-color: #555;
  border-color: #777;
  color: #999;
  cursor: not-allowed;
}

.status-message {
  margin-top: 20px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
}

.error-message {
  color: #ff6b6b;
}

.success-message {
  color: #6bff8f;
}
</style>