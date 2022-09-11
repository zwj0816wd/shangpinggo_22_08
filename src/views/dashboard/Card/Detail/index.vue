<template>
  <div>
    <div class="Card-header">
      <span>{{ title }}</span
      ><i class="el-icon-warning-outline"></i>
    </div>
    <div class="Card-content">{{ count }}</div>
    <div class="Card-charts">
      <slot name="charts"></slot>
    </div>
    <div class="Card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "Detail",
  props: ["title", "count"],
  data() {
    return {};
  },
};
</script>
<style scoped>
.Card-header {
  display: flex;
  justify-content: space-between;
  color: #d9d9d9;
}

.Card-content {
  font-size: 30px;
  padding: 10px;
}

.Card-charts {
  height: 50px;
}

.Card-footer {
  border-top: 1px solid #d9d9d9;
  padding-top: 10px;
}
</style>
