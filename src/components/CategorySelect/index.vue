<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="categoryForm">
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择"
          v-model="categoryForm.category1Id"
          @change="handle1"
          :disabled="isShowSelect"
        >
          <el-option
            :label="category.name"
            :value="category.id"
            v-for="category in category1List"
            :key="category.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          v-model="categoryForm.category2Id"
          @change="handle2"
          :disabled="isShowSelect"
        >
          <el-option
            :label="category.name"
            :value="category.id"
            v-for="category in category2List"
            :key="category.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          v-model="categoryForm.category3Id"
          @change="handle3"
          :disabled="isShowSelect"
        >
          <el-option
            :label="category.name"
            :value="category.id"
            v-for="category in category3List"
            :key="category.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "CategorySelect",
  props: ["isShowSelect"],
  data() {
    return {
      //一级分类数据
      category1List: [],
      category2List: [],
      category3List: [],
      //收集一级和二级数据id
      categoryForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  mounted() {
    //挂载后获取一级分类数据
    this.getCategory1List();
  },
  methods: {
    //获取一级分类数据
    async getCategory1List() {
      let result = await this.$API.attr.reqGetCategory1List();
      if (result.code == 200) {
        this.category1List = result.data;
      }
    },
    //一级分类select的回调函数(一级分类的option发生变化时获取二级分类的数据)
    async handle1() {
      //重新选择一级分类时要清除二三级分类的id
      this.categoryForm.category2Id = "";
      this.categoryForm.category3Id = "";
      let { category1Id } = this.categoryForm;
      let result = await this.$API.attr.reqGetCategory2List(category1Id);
      if (result.code == 200) {
        this.category2List = result.data;
        //一级分类改变的时候要清空三级分类的数据
        this.category3List = [];
      }
    },
    //二级分类select的回调函数(二级分类的option发生变化时获取三级分类的数据)
    async handle2() {
      //重新选择二级分类时要清除三级分类的id
      this.categoryForm.category3Id = "";
      let { category2Id } = this.categoryForm;
      let result = await this.$API.attr.reqGetCategory3List(category2Id);
      if (result.code == 200) {
        this.category3List = result.data;
      }
    },
    //三级分类select的回调函数
    handle3() {
      let { category1Id, category2Id, category3Id } = this.categoryForm;
      //修改三级分类时向父组件提供各级id并进行标识
      this.$emit("getCategoryId", {
        id1: category1Id,
        id2: category2Id,
        id3: category3Id,
      });
    },
  },
};
</script>
<style lang="less" scoped></style>
