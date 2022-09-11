<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0"
      @click="showDialog"
      >添加</el-button
    >
    <!-- 对话框 -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <el-form style="width: 70%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌logo" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <el-table style="width: 100%" border :data="pageInfo.records">
      <el-table-column type="index" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌logo" width="width">
        <template v-slot="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="width: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template v-slot="{ row, $index }">
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-edit"
            @click="updateTradeMark(row)"
            >修改
          </el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="deleteTradeMark(row)"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :total="pageInfo.total"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :pager-count="7"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
    </el-pagination>
  </div>
</template>
<script>
export default {
  name: "TradeMark",
  data() {
    //自定义校验
    var validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error("品牌名称2到10位"));
      } else {
        callback();
      }
    };
    return {
      //当前页码
      page: 1,
      //当前数据显示条数
      limit: 3,
      //储存响应回来数据
      pageInfo: {},
      //对话框是否显示
      dialogFormVisible: false,
      //收集品牌信息
      tmForm: {
        //品牌名称
        tmName: "",
        //上传的图片logo
        logoUrl: "",
      },
      rules: {
        //品牌名称验证规则
        //require：有校验字段提示  message提示信息  trigger用户行为设置比如blur，change
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          //min最小字段，max最大验证
          { validator: validateTmName, trigger: "blur" },
        ],
        logoUrl: [{ required: true, message: "请选择品图片" }],
      },
    };
  },
  mounted() {
    this.getPageList();
  },
  methods: {
    //获取品牌列表数据
    async getPageList() {
      const { page, limit } = this;
      let result = await this.$API.tradeMark.reqTradeMarkList(page, limit);
      if ((result.code = 200)) {
        this.pageInfo = result.data;
      } else {
        alert(result.messge);
      }
    },
    //页码改变时的回调
    handleCurrentChange(pager) {
      this.page = pager;
      this.getPageList();
    },
    //展示数据的条数改变的回调
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
    //显示对话框
    showDialog() {
      this.dialogFormVisible = true;
      //每次点击之前清空对话框
      this.tmForm.logoUrl = "";
      this.tmForm.tmName = "";
    },
    //图片上传成功的回调
    handleAvatarSuccess(res, file) {
      //resn上传成功之后返回前项数据
      //file:上传成功之后服务器返回前端教报
      this.tmForm.logoUrl = res.data;
    },
    //图片上传之前回调
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //添加或修改品牌
    addOrUpdateTradeMark() {
      //判断说有表单是否校验成功
      this.$refs.ruleForm.validate(async (success) => {
        if (success) {
          this.dialogFormVisible = false;
          let result = await this.$API.tradeMark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          if (result.code == 200) {
            //弹出成功添加或修改信息框
            this.$message({
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
              type: "success",
            });
            //如果添加品牌成功后返回第一页，修改品牌则发挥当前页
            this.getPageList(this.tmForm.id ? this.page : 1);
          }
        } else {
          alert("error submit!");
          return false;
        }
      });
    },
    //修改图片
    updateTradeMark(row) {
      this.dialogFormVisible = true;
      //进行浅拷贝
      this.tmForm = { ...row };
    },
    //删除品牌信息
    deleteTradeMark(row) {
      this.$confirm(`你确定删除${row.tmName}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            let result = await this.$API.tradeMark.reqDeleteTradeMark(row.id);
            if (result.code == 200) {
              if (this.pageInfo.records.length == 1) {
                //如果删的是这个页面的最后一条，就要跳转到前一页
                this.page--;
              }
              this.getPageList();
              //单击确定时触发
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            }
          } catch (error) {}
        })
        .catch((value) => {
          //单击取消时触发
          this.$message({
            type: "info",
            message: value == "cancel" ? "已取消删除" : value,
          });
        });
    },
  },
};
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
