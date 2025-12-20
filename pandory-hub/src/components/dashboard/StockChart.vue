<template>
  <div class="w-full h-64">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'vue-chartjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const props = defineProps({
  history: {
    type: Array,
    default: () => []
  },
  isPositive: {
    type: Boolean,
    default: true
  }
});

const chartData = computed(() => {
  const labels = props.history.map(h => h.date); // e.g. "2023-10-01"
  const data = props.history.map(h => h.close);

  const color = props.isPositive ? '#10B981' : '#EF4444'; // Emerald-500 or Red-500
  const bgColor = props.isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';

  return {
    labels,
    datasets: [
      {
        label: 'Price',
        data,
        borderColor: color,
        backgroundColor: bgColor,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        borderWidth: 2
      }
    ]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: (context) => {
          return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'VND' }).format(context.raw);
        }
      }
    }
  },
  scales: {
    x: {
      display: false,
      grid: { display: false }
    },
    y: {
      display: true,
      grid: {
        color: 'rgba(156, 163, 175, 0.1)'
      },
      ticks: {
          callback: (val) => new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(val)
      }
    }
  },
  interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
  }
};
</script>
