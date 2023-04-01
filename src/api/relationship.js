import request from "@/utils/request-relationship";


export function  relationship(uscc,relationship){
  return request({
    url:"/line_relationship",
    method: "get",
    params: {uscc,relationship}
    }
  )
}

export function  noderelationship(uscc){
  return request({
      url:"/node_relationship",
      method: "get",
      params: uscc
    }
  )
}
