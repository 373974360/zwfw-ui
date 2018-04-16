import fetch from 'utils/fetch';

export function getFormFieldList(query) {
    return fetch({
        url: '/api/baseSystem/data/formField/list',
        method: 'get',
        params: query
    });
}

export function updateFormField(formField) {
    const data = formField;
    return fetch({
        url: '/api/baseSystem/data/formField/edit',
        method: 'post',
        data
    })
}

export function createFormField(formField) {
    const data = formField;
    return fetch({
        url: '/api/baseSystem/data/formField/add',
        method: 'post',
        data
    })
}

export function delFormFields(ids) {
    const data = {ids};
    return fetch({
        url: '/api/baseSystem/data/formField/dels',
        method: 'post',
        data
    })
}

