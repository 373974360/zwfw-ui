const getters = {
    sidebar: state => state.app.sidebar,
    enums: state => state.app.enums,
    zwfwEnumData: state => state.app.zwfwEnumData,
    dicts: state => state.app.dicts,
    textMap: state => state.app.textMap,
    closeOnClickModal: state => state.app.closeOnClickModal,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    uid: state => state.user.uid,
    account: state => state.user.account,
    introduction: state => state.user.introduction,
    auth_type: state => state.user.auth_type,
    status: state => state.user.status,
    permissions: state => state.user.permissions,
    setting: state => state.user.setting,
    permission_routers: state => state.permission.routers,
    addRouters: state => state.permission.addRouters
};
export default getters
