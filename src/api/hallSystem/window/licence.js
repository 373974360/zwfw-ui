import fetch from 'utils/fetch';

export function  getLicenceList(query) {
    return fetch({
        url: '/api/licence/licenceEnter/list',
        method: 'get',
        params: query
    })
}
export function  getLicenceTypeByItemCode(approveCode) {
    return fetch({
        url: '/api/licence/licenceEnter/getLicenceTypeByItemCode',
        method: 'get',
        params: approveCode
    })
}
export function  getLicenseInfoAndPicture(licenseNo) {
    return fetch({
        url: '/api/licence/licenceEnter/getLicenseInfoAndPicture',
        method: 'get',
        params: {licenseNo}
    })
}
export function  createLicenceEnter(licenceEnter) {
    var data = licenceEnter;
    return fetch({
        url: '/api/licence/licenceEnter/create',
        method: 'post',
        data
    })
}

export function  release(jsonParam,phone,personName,itemName) {
    var data ={jsonParam,phone,personName,itemName};
    return fetch({
        url: '/api/licence/licenceEnter/release',
        method: 'post',
        data
    })
}
export function  getPaginateSurfaceByType(licenseTypeCode,holderType,itemCode) {
    return fetch({
        url: '/api/licence/licenceEnter/getPaginateSurfaceByType',
        method: 'get',
        params: {licenseTypeCode,holderType,itemCode}
    })
}
