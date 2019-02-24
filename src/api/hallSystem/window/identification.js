import fetch from 'utils/fetch';

export function  getAccessToken(clientInfo) {
    return fetch({
        url: '/api/hallSystem/window/identification/getAccessToken',
        method: 'get',
        params: clientInfo
    })
}

export function  getCompanyName(companyName) {
    return fetch({
        url: '/api/authenticationSystem/weChat/authentication/getCompanyName',
        method: 'get',
        params: {companyName}
    })
}
export function  getAuthIdByCompanyName(companyName) {
    return fetch({
        url: '/api/authenticationSystem/weChat/authentication/getAuthIdByCompanyName',
        method: 'get',
        params: {companyName}
    })
}
export function  getIdentifyAccessToken(clientInfo) {
    return fetch({
        url: '/api/authenticationSystem/weChat/authentication/getAccessToken',
        method: 'get',
        params: clientInfo
    })
}

export function getCertToken(query) {
    return fetch({
        url: '/api/hallSystem/window/identification/getCertToken',
        method: 'get',
        params:query
    })
}

export function getCertResult(query) {
    return fetch({
        url: '/api/hallSystem/window/identification/getCertResult',
        method: 'get',
        params: query
    })
}
export function getIdentifyCertResult(query) {
    return fetch({
        url: '/api/authenticationSystem/weChat/authentication/getCertResult',
        method: 'get',
        params: query
    })
}

export function getBlueToothConnect(query){
    return fetch({
        url: 'http://localhost:8538/ConnAuthterm',
        method: 'get',
        params: query
    })
}

export function setQrCode(query){
    return fetch({
        url: 'http://localhost:8538/SetQrCode',
        method: 'get',
        params: query
    })
}