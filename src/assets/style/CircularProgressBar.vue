<template>
  <div class="progress">
    <div class="bar-overflow">
      <div class="bar" :style="[barStyle, borderStyle]"></div>
    </div>
    <span class="percentage-text" :class="{'red-text': displayedPercentage <= 30}">{{ displayedPercentage }} </span>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineProps } from "vue";

const { percentage } = defineProps(["percentage"]);

const displayedPercentage = ref(0);
const barStyle = ref<string>("");
const borderStyle = ref<string>(""); // Added for border color

onMounted(() => {
  animateProgressBar();
});

const animateProgressBar = () => {
  const endPercentage = percentage;

  const totalFrames = 120; // Number of frames for the animation
  let currentFrame = 0;

  const animationInterval = setInterval(() => {
    if (currentFrame >= totalFrames) {
      clearInterval(animationInterval);
    } else {
      const easingFactor = easeInOutQuad(currentFrame / totalFrames); // Apply easing function
      currentFrame += 1;

      const animatedPercentage = Math.round(easingFactor * endPercentage);
      displayedPercentage.value = animatedPercentage;
      const degrees = 45 + animatedPercentage * 0.49;
      barStyle.value = `transform: rotate(${degrees}deg);`;

      // Determine border color based on displayedPercentage
      if (displayedPercentage.value <= 30) {
        borderStyle.value =
          "border-bottom-color: red; border-right-color: red;";
      } else {
        borderStyle.value =
          "border-bottom-color: navy; border-right-color: navy;"; // Reset border color
      }
    }
  }, 25); // Adjust the interval for smoother animation if needed
};

// Easing function for smooth start and finish
function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
</script>

<style scoped>
.progress {
  position: relative;
  margin: 8px; /* Increased margin for spacing */
  float: left;
  text-align: center;
  border-radius: 20%;
}

.bar-overflow {
  /* Wraps the rotating .bar */
  position: relative;
  overflow: hidden;
  width: 300px; /* Increased width for a larger half circle */
  height: 150px; /* Increased height for a larger half circle */
  margin-bottom: -20px; /* Adjusted margin for larger size */
  border-radius: 5%;
}
/* Add new styles for border color */
.bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 300px; /* Increased width for a larger full circle */
  height: 300px; /* Increased height for a larger full circle */
  border-radius: 50%;
  box-sizing: border-box;
  border: 12px solid #eee; /* half gray */
  /* Remove border colors from here */
}
.percentage-text {
  font-size: 3rem; /* Adjust the font size as needed */
}
.red-text {
  color: red;
}
</style>
