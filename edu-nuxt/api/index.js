import request from '@/utils/request'

export default {
  //查询热门课程
  getIndexCourse() {
    return request({
      url: '/eduService/indexFront/indexCourse',
      method: 'get'
    })
  },

  //查询名师
  getIndexTeacher() {
    return request({
      url: '/eduService/indexFront/indexTeacher',
      method: 'get'
    })
  }
}