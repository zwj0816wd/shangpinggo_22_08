<template>
  <div>
    <el-card shadow="always" style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :isShowSelect="scene != 0">
      </CategorySelect>
    </el-card>
    <el-card shadow="always">
      <div v-show="scene == 0">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addSpu"
          >添加SPU
        </el-button>
        <el-table border stripe :data="spuList">
          <el-table-column
            type="index"
            label="序号"
            width="50px"
            align="center"
          >
          </el-table-column>
          <el-table-column label="spu名称" width="width">
            <template v-slot="{ row, $index }">
              {{ row.spuName }}
            </template>
          </el-table-column>
          <el-table-column label="spu描述" width="width">
            <template v-slot="{ row, $index }">
              {{ row.description }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template v-slot="{ row, $index }">
              <hint-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              ></hint-button>
              <hint-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              ></hint-button>
              <hint-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu的sku列表"
                @click="showSkuList(row)"
              ></hint-button>
              <!-- 对话框 -->
              <el-dialog
                :title="`${spu.spuName}的sku列表`"
                :visible.sync="dialogTableVisible"
                :before-close="close"
              >
                <!-- table展示sku列表数据 -->
                <el-table :data="skuList" v-loading="loading" border>
                  <el-table-column property="date" label="名称">
                    <template v-slot="{ row, $index }">
                      {{ row.skuName }}
                    </template>
                  </el-table-column>
                  <el-table-column property="name" label="价格">
                    <template v-slot="{ row, $index }">
                      {{ row.price }}
                    </template></el-table-column
                  >
                  <el-table-column property="address" label="重量">
                    <template v-slot="{ row, $index }">
                      {{ row.weight }}
                    </template>
                  </el-table-column>
                  <el-table-column property="address" label="默认图片">
                    <template v-slot="{ row, $index }">
                      <el-image
                        style="width: 80px"
                        :src="row.skuDefaultImg"
                        :lazy="true"
                      >
                      </el-image></template
                  ></el-table-column>
                </el-table>
              </el-dialog>
              <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                icon="el-icon-info"
                icon-color="blue"
                :title="`你确定要删除${row.spuName}这个spu属性吗？`"
                @onConfirm="deleteSpu(row)"
              >
                <hint-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                ></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center"
          :current-page="page"
          :page-size="limit"
          :page-sizes="[3, 6, 9]"
          :total="total"
          :pager-count="5"
          layout=" prev, pager, next, jumper, ->,sizes,total"
          @size-change="hanldeSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
      <SpuForm
        v-show="scene == 1"
        @changeScene="changeScene"
        ref="spu"
      ></SpuForm>
      <SkuForm
        v-show="scene == 2"
        ref="sku"
        @changeScene="changeScene"
      ></SkuForm>
    </el-card>
  </div>
</template>
<script>
import SkuForm from "./SkuFrom";
import SpuForm from "./SpuForm";
export default {
  name: "Spu",
  components: {
    SkuForm,
    SpuForm,
  },
  data() {
    return {
      //收集各级id
      category1Id: "",
      category2Id: "",
      category3Id: "",
      page: 1, //当前页
      limit: 3, //每一页展示的数据,
      total: 0, //一共的数据
      spuList: [], //当前页的数据
      scene: 0, //0展示spu数据列表，1展示添加或修改spu，2展示添加sku
      dialogTableVisible: false, //控制对话框的显示和隐藏
      spu: {},
      skuList: [], //存储sku列表数据
      loading: true,
    };
  },
  methods: {
    //三级联动的自定义事件，可以获取子组件的相应的id
    getCategoryId(getCategoryAllId) {
      this.category1Id = getCategoryAllId.id1;
      this.category2Id = getCategoryAllId.id2;
      this.category3Id = getCategoryAllId.id3;
      //获取到各级id后发送请求获取getSpuList数据
      this.getSpuList();
    },
    //获取页面数据
    async getSpuList() {
      let { page, limit, category3Id } = this;
      try {
        let result = await this.$API.spu.reqGetSpuList(
          page,
          limit,
          category3Id
        );
        this.spuList = result.data.records;
        this.total = result.data.total;
      } catch (error) {
        this.$message(error);
      }
    },
    //改变页码时的回调
    handleCurrentChange(pager) {
      this.page = pager;
      this.getSpuList();
    },
    //改变每页展示数据的数量时的回调
    hanldeSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    //添加spu
    addSpu() {
      this.scene = 1;
      this.$refs.spu.addSpuData(this.category3Id);
    },
    //修改某个spu
    updateSpu(row) {
      this.scene = 1;
      this.$refs.spu.initSpuData(row);
    },
    //子组件SpuForm和SkuForm自定义事件的回调
    changeScene({ scene, flag }) {
      //切换场景
      this.scene = scene;
      if (flag == "添加") {
        //如果添加数据，完成后需要回到第一页
        this.handleCurrentChange(1);
      } else if (flag == "修改") {
        //如果修改数据，完成后需要回到当前页
        this.getSpuList();
      } else if (flag == "取消") {
      }
    },
    //删除spu按钮的回调
    async deleteSpu(row) {
      try {
        let result = await this.$API.spu.reqDeleteSpu(row.id);
        if (result.code == 200) {
          //判断当前页面数据是否为一个，是删除后回到前一页，否则停留还是当前页
          if (this.spuList.length > 1) {
            this.getSpuList();
          } else {
            this.handleCurrentChange(this.page - 1);
          }
          this.$message({
            type: "success",
            message: `spu属性名为：${row.spuName}删除成功`,
          });
        }
      } catch (error) {
        this.$message({
          type: "danger",
          message: error,
        });
      }
    },
    //添加sku按钮的回调
    addSku(row) {
      this.scene = 2;
      this.$refs.sku.initSkuData(this.category1Id, this.category2Id, row);
    },
    //展示Sku的列表
    async showSkuList(spu) {
      this.spu = spu;
      this.dialogTableVisible = true;
      let result = await this.$API.spu.reqGetSkuList(spu.id);
      if (result.code == 200) {
        this.skuList = result.data;
        //加载页面隐藏
        this.loading = false;
      }
    },
    //关闭对话框的回调
    close(done) {
      //loading变为真
      this.loading = true;
      //清除数据
      this.skuList = [];
      //关闭对话框
      done();
    },
  },
};
</script>
<style lang="less" scoped></style>
