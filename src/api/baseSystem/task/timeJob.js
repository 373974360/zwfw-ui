import {fetchTask} from 'utils/fetch';

export function getTaskList(query) {
    return fetchTask({
        url: '/task',
        method: 'get',
        params: query
    });
}

export function getTaskInfo(jobName){
    return fetchTask({
        url: '/task/config/' + jobName,
        method: 'get',
        params: {jobName}
    })
}

export function triggerTask(jobName){
    const data = {jobName};
    return fetchTask({
        url: '/task/'+ jobName +'/trigger',
        method: 'post',
        data
    })
}

export function enableTask(jobName){
    return fetchTask({
        url: '/task/'+ jobName +'/disable',
        method: 'delete',
        params: {jobName}
    })
}

export function disableTask(jobName){
    const data = {jobName};
    return fetchTask({
        url: '/task/'+ jobName +'/disable',
        method: 'post',
        data
    })
}

export function shutdownTask(jobName){
    const data = {jobName};
    return fetchTask({
        url: '/task/'+ jobName +'/shutdown',
        method: 'post',
        data
    })
}





