<template>
  <el-form ref="form" label-width="100px" :inline="false" size="normal">
    <el-form-item label="SPU名称">{{ spu.spuName }} </el-form-item>
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model.trim="skuInfo.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格（元）">
      <el-input
        type="number"
        placeholder="价格（元）"
        v-model="skuInfo.price"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量（千克）">
      <el-input
        placeholder="重量（千克）"
        v-model.trim="skuInfo.weight"
      ></el-input>
    </el-form-item>
    <el-form-item label="规格描述">
      <el-input
        placeholder="规格描述"
        type="textarea"
        rows="4"
        v-model.trim="skuInfo.skuDesc"
      ></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form
        ref="form"
        label-width="80px"
        :inline="true"
        size="normal"
        style="margin: 0 20px"
      >
        <el-form-item
          :label="attr.attrName"
          style="margin-right: 40px"
          v-for="attr in attrInfoList"
          :key="attr.id"
        >
          <el-select v-model="attr.attrIdAndValueId" placeholder="请选择">
            <el-option
              :label="attrValue.valueName"
              :value="`${attr.id}:${attrValue.id}`"
              v-for="attrValue in attr.attrValueList"
              :key="attrValue.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form
        ref="form"
        label-width="80px"
        :inline="true"
        size="normal"
        style="margin: 0 20px"
      >
        <el-form-item
          :label="saleAttr.saleAttrName"
          v-for="saleAttr in spuSaleAttrList"
          :key="saleAttr.id"
        >
          <el-select
            v-model="saleAttr.saleAttrIdAndValueId"
            placeholder="请选择"
          >
            <el-option
              :label="saleAttrValue.saleAttrValueName"
              :value="`${saleAttr.id}:${saleAttrValue.id}`"
              v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
              :key="saleAttrValue.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片列表">
      <el-table
        :data="spuImageList"
        border
        style="margin-left: 50px"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column width="width" type="selection"> </el-table-column>
        <el-table-column label="图片" width=".width">
          <template v-slot="{ row, $index }">
            <el-image
              :src="row.imgUrl"
              fit="fill"
              :lazy="true"
              style="width: 80px"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="名称" width=".width">
          <template v-slot="{ row, $index }">
            {{ row.imgName }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width=".width">
          <template v-slot="{ row, $index }">
            <el-button
              v-if="row.isDefault == 0"
              type="primary"
              @click="changeDefault(row)"
              >设为默认
            </el-button>
            <el-tag v-else type="success">默认</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="calcel">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  name: "SkuForm",
  data() {
    return {
      //存储spu图片数据
      spuImageList: [],
      //储存spu的销售属性数据
      spuSaleAttrList: [],
      //储存平台属性数据
      attrInfoList: [],
      skuInfo: {
        //父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        price: 0,
        skuName: "",
        weight: "",
        //平台属性
        skuAttrValueList: [
          /*   {
            attrId: 0,
            valueId: 0,
          }, */
        ],
        skuDefaultImg: "",
        skuDesc: "",
        skuImageList: [
          /*    {
            imgName: "string",
            imgUrl: "string",
            isDefault: "string",
            spuImgId: 0,
          }, */
        ],
        //销售属性
        skuSaleAttrValueList: [
          /*      {
            saleAttrId: 0,
            saleAttrValueId: 0,
          }, */
        ],
      },
      spu: {},
      //勾选的图片数据，缺少isDefault属性，提交的时候还要整理
      selectImageList: [],
    };
  },
  methods: {
    //获取相应的数据
    async initSkuData(category1Id, category2Id, spu) {
      //收集父组给的数据
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      this.spu = spu;
      try {
        //获取图片数据
        let result1 = await this.$API.spu.reqGetSpuImageList(spu.id);
        //将传过来的图片数据加上isDefault字段
        result1.data.forEach((e) => {
          e.isDefault = 0;
        });
        this.spuImageList = result1.data;
        //获取销售属性数据
        let result2 = await this.$API.spu.reqGetSpuSaleAttrList(spu.id);
        this.spuSaleAttrList = result2.data;
        //获取平台属性数据
        let result3 = await this.$API.attr.reqGetAttrInfoList(
          category1Id,
          category2Id,
          spu.category3Id
        );
        this.attrInfoList = result3.data;
      } catch (error) {
        this.$message(error);
      }
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    //table表格勾选的回调
    handleSelectionChange(val) {
      //val为所有被改选的图片数据，还没有isDefault属性
      this.selectImageList = val;
    },
    //设为默认的排他操作
    changeDefault(row) {
      this.spuImageList.forEach((e) => {
        e.isDefault = 0;
      });
      row.isDefault = 1;
      //收集默认图片
      this.skuDefaultImg = row.imgUrl;
    },
    //取消按钮的回调
    calcel() {
      this.$emit("changeScene", { scene: 0, flag: "取消" });
      //清除数据，防止添加时显示上次添加的数据
      Object.assign(this._data, this.$options.data());
    },
    async save() {
      //整理数据
      //整理平台数据
      const { attrInfoList, skuInfo, selectImageList } = this;
      /*       attrInfoList.forEach((e) => {
        if (e.attrIdAndValueId) {
          let [attrId, valueId] = e.attrIdAndValueId.split(":").map(Number);
          skuInfo.skuAttrValueList.push({ attrId, valueId });
        }
      }); */
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, e) => {
        if (e.attrIdAndValueId) {
          let [attrId, valueId] = e.attrIdAndValueId.split(":");
          prev.push({ attrId, valueId });
        }
        return prev;
      }, []);
      //整理销售属性数据
      const { spuSaleAttrList } = this;
      spuSaleAttrList.forEach((e) => {
        if (e.saleAttrIdAndValueId) {
          let [saleAttrId, saleAttrValueId] = e.saleAttrIdAndValueId.split(":");
          skuInfo.skuSaleAttrValueList.push({ saleAttrId, saleAttrValueId });
        }
      });
      //整理图片数据
      skuInfo.skuImageList = selectImageList.map((e) => {
        return {
          imgName: e.imgName,
          imgUrl: e.imgUrl,
          isDefault: e.isDefault,
          spuImgId: e.id,
        };
      });
      let result = await this.$API.spu.reqAddSku(skuInfo);
      if ((result.code = 200)) {
        this.$emit("changeScene", { scene: 0, flag: "修改" });
        this.$message({
          type: "success",
          message: `修改SPU:${this.spu.spuName}的SKU属性成功`,
        });
      }
      //清除数据，防止添加时显示上次添加的数据
      Object.assign(this._data, this.$options.data());
    },
  },
};
</script>
<style lang="less" scoped></style>
