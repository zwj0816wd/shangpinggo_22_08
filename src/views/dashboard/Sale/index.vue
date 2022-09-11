<template>
  <el-card shadow="always" :body-style="{ padding: '20px' }">
    <div class="tab">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visite"></el-tab-pane>
      </el-tabs>
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <el-date-picker
          v-model="date"
          style="width: 250px; margin: 0 20px"
          size="mini"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['12:00:00']"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </div>
    </div>
    <el-row :gutter="20">
      <el-col :span="16" :offset="0">
        <div class="charts" ref="charts" style="height: 300px"></div>
      </el-col>
      <el-col :span="8" :offset="0">
        <h3>门店{{ activeName == "sale" ? "销售额" : "访问量" }}排名</h3>
        <ul>
          <li v-for="Rank in data.orderRank" :key="Rank.no">
            <span>{{ Rank.no }}</span>
            <span>{{ Rank.name }}</span>
            <span>{{ Rank.money }}</span>
          </li>
        </ul>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import dayjs from "dayjs";
import * as echarts from "echarts";
import { mapState } from "vuex";
export default {
  name: "Sale",
  data() {
    return {
      activeName: "sale",
      myChart: {},
      date: [],
    };
  },
  mounted() {
    this.myChart = echarts.init(this.$refs.charts);
    this.myChart.setOption({
      title: {
        text: "销售额趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月",
          ],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [10, 52, 200, 334, 390, 330, 220, 123, 324, 412, 222, 123],
          color: "pink",
        },
      ],
    });
  },
  watch: {
    activeName() {
      this.myChart.setOption({
        title: {
          text: `${this.activeName == "sale" ? "销售额" : "访问量"}趋势`,
        },
        series: [
          {
            data:
              this.activeName == "sale"
                ? this.data.orderFullYear
                : this.data.userFullYear,
          },
        ],
      });
    },
  },
  methods: {
    handleClick() {},
    setDay() {
      let day = dayjs().format("YYYY-MM-DD");
      this.date = [day, day];
    },
    setWeek() {
      let start = dayjs().day(1).format("YYYY-MM-DD");
      let end = dayjs().day(7).format("YYYY-MM-DD");
      this.date = [start, end];
    },
    setMonth() {
      let start = dayjs().startOf("month").format("YYYY-MM-DD");
      let end = dayjs().endOf("month").format("YYYY-MM-DD");
      this.date = [start, end];
    },
    setYear() {
      let start = dayjs().startOf("year").format("YYYY-MM-DD");
      let end = dayjs().endOf("year").format("YYYY-MM-DD");
      this.date = [start, end];
    },
  },
  computed: {
    ...mapState({ data: (state) => state.home.data }),
  },
};
</script>
<style scoped>
.tab {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.el-tabs {
  width: 100%;
}
.right {
  position: absolute;
  right: 0;
}
.right span {
  margin: 0 10px;
}
ul {
  list-style: none;
  width: 100%;
  height: 300px;
}
ul li {
  margin: 30px 0;
}
ul span {
  margin: 0 10px;
}
ul span:nth-child(1) {
  float: left;
  height: 18px;
  width: 18px;
  text-align: center;
}
ul li:nth-child(-n + 3) span:nth-child(1) {
  color: white;
  border-radius: 50%;
  background: black;
}
ul span:nth-child(3) {
  float: right;
}
</style>
