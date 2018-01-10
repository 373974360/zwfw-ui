const getters = {
    sidebar: state => state.app.sidebar,
    enums: state => state.app.enums,
    dics: state => state.app.dics,
    textMap: state => state.app.textMap,
    closeOnClickModal: state => state.app.closeOnClickModal,
    uid: state => state.user.uid,
    token: state => state.user.token,
    name: state => state.user.name,
    avatar: state => state.user.avatar,
    deptName: state => state.user.deptName,
    empNo: state => state.user.empNo,
    account: state => state.user.account,
    introduction: state => state.user.introduction,
    permissions: state => state.user.permissions,
    permission_routers: state => state.permission.routers,
    addRouters: state => state.permission.addRouters
};
export default getters
