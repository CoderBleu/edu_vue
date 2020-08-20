import request from '@/utils/request'

export default {
  // 1. 课程分类列表
  getSubjectList() {
    return request({
      url: `/eduService/subject/getSubjectTree`,
      method: 'get'
    })
  },

  // 2. 查课程分类列表
  getAllSubject(subjectQuery) {
    return request({
      url: `/eduService/subject/getAllSubject`,
      method: 'get',
      data: subjectQuery
    })
  },

  // 3. 按条件查课程分类列表
  getSubjectListCondition(current, limit, subjectQuery) {
    return request({
      url: `/eduService/subject/getSubjectListCondition/${current}/${limit}`,
      method: 'post',
      data: subjectQuery
    })
  },

  // 4. 下载Excel表格
  exportExcel(subjectQuery) {
    return request({
      url: `/eduService/subject/uploadSubject`,
      method: 'get'
    })
  }

}