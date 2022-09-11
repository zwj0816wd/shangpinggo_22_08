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
        type: "line",
        data: [50, 90, 50, 71, 59, 23, 52, 64, 23, 57, 11, 25, 42, 46],
        smooth: true,
        itemStyle: { opacity: 0 },
        lineStyle: { color: "purple" },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 1,
                color: "white", // 0% 处的颜色
              },
              {
                offset: 0,
                color: "purple", // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
      },
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
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
