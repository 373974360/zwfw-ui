/*
 * @Author: sunlandong
 * @Date:   2017-03-11 12:06:49
 * @Last Modified by:   sunlandong
 * @Last Modified time: 2017-03-11 16:30:03
 */

import Vue from 'vue';
function TreeUtil (data) {
    if (!(this instanceof TreeUtil)) {
        return new TreeUtil(data, null, null)
    }
}


TreeUtil.treeToArray = function (data, parent, level, expandedAll) {
    let tmp = []
    Array.from(data).forEach(function (record) {
        if (record._expanded === undefined) {
            Vue.set(record, '_expanded', expandedAll)
        }
        if (parent) {
            Vue.set(record, '_parent', parent)
        }
        let _level = 0
        if (level !== undefined && level !== null) {
            _level = level + 1
        }
        Vue.set(record, '_level', _level)
        tmp.push(record)
        if (record.children && record.children.length > 0) {
            let children = TreeUtil.treeToArray(record.children, record, _level, expandedAll)
            tmp = tmp.concat(children)
        }
    })
    return tmp
}

TreeUtil.addRow = function(data,treeData){
    Vue.set(data, 'treePosition', data.treePosition + '&' + data.id);
    if(data.parentId != 0){
        const parent = TreeUtil.getRowById(data.parentId,treeData);
        Vue.set(data, '_parent', parent);
        if (parent.children) {
            parent.children.push(data);
        }else{
            parent.children = [data];
        }
    }else{
        treeData.push(data);
    }
}

TreeUtil.editRow = function(data,treeData){
    const old = TreeUtil.getRowById(data.id,treeData);
    TreeUtil.delRow(old,treeData);
    TreeUtil.addRow(data,treeData);
}

TreeUtil.delRow = function(currentRow,treeData){
    currentRow = TreeUtil.getRowById(currentRow.id,treeData);
    if (currentRow._parent){
        const index = currentRow._parent.children.indexOf(currentRow);
        currentRow._parent.children.splice(index, 1);
    } else {
        const index = treeData.indexOf(currentRow);
        treeData.splice(index, 1);
    }
}

TreeUtil.getRowById = function(id, treeData) {
    let result = undefined;
    for (const node of treeData) {
        if (Number(id) === node.id) {
            result =  node;
        }else if (node.children && node.children.length > 0){
            result = TreeUtil.getRowById(id, node.children);
        }
    }
    return result;
}

export default TreeUtil