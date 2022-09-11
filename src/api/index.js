//将四个模块请求的接口函数同意暴露
import * as tradeMark from "@/api/Product/tradeMark";
import * as attr from "@/api/Product/attr";
import * as spu from "@/api/Product/spu";
import * as sku from "@/api/Product/sku";
//引入权限相关的接口
import permission from "@/api/acl/permission";
import role from "@/api/acl/role";
import * as user from "@/api/acl/user";

export default {
  tradeMark,
  attr,
  spu,
  sku,
  permission,
  role,
  user,
};
