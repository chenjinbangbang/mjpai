
const getters = {
    nickName: state => state.user.nickName,
    username: state => state.user.username,
    cartLength: state => state.user.cartLength,
    adminName: state => state.admin.adminName
};

export default getters;
