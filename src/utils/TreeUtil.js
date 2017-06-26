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

TreeUtil.addRow = function(currentRow,data,treeData){
    if(currentRow.id){
        Vue.set(data, 'treePosition', currentRow.treePosition + data.id + "&");
        Vue.set(data, '_parent', currentRow);
        if (currentRow.children) {
            currentRow.children.push(data);
        }else{
            currentRow.children = [data];
        }
    }else{
        treeData.push(data);
        Vue.set(data, 'treePosition', data.id + "&");
    }
}

TreeUtil.delRow = function(currentRow,treeData){
    if(currentRow._parent){
        const index = currentRow._parent.children.indexOf(currentRow);
        currentRow._parent.children.splice(index, 1);
    }else {
        const index = treeData.indexOf(currentRow);
        treeData.splice(index, 1);
    }
}

TreeUtil.getRowById = function(id,treeData){
    for(const node of treeData){
        if(node.children && node.children.length > 0){
            return TreeUtil.getRowById(id,node.children);
        }else{
            if(id === node.id){
                return node;
            }
        }
    }
}

export default TreeUtil