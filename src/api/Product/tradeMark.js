import request from '@/utils/request'
//获取品牌列表
export const reqTradeMarkList = (page, limit) => request
    ({
        url: `/admin/product/baseTrademark/${page}/${limit}`,
        method: 'get'
    })
//处理添加品牌(两个参数，品牌名字：tmName，品牌logo：logoUrl)
//处理修改品牌(两个参数，品牌名字：tmName，品牌logo：logoUrl，品牌id：id)
export const reqAddOrUpdateTradeMark = (tradeMark) => {
    if (tradeMark.id) {
        return request({//请求携带id则为修改品牌logo
            url: `/admin/product/baseTrademark/update`,
            method: 'put',
            data: tradeMark
        })
    } else {
        console.log(tradeMark);
        //请求不携带id则为添加品牌logo
        return request({
            url: '/admin/product/baseTrademark/save', method: 'post', data: tradeMark
        })
    }
}
//删除品牌信息
export const reqDeleteTradeMark = (id) => request
    ({
        url: `/admin/product/baseTrademark/remove/${id}`,
        method: 'delete'
    })


