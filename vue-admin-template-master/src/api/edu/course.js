import request from '@/utils/request'
export default {
  // 1 添加课程信息
  addCourseInfo(courseInfo) {
    return request({
      url: '/eduService/eduCourse/saveCourseInfo',
      method: 'post',
      params: courseInfo
    })
  },
  // 2 查询所有讲师
  getListTeacher() {
    return request({
      url: '/eduService/eduTeacher/findAll',
      method: 'get'
    })
  },
  // 3 查询回显后添加课程的信息
  getInfo(id) {
    return request({
      url: '/eduService/eduCourse/getPublishCourseInfo/' + id,
      method: 'get'
    })
  },
  // 4 修改回显后的课程信息
  updateInfoById(id, courseInfo) {
    return request({
      url: '/eduService/eduCourse/updateCourseInfo/' + id,
      method: 'put',
      data: courseInfo
    })
  },
  // 5 课程最终发布
  publihCourse(id) {
    return request({
      url: '/eduService/eduCourse/publishCourse/' + id,
      method: 'post'
    })
  },
  // 6 课程列表
  getListCourse(current, limit, course) {
    return request({
      url: `/eduService/eduCourse/findList/${current}/${limit}`,
      method: 'post',
      data: course
    })
  },
  // 7 删除课程
  delCourseById(courseId) {
    return request({
      url: `/eduService/eduCourse/${courseId}`,
      method: 'delete'
    })
  }
}
