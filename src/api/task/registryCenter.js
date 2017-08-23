import fetchTask from 'utils/fetchTask';

export function getRegistryCenterList(query) {
    return fetchTask({
        url: '/registryCenter',
        method: 'get',
        params: query
    });
}

export function isExistByName(name){
    return fetchTask({
        url: '/registryCenter/isExist',
        method: 'get',
        params: {name}
    })
}

export function createRegistryCenter(registryCenterVo){
    const data = registryCenterVo;
    return fetchTask({
        url: '/registryCenter',
        method: 'put',
        data
    })
}

export function updateRegistryCenter(registryCenterVo){
    const data = registryCenterVo;
    return fetchTask({
        url: '/registryCenter',
        method: 'post',
        data
    })
}

export function connectRegistryCenter(names){
    const data = {names};
    return fetchTask({
        url: '/registryCenter/connect',
        method: 'post',
        data
    })
}



export function delRegistryCenter(names) {
    return fetchTask({
        url: '/registryCenter',
        method: 'delete',
        params: {names}
    })
}




