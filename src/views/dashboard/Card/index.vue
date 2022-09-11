<template>
  <el-row :gutter="10">
    <el-col :span="6" :offset="0">
      <el-card shadow="always">
        <Detail title="总销售额" count="￥126560">
          <template slot="charts">
            <span>周同比 56.67% </span
            ><i class="el-icon-caret-top" style="color: red"></i>
            &nbsp;&nbsp;
            <span>日同比 12.96% </span
            ><i class="el-icon-caret-bottom" style="color: greenyellow"></i>
          </template>
          <template slot="footer">
            <span>日销售额￥12423</span>
          </template>
        </Detail>
      </el-card>
    </el-col>
    <el-col :span="6" :offset="0">
      <el-card shadow="always">
        <Detail title="访问量" count="88460">
          <template slot="charts">
            <LineChart></LineChart>
          </template>
          <template slot="footer">
            <span>日访问量 1234</span>
          </template>
        </Detail>
      </el-card>
    </el-col>
    <el-col :span="6" :offset="0">
      <el-card shadow="always">
        <Detail title="支付笔数" count="88460">
          <template slot="footer">
            <span>转化率64%</span>
          </template>
          <template slot="charts">
            <BarChart></BarChart>
          </template>
        </Detail>
      </el-card>
    </el-col>
    <el-col :span="6" :offset="0">
      <el-card shadow="always">
        <Detail title="运营活动效果" count="78%">
          <template slot="charts">
            <Progress></Progress>
          </template>
          <template slot="footer">
            <span>周同比 56.67% </span
            ><i class="el-icon-caret-top" style="color: red"></i>
            &nbsp;&nbsp;
            <span>日同比 12.96% </span
            ><i class="el-icon-caret-bottom" style="color: greenyellow"></i>
          </template>
        </Detail>
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
import Detail from "./Detail";
import LineChart from "./Detail/LineChart";
import BarChart from "./Detail/BarChart";
import Progress from "./Detail/Progress";
export default {
  name: "Card",
  data() {
    return {};
  },
  components: {
    Detail,
    LineChart,
    BarChart,
    Progress,
  },
};
</script>
<style scoped></style>
