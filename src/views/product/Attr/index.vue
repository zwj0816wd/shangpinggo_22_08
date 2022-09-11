<template>
  <div>
    <el-card shadow="always" style="margin: 20px 0">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :isShowSelect="!isShowTable"
      ></CategorySelect>
    </el-card>
    <el-card shadow="always">
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加
        </el-button>
        <el-table :data="attrInfoList" border>
          <el-table-column
            type="index"
            label="序号"
            width="50px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="100px">
          </el-table-column>
          <el-table-column prop="attrValueList" label="属性值列表">
            <template v-slot="{ row, $index }">
              <el-tag
                type="success"
                v-for="attr in row.attrValueList"
                :key="attr.id"
                style="margin: 5px 10px"
              >
                {{ attr.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="prop" width="200px">
            <template v-slot="{ row, $index }">
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-edit"
                @click="updateAttr(row)"
                >修改
              </el-button>
              <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                icon="el-icon-info"
                icon-color="red"
                :title="`你确定要删除${row.attrName}吗？`"
                @onConfirm="deleteAttr(row)"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  >删除
                </el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowTable">
        <el-form ref="form" label-width="80px" :inline="false" size="normal">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              style="width: 200px"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="addAttrValue"
              :disabled="!attrInfo.attrName"
              >添加
            </el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
        <el-table
          border
          stripe
          style="margin: 20px 0"
          :data="attrInfo.attrValueList"
        >
          <el-table-column type="index" label="序号" width="80px">
          </el-table-column>
          <el-table-column label="属性值名称">
            <template v-slot="{ row, $index }">
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                clearable
                v-if="row.flag"
                @blur="showSpan(row)"
                @keyup.native.enter="row.flag = false"
                :ref="$index"
              ></el-input>
              <span v-else @click="showInput(row, $index)">{{
                row.valueName
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="{ row, $index }">
              <el-popconfirm
                :title="`你确定要删除${row.valueName}吗？`"
                confirmButtonText="确定"
                cancelButtonText="取消"
                confirmButtonType="primary"
                cancelButtonType="text"
                icon="el-icon-question"
                iconColor="#f90"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="addOrUpdateAttr"
          :disabled="attrInfo.attrValueList.length < 1"
          >保存</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
//按需引入lodash中的深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      //各级id
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //通过各级id获取的数据
      attrInfoList: [],
      //控制table显示和隐藏
      isShowTable: true,
      //收集新增属性和修改属性来使用的
      attrInfo: {
        attrName: "",
        attrValueList: [],
        categoryId: 0, //
        categoryLevel: 3, //服务器要区分几级分类
      },
    };
  },
  methods: {
    //从子组件获取相应各级id
    getCategoryId(getCategoryAllId) {
      this.category1Id = getCategoryAllId.id1;
      this.category2Id = getCategoryAllId.id2;
      this.category3Id = getCategoryAllId.id3;
      //获取到各级id后发送请求获取attrInfoList数据
      this.getAttrInfoList();
    },
    //获取数据
    async getAttrInfoList() {
      let result = await this.$API.attr.reqGetAttrInfoList(
        this.category1Id,
        this.category2Id,
        this.category3Id
      );
      if (result.code == 200) {
        this.attrInfoList = result.data;
      }
    },
    //添加属性按钮的回调
    addAttr() {
      this.isShowTable = false;
      //清除之前填写的数据
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
    },
    //修改属性按钮的回调
    updateAttr(row) {
      this.isShowTable = false;
      //使用深拷贝
      this.attrInfo = cloneDeep(row);
      this.attrInfo.attrValueList.forEach((e) => {
        this.$set(e, "flag", false);
      });
    },
    //添加一个或多个属性值名称
    addAttrValue() {
      //如果前一个属性值为空，则不能再添加
      let isEmpty = this.attrInfo.attrValueList.some((e) => e.valueName == "");
      if (isEmpty) {
        this.$message({
          type: "warning",
          message: "有属性值为空，不能添加",
        });
        return;
      }
      this.attrInfo.attrValueList.push({
        //在添加属性名时attrId为undefined，在修改属性名再次添加属性值时加入已有的属性id
        attrId: this.attrInfo.id,
        valueName: "",
        //是显示span还input
        flag: true,
      });
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
        console.log(this.$refs);
      });
    },
    //删除属性值（气泡确认框确定按钮的回调）
    deleteAttrValue($index) {
      this.attrInfo.attrValueList.splice($index, 1);
    },
    showInput(row, $index) {
      //查看模式变为编辑模式
      row.flag = true;
      this.$nextTick(() => {
        //使相应的input聚焦
        this.$refs[$index].focus();
      });
    },
    showSpan(row) {
      //如果添加的属性值为空，则提用户示重新输入
      if (row.valueName.trim() == "") {
        this.$message({
          type: "warning",
          message: "请输入正常的属性值",
        });
        return;
      }
      //如果输入的属性值已有，则提示重新输入
      //如果isRepat数组的长度是变重复了，提示用户重新输入
      let isRepat = this.attrInfo.attrValueList.filter(
        (k) => k.valueName == row.valueName
      );
      if (isRepat.length >= 2) {
        this.$message({
          type: "warning",
          message: "请输入非重复的属性值",
        });
        return;
      }
      //编辑模式变为查看模式
      row.flag = false;
    },
    //添加或修改属性保存的回调
    async addOrUpdateAttr() {
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter((e) => {
        if (e.valueName != "") {
          delete e.flag;
          return true;
        }
      });
      if (this.attrInfo.attrValueList.length) {
        try {
          await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
          this.$message({
            type: "success",
            message: "保存成功",
          });
          //重新获取数据刷新页面
          this.getAttrInfoList();
        } catch (error) {
          this.$message.erroe(error);
        }
      } else {
        this.$message.error("不能保存空的属性值");
      }
    },
    //删除属性和属性值
    async deleteAttr(row) {
      console.log(row.id);
      try {
        await this.$API.attr.reqDeleteAttr(row.id);
        this.$message({
          type: "success",
          message: "删除成功",
        });
        //重新获取数据刷新页面
        this.getAttrInfoList();
      } catch (error) {
        this.$message.error(error);
      }
    },
  },
};
</script>
<style lang="less" scoped></style>
