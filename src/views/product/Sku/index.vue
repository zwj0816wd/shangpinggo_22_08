<template>
  <div>
    <el-table :data="records" border stripe>
      <el-table-column label="序号" type="index" width="80px" align="center">
      </el-table-column>
      <el-table-column label="名称" width="width">
        <template v-slot="{ row, $index }">
          {{ row.skuName }}
        </template>
      </el-table-column>
      <el-table-column label="描述" width="width">
        <template v-slot="{ row, $index }">
          {{ row.skuDesc }}
        </template>
      </el-table-column>
      <el-table-column label="默认图片" width="110px">
        <template v-slot="{ row, $index }">
          <el-image
            :src="row.skuDefaultImg"
            fit="fill"
            :lazy="true"
            style="widows: 80px"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="重量" width="width">
        <template v-slot="{ row, $index }">
          {{ row.weight }}
        </template>
      </el-table-column>
      <el-table-column label="价格（元）" width="110px">
        <template v-slot="{ row, $index }">
          {{ row.price }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="width">
        <template v-slot="{ row, $index }">
          <el-button
            v-if="row.isSale == 0"
            type="success"
            size="mini"
            icon="el-icon-upload2"
            @click="onSale(row)"
          ></el-button>
          <el-button
            v-else
            type="info"
            size="mini"
            icon="el-icon-download"
            @click="cancelSale(row)"
          ></el-button>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="$message('正在开发中')"
          ></el-button>
          <el-button
            type="info"
            size="mini"
            icon="el-icon-info"
            @click="getSkuInfo(row)"
          ></el-button>
          <!-- Drawer抽屉 -->
          <el-drawer :visible.sync="drawer" :show-close="false" size="50%">
            <el-row>
              <el-col :span="5">名称</el-col>
              <el-col :span="16">{{ skuInfo.skuName }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="5">描述</el-col>
              <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="5">价格</el-col>
              <el-col :span="16">{{ skuInfo.price }}元</el-col>
            </el-row>
            <el-row>
              <el-col :span="5">平台属性</el-col>
              <el-col :span="16">
                <el-tag
                  style="margin-right: 10px"
                  type="success"
                  size="mini"
                  v-for="attr in skuInfo.skuAttrValueList"
                  :key="attr.id"
                  >{{ attr.attrId }}-{{ attr.skuId }}
                </el-tag>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">商品图片</el-col>
              <el-col :span="16"
                ><el-carousel height="500px">
                  <el-carousel-item
                    v-for="image in skuInfo.skuImageList"
                    :key="image.id"
                    ><el-image :src="image.imgUrl"></el-image>
                  </el-carousel-item>
                </el-carousel>
              </el-col>
            </el-row>
          </el-drawer>
          <el-popconfirm
            confirm-button-text="好的"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            :title="`你确定确定删除${row.skuName}吗？`"
            @onConfirm="deleteSku(row)"
          >
            <el-button
              style="margin-left: 10px"
              slot="reference"
              type="danger"
              size="mini"
              icon="el-icon-delete"
            ></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align: center"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper , ->,sizes,total"
      :total="total"
      :pager-count="7"
    >
    </el-pagination>
  </div>
</template>
<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1, //储存当前页
      limit: 10, //储存当前页数据量
      total: 0, //储存总数据量
      records: [], //储存sku列表数据
      skuInfo: [], //储存SKU信息
      drawer: false,
    };
  },
  mounted() {
    this.getSpuList();
  },
  methods: {
    //获取sku列表数据
    async getSpuList() {
      let { page, limit } = this;
      let result = await this.$API.sku.reqGetSkuList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    //页码改变的回调函数
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    //页面数据量改变的回调
    handleCurrentChange(pager) {
      this.page = pager;
      this.getSpuList();
    },
    //上架
    async onSale(sku) {
      sku.isSale = 1;
      let result = await this.$API.sku.reqOnSale(sku.id);
      if (result.code == 200) {
        this.$message({
          type: "success",
          message: `${sku.skuName}上架成功`,
        });
        this.getSpuList();
      }
    },
    //下架
    async cancelSale(sku) {
      sku.isSale = 0;
      let result = await this.$API.sku.reqCancelSale(sku.id);
      if (result.code == 200) {
        this.$message({
          type: "success",
          message: `${sku.skuName}下架成功`,
        });
        this.getSpuList();
      }
    },
    //获取sku详情
    async getSkuInfo(sku) {
      this.drawer = true;
      let result = await this.$API.sku.reqGetSkuById(sku.id);
      if (result.code == 200) {
        this.skuInfo = result.data;
      }
    },
    //删除某个sku
    async deleteSku(row) {
      let result = await this.$API.sku.reqDeleteSku(row.id);
      if (result.code == 200) {
        this.$message({
          type: "success",
          message: `删除名SKU称为:${row.skuName}成功`,
        });
        this.getSpuList();
      }
    },
  },
};
</script>
<style scoped>
.el-carousel__item .el-image {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}
>>> .el-carousel__button {
  height: 10px;
  width: 10px;
  background-color: blue;
  border-radius: 50%;
}
</style>
<style scoped>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}
.el-col {
  margin: 10px;
}
</style>
