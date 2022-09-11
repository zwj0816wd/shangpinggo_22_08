import request from "@/utils/request";
//获取一级商品列表
export const reqGetCategory1List = () =>
  request({
    url: `/admin/product/getCategory1`,
    method: "get",
  });
//获取二级商品列表
export const reqGetCategory2List = (category1Id) =>
  request({
    url: `/admin/product/getCategory2/${category1Id}`,
    method: "get",
  });
//获取三级商品列表
export const reqGetCategory3List = (category2Id) =>
  request({
    url: `/admin/product/getCategory3/${category2Id}`,
    method: "get",
  });
//获取三级商品数据
export const reqGetAttrInfoList = (category1Id, category2Id, category3Id) =>
  request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: "get",
  });
//添加属性和属性值
/*data: {
  "attrName": "string", //属性名
  "attrValueList": [
    {
      "attrId": 0,      //属性id
      "valueName": "string" //属性值
    }
  ],
  "categoryId": 0,  //
  "categoryLevel": 3,

} */
export const reqAddOrUpdateAttr = (data) =>
  request({
    url: `/admin/product/saveAttrInfo`,
    method: "post",
    data,
  });
//删除属性（包括属性和属性值）
export const reqDeleteAttr = (id) =>
  request({
    url: `/admin/product/deleteAttr/${id}`,
    method: "delete",
  });
