
//昵称
export function getNickName(){
    return localStorage.getItem('nickName');
}
export function setNickName(msg){
    localStorage.setItem('nickName',msg);
}

//用户名
export function getUsername(){
    return localStorage.getItem('username');
}
export function setUsername(msg){
    localStorage.setItem('username',msg);
}

//购物车数量
export function getCartLength(){
    return localStorage.getItem('cartLength');
}
export function setCartLength(msg){
    localStorage.setItem('cartLength',msg);
}

//移除存储信息
export function removeStorage(){
    localStorage.removeItem('nickName');
    localStorage.removeItem('username');
    localStorage.removeItem('cartLength');
}

//管理员账号
export function getAdminName(){
    return localStorage.getItem('adminName');
}
export function setAdminName(msg){
    localStorage.setItem('adminName',msg);
}

