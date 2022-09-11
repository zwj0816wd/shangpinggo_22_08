<template>
  <el-card shadow="always" :body-style="{ padding: '20px' }">
    <div slot="header">
      <div class="header">
        <span>线上热门搜索</span>
        <el-radio-group v-model="value">
          <el-radio-button label="全部渠道"></el-radio-button>
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="门店"></el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div ref="echarts" style="height: 300px"></div>
  </el-card>
</template>
<script>
import * as echarts from "echarts";
export default {
  data() {
    return {
      value: "全部渠道",
    };
  },
  mounted() {
    let myChart = echarts.init(this.$refs.echarts);
    myChart.setOption({
      title: {
        text: "视频",
        subtext: "1024",
        left: "center",
        top: "center",
      },
      tooltip: {
        trigger: "item",
      },

      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          /*    label: {
            show: false,
            position: "center",
          }, */
          emphasis: {
            label: {
              show: true,
              fontSize: "40",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: true,
          },
          data: [
            { value: 1048, name: "Search Engine" },
            { value: 735, name: "Direct" },
            { value: 580, name: "Email" },
            { value: 484, name: "Union Ads" },
            { value: 300, name: "Video Ads" },
          ],
        },
      ],
    });
    myChart.on("mouseover", (params) => {
      const { name, value } = params;
      myChart.setOption({
        title: {
          text: name,
          subtext: value,
          left: "center",
          top: "center",
        },
      });
    });
  },
};
</script>
<style scoped>
.header span {
  line-height: 40px;
}
.header {
  display: flex;
  justify-content: space-between;
}
</style>
