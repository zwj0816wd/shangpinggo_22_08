import request from "@/utils/request";
//获取sku列表数据
export const reqGetSpuList = (page, limit, category3Id) =>
  request({
    url: `/admin/product/${page}/${limit}`,
    method: "get",
    params: {
      category3Id,
    },
  });
//获取品牌列表
export const reqGetTrademarkList = () =>
  request({
    url: `/admin/product/baseTrademark/getTrademarkList`,
    method: "get",
  });
//获取SPU信息
export const reqGetSpu = (spuId) =>
  request({
    url: `/admin/product/getSpuById/${spuId}`,
    method: "get",
  });
//获取SPU图片
export const reqGetSpuImageList = (spuId) =>
  request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: "get",
  });
//获取平台全部销售属性
export const reqGetBaseSaleAttrList = () =>
  request({
    url: `/admin/product/baseSaleAttrList`,
    method: "get",
  });
//获取某个SPU的销售属性
export const reqGetSpuSaleAttrList = (spuId) =>
  request({
    url: `/admin/product/spuSaleAttrList/${spuId}`,
    method: "get",
  });
//添加或修改SPU，对于两者带给服务器的参数大致相同，唯一区分的便时参数携不带携带id属性
export const reqAddOrUpdateSpu = (spuInfo) => {
  if (spuInfo.id) {
    //携带id便是修改数据
    return request({
      url: `/admin/product/updateSpuInfo`,
      method: "post",
      data: spuInfo,
    });
  } else {
    //不携带id便是添加数据
    return request({
      url: `/admin/product/saveSpuInfo`,
      method: "post",
      data: spuInfo,
    });
  }
};
//删除某个SPU
export const reqDeleteSpu = (spuId) =>
  request({
    url: `/admin/product/deleteSpu/${spuId}`,
    method: "delete",
  });

//添加SKU
export const reqAddSku = (skuInfo) =>
  request({
    url: "/admin/product/saveSkuInfo",
    method: "post",
    data: skuInfo,
  });
//获取SKU列表数据
export const reqGetSkuList = (spuId) =>
  request({
    url: `/admin/product/findBySpuId/${spuId}`,
    method: "get",
  });

