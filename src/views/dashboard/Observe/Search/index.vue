<template>
  <el-card shadow="always" :body-style="{ padding: '20px' }">
    <div slot="header">
      <div class="searchAndMore">
        <span>线上热门搜索</span>
        <el-dropdown>
          <span class="el-dropdown-link">
            <i class="el-icon-more" style="cursor: pointer"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <el-row :gutter="20">
      <el-col :span="12" :offset="0">
        <LineCharts> </LineCharts>
      </el-col>
      <el-col :span="12" :offset="0"> <LineCharts></LineCharts></el-col>
    </el-row>
    <el-table
      border
      :data="[1]"
      style="width: 100%"
      :default-sort="{ prop: 'date', order: 'descending' }"
    >
      <el-table-column prop="date" label="排名" width="80" type="index">
      </el-table-column>
      <el-table-column prop="name" label="搜索关键字"> </el-table-column>
      <el-table-column prop="address" label="用户数" sortable>
      </el-table-column>
      <el-table-column prop="address" label="周涨幅" sortable>
      </el-table-column>
    </el-table>
    <!--    @size-change="sizeChange"
        @current-change="currentChange" -->
    <el-pagination
      :current-page="1"
      :page-sizes="[20, 40, 80, 100]"
      :page-size="5"
      layout="->,prev, pager, next"
      :total="99"
      :pager-count="7"
    >
    </el-pagination>
  </el-card>
</template>
<script>
import LineCharts from "./LineCharts";
export default {
  data() {
    return {};
  },
  components: {
    LineCharts,
  },
};
</script>
<style scoped>
.searchAndMore {
  display: flex;
  justify-content: space-between;
}
</style>
