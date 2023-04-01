import request from '@/utils/request-file'

export function download(row) {
    return request({
        url: "/file/download?fileId=" + row,
        method: "get",
        responseType: "blob"
    })
}

export function upload(test,token) {
    return request({
        url: "/file/upload",
        method: "post",
        data: test,
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": token
        },
    })
}

export function changeAnalysis(params,token) {
    return request({
        url: "/file/analysis",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": token
        },
    })
}

export function changeAnalysisRenFan(params,token) {
    return request({
        url: "/file/analysisRenFan",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": token
        },
    })
}

export function changeAnalysisDiQi(params,token) {
    return request({
        url: "/file/analysisDiQi",
        method: "post",
        data: params,
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": token
        },
    })
}
