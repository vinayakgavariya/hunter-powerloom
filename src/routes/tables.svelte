<script>
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';

  const chartData = {
    labels: ['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5'],
    datasets: [
      {
        label: 'Sample Data',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        data: [12, 19, 3, 5, 2],
      },
    ],
  };

  const pieChartData = {
    labels: ['Category A', 'Category B', 'Category C', 'Category D', 'Category E'],
    datasets: [
      {
        label: 'Sample Pie Data',
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
        data: [15, 25, 10, 30, 20],
      },
    ],
  };

  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Sample Line Data',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: false,
        data: [10, 20, 15, 25, 18],
      },
    ],
  };

  let barChart;
  let pieChart;
  let lineChart;

  onMount(() => {
    // Bar chart
    const barCtx = document.getElementById('barChart').getContext('2d');
    barChart = new Chart(barCtx, {
      type: 'bar',
      data: chartData,
    });

    // Pie chart
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    pieChart = new Chart(pieCtx, {
      type: 'pie',
      data: pieChartData,
    });

    // Line chart
    const lineCtx = document.getElementById('lineChart').getContext('2d');
    lineChart = new Chart(lineCtx, {
      type: 'line',
      data: lineChartData,
    });
  });
</script>

<style>
  /* Add any custom styles for the chart containers */
  .chart-container {
    max-width: 600px;
    margin: 20px auto;
  }
</style>

<div class="flex flex-col">
  <!-- Your existing dashboard content here -->

  <!-- Bar chart section -->
  <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
      <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <div class="chart-container">
          <canvas id="barChart"></canvas>
        </div>
      </div>
    </div>
  </div>

  <!-- Pie chart section -->
  <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
      <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <div class="chart-container">
          <canvas id="pieChart"></canvas>
        </div>
      </div>
    </div>
  </div>

  <!-- Line chart section -->
  <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
      <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <div class="chart-container">
          <canvas id="lineChart"></canvas>
        </div>
      </div>
    </div>
  </div>
</div>
