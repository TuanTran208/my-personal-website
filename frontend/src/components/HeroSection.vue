<template>
  <div class="hero-container">
    <video autoplay muted loop id="hero-video">
      <source :src="videoSource" type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    <div class="hero-content">
      <img alt="Game Logo" src="../assets/lineage.png" class="game-logo">
      <div>
        <ol>
          - Sever RetroVn mang phong cách hoài cổ quen thuộc, với giao diện đơn giản, thân thiện như nhưng đã được tối ưu hóa, giúp người chơi dễ tiếp cận ngay từ lần đầu.<br>
        </ol>
        <ol>
          - Hệ thống trò chơi được cân bằng kỹ lưỡng: các class hỗ trợ được gộp lại và kỹ năng farm được nâng cấp nhằm giúp hỗ trợ đồng đội hiệu quả hơn<br>
        </ol>
        <ol>
          - Hệ thống tiền tệ đơn giản và ổn định. Phụ kiện vừa đủ giúp duy trì sự cân bằng giữa các class.<br>
        </ol>
        <ol>
          - Enchant rớt ngẫu nhiên khắp bản đồ, kết hợp teleport gọn gàng và các bản đồ farm đa dạng thỏa mãn nhu cầu săn trang bị của người chơi.<br>
        </ol>
        <ol>
          - Người chơi có thể sử dụng hệ thống auto thông minh khi chơi party hoặc solo, đồng thời sử dụng 5 tài khoản cùng lúc trên một pc<br>
        </ol>
        <ol>
          - Chức năng “penalty gear” duy trì sự công bằng của trang bị; và phần thưởng hàng ngày đa dạng, phong phú giúp trải nghiệm trò chơi luôn mới mẻ
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeroSection'
  // No script logic is needed for a static background
};
</script>

<style scoped>
.hero-container {
  height: 100vh; /* Full viewport height */
  width: 100%;

  /* --- Key CSS Properties for the Background Image --- */
  background-image: url('../assets/background_image.jpeg');
  background-size: cover; /* Ensures the image covers the entire container */
  background-position: center; /* Centers the image */
  background-repeat: no-repeat; /* Prevents the image from repeating */
}
</style>

<style scoped>
.hero-container {
  height: 100vh; /* Full viewport height */
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden; /* Ensures video doesn't spill out */
  text-align: center;
}

#hero-video {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  z-index: 0; /* Puts the video in the background */
}

/* Add a dark overlay to make text more readable */
.hero-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6); /* Dark tint */
  z-index: 1;
}
.hero-content ol {
  font-family: serif; /* Use the imported font here */
  color: white;
  line-height: 1.6; /* Adds more space between lines */
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
  text-align: left;
  font-size: 20px;
  padding-left: 10px; /* Adjust as needed */
  max-width: 800px; /* Prevents the text from becoming too wide on large screens */
  margin: 0 auto; /* Centers the list block itself within the hero-content */
  margin-bottom: 40px;
}

.hero-content ol h4 {
  font-size: 40px; /* Make the sub-heading stand out */
  text-align: left;
  margin-bottom: 10px; /* Adds some space below the h4 */
}

.hero-content {
  position: relative; /* Sits on top of the overlay */
  z-index: 2;
  color: white;
  padding: 20px;
}

.site-logo {
  width: 1000px;
  height: auto;
  margin-bottom: 20px;
}

.game-logo-text {
  font-family: 'Cinzel', serif;
  font-size: 5rem; /* 64px */
  font-weight: 700;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
}

.game-logo {
  width: 900px;

  margin-bottom: 20px;
}

.subtitle {
  font-size: 1.25rem; /* 20px */
  margin-top: 1rem;
  margin-bottom: 2rem;
  max-width: 600px;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.7);
}
</style>
