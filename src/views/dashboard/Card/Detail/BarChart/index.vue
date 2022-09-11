<template>
  <div class="charts" ref="charts"></div>
</template>
<script>
import * as echarts from "echarts";
export default {
  data() {
    return {};
  },
  mounted() {
    let lineCharts = echarts.init(this.$refs.charts);
    lineCharts.setOption({
      xAxis: {
        show: false,
        type: "category",
      },
      yAxis: { show: false },
      series: {
        type: "bar",
        data: [50, 90, 50, 71, 59, 23, 52, 64, 23, 57, 11, 25],
      },
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
      tooltip: {},
    });
  },
};
</script>
<style scoped>
.charts {
  height: 100%;
  width: 100%;
}
</style>
