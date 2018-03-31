import request from '@/utils/request';

//获取抽奖的商品列表接口
export function getAwards(){
    return request({
        url: '/goods/award',
        method: 'get',
    });
}

//获取商品列表接口
export function getGoods(data){
    return request({
        url: '/goods/list',
        method: 'get',
        params: data
    });
}

//获取某个商品信息接口
export function getGoodsDetail(data){
    return request({
        url: '/goods/goodsDetail',
        method: 'get',
        params: data
    });
}
