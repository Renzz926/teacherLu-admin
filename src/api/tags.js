import request from '@/utils/request-tags'

export const dicNames = {
  "xingbie": "性别",
  "gzdArea": "工作地标签",
  "nianlingcc": "年龄层次",
  "zhichengjb": "职称级别",
  "hunyinzk": "婚姻状况",
  "xueli": "学历人员",
  // "hjArea":"区县户籍人员",
  // "huStreet":"街道户籍人员",
  // "hiCommunity":"村社户籍人员"
}

export var dicOptions = {
  "xingbie": [],
  "hjArea": [],
  "gzdArea": [],
  "nianlingcc": [],
  "zhichengjb": [],
  "hunyinzk": [],
  "huStreet": [],
  "hiCommunity": [],
  "xueli": []
}

export function tagsApi(params) {
  return request({
    url: `/${params.script}`,
    method: "post",
    data: params,
  })
}

