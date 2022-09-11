<template>
  <div>
    <el-form ref="form" label-width="80px" :inline="false" size="normal">
      <el-form-item label="SPU名称">
        <el-input
          placeholder="请输入品牌名称"
          v-model="spuInfo.spuName"
        ></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spuInfo.tmId" placeholder="请选择品牌">
          <el-option
            :value="trademark.id"
            :label="trademark.tmName"
            v-for="trademark in trademarkList"
            :key="trademark.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          rows="5"
          placeholder="SPU描述"
          v-model="spuInfo.description"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="hanldeSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性" size="normal">
        <el-select
          v-model="attrId"
          :placeholder="`还有${unSelectSaleAttr.length}未选择`"
        >
          <el-option
            v-for="unSelect in unSelectSaleAttr"
            :key="unSelect.id"
            :label="unSelect.name"
            :value="unSelect.id"
          >
          </el-option>
        </el-select>
        <el-button
          type="primary"
          size="default"
          icon="el-icon-plus"
          :disabled="!attrId"
          @click="addSaleAttr(attrId)"
          >添加销售属性
        </el-button>
        <el-table
          :data="spuInfo.spuSaleAttrList"
          border
          style="margin-top: 20px"
        >
          <!-- 展示已选择的销售属性 -->
          <el-table-column
            label="序号"
            width="50px"
            align="center"
            type="index"
          >
          </el-table-column>
          <el-table-column label="属性名" width="100px">
            <template v-slot="{ row, $index }">
              {{ row.saleAttrName }}
            </template>
          </el-table-column>
          <el-table-column label="属性名称列表" width="width">
            <template v-slot="{ row, $index }">
              <!-- el-tag时展示已有属性值列表的数据 -->
              <el-tag
                v-for="tag in row.spuSaleAttrValueList"
                :key="tag.id"
                closable
                :disable-transitions="false"
                @close="handleClose(tag.saleAttrValueName, row)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- span和input切换 -->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
                >+ 新属性
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100px" v-slot="{ row, $idnex }">
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteSaleAttr(row)"
            ></el-button>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="$emit('changeScene', { scene: 0, flag: '取消' })"
          >取消</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "SpuForm",
  data() {
    return {
      //控制照片预览显示和隐藏
      dialogVisible: false,
      dialogImageUrl: "",
      //收集未选择的销售属性id
      attrId: "",
      //
      trademarkList: [], //储存品牌列表
      //储存SPU信息
      spuInfo: {
        //三级分类id
        category3Id: 0,
        //描述
        description: "",
        //品牌id
        tmId: "",
        //spu名称
        spuName: "",
        spuImageList: [
          {
            /*  id: 0,
            imgName: "",
            imgUrl: "",
            spuId: 0, */
          },
        ],
        spuSaleAttrList: [
          /*    {
            baseSaleAttrId: 0,
            id: 0,
            saleAttrName: "",
            spuId: 0,
            spuSaleAttrValueList: [
              {
                baseSaleAttrId: 0,
                id: 0,
                isChecked: "",
                saleAttrName: "",
                saleAttrValueName: "",
                spuId: 0,
              },
            ],
          }, */
        ],
      },
      spuImageList: [], //储存SPU图片
      baseSaleAttrList: [], //储存平台全部销售属性
    };
  },
  computed: {
    //计算出还未选择的销售属性
    unSelectSaleAttr() {
      //表示未选择属性数组的集合
      let unSelectSaleAttr = this.baseSaleAttrList.filter((e1) => {
        return this.spuInfo.spuSaleAttrList.every((e2) => {
          return e2.saleAttrName != e1.name;
        });
      });
      //unSelectSaleAttr改变时就将attrId清空，防止已添加的属性仍在未选择的下拉框中
      this.attrId = "";
      return unSelectSaleAttr;
    },
  },
  methods: {
    //照片墙图片删除的回调
    handleRemove(file, fileList) {
      //file为删除的图片数据，fileList为还在展示的图片数据集合
      console.log(file, fileList);
      //收集还在展示的图片数据
      this.spuImageList = fileList;
    },
    //照片墙图片预览的回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      //对话框显示
      this.dialogVisible = true;
    },
    //照片墙图片上传的回调
    hanldeSuccess(response, file, fileList) {
      //收集上传成功后展示的图片数据
      this.spuImageList = fileList;
    },
    //统一获取品牌列表，SPU信息，SPU图片，平台全部销售属性
    async initSpuData(row) {
      try {
        //获取品牌列表
        let trademarkResult = await this.$API.spu.reqGetTrademarkList();
        this.trademarkList = trademarkResult.data;
        //获取SPU信息
        let spuResult = await this.$API.spu.reqGetSpu(row.id);
        this.spuInfo = spuResult.data;
        //为了能单独添加和删除销售属性的属性值，需要加入inputVisible来实现
        /*  this.spuInfo.spuSaleAttrList.forEach((e) => {
          this.$set(e, "inputVisible", false);
          this.$set(e, "inputValue", "");
        }); */
        //获取SPU图片
        let spuImageResult = await this.$API.spu.reqGetSpuImageList(row.id);
        //为了照片前墙能展示，需要加入name和url属性
        spuImageResult.data.forEach((e) => {
          e.name = e.imgName;
          e.url = e.imgUrl;
        });
        this.spuImageList = spuImageResult.data;
        //获取平台全部销售属性
        let baseSaleAttrResult = await this.$API.spu.reqGetBaseSaleAttrList();
        this.baseSaleAttrList = baseSaleAttrResult.data;
      } catch (error) {
        this.$message(error);
      }
    },
    async addSpuData(category3Id) {
      //每次添加需要清空数据，以免再添加页面上显示
      Object.assign(this._data, this.$options.data());
      //清空后需要加上三级分类id
      this.spuInfo.category3Id = category3Id;
      //获取品牌列表
      let trademarkResult = await this.$API.spu.reqGetTrademarkList();
      this.trademarkList = trademarkResult.data;
      //获取平台全部销售属性
      let baseSaleAttrResult = await this.$API.spu.reqGetBaseSaleAttrList();
      this.baseSaleAttrList = baseSaleAttrResult.data;
    },
    //添加销售属性
    addSaleAttr(attrId) {
      let saleAttrName = "";
      if (attrId == 1) {
        saleAttrName = "颜色";
      }
      if (attrId == 2) {
        saleAttrName = "版本";
      }
      if (attrId == 3) {
        saleAttrName = "尺码";
      }
      this.spuInfo.spuSaleAttrList.push({
        baseSaleAttrId: attrId,
        saleAttrName: saleAttrName,
        spuSaleAttrValueList: [],
        inputVisible: false,
      });
    },
    //删除某个属性值即点击X的回调
    handleClose(tag, row) {
      row.spuSaleAttrValueList.splice(row.spuSaleAttrValueList.indexOf(tag), 1);
    },
    //添加新属性值按钮显示input框的回调
    addSaleAttrValue(row) {
      //为了能单独添加和删除销售属性的属性值，需要加入inputVisible来实现
      this.$set(row, "inputVisible", false);
      this.$set(row, "inputValue", "");
      row.inputVisible = true;
      this.$nextTick((_) => {
        //使显示的input框获得焦点
        this.$refs.saveTagInput.focus();
      });
    },
    //在input框添加新属性值后失去焦点或按回车的回调
    handleInputConfirm(row) {
      let { baseSaleAttrId, inputValue } = row;
      //新增的属性值为空则直接回到按钮，不增加属性值
      if (inputValue.trim()) {
        //判断新加的属性值，是否重复
        let result = row.spuSaleAttrValueList.some(
          (e) => e.saleAttrValueName == inputValue
        );
        if (result) {
          this.$message({
            type: "warning",
            message: "属性值不能重复",
          });
          return;
        }
        row.spuSaleAttrValueList.push({
          baseSaleAttrId,
          saleAttrValueName: inputValue,
        });
      }
      row.inputValue = "";
      row.inputVisible = false;
    },
    //删除属性按钮的回调
    deleteSaleAttr(row) {
      this.spuInfo.spuSaleAttrList.splice(
        this.spuInfo.spuSaleAttrList.indexOf(row),
        1
      );
    },
    //保存按钮的回调
    async addOrUpdateSpu() {
      this.spuInfo.spuImageList = this.spuImageList.map((e) => {
        return {
          imgName: e.name,
          imgUrl: e.imgUrl ? e.imgUrl : e.response.data,
        };
      });
      try {
        let result = await this.$API.spu.reqAddOrUpdateSpu(this.spuInfo);
        if (result.code == 200) {
          this.$message({
            type: "success",
            message: this.spuInfo.id ? `修改成功` : "保存成功",
          });
          //如果是添加spu，成功后返回第一页，修改则回到当前页
          this.$emit("changeScene", {
            scene: 0,
            flag: this.spuInfo.id ? "修改" : "添加",
          });
        }
      } catch (error) {
        this.$message({
          type: "danger",
          message: error,
        });
      }
    },
  },
};
</script>
<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
