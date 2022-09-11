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
        min: 0,
        max: 100,
      },
      yAxis: { show: false, type: "category" },
      series: {
        type: "bar",
        data: [78],
        barWidth: 10,
        color: "yellowGreen",
        showBackground: true,
        backgroundStyle: {
          color: "rgba(180, 180, 180, 0.2)",
        },
      },
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
      label: {
        show: true,
        formatter: "|",
        position: "right",
      },
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
