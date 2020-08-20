import request from '@/utils/request'

export default {

  // 1. 讲师列表(条件查询分页)
  getTeacherListPage(current, limit, teacherQuery) {
    return request({
      // url: /eduService/eduTeacher/pageTeacher/' + current + '/' + limit
      url: `/eduService/eduTeacher/pageTeacherCondition/${current}/${limit}`,
      method: 'post',
      // teacherQuery条件对象，后端使用RequestBody获取数据
      // data表示把对象转换json进行传递到接口里面
      data: teacherQuery
    })
  },

  // 2. 逻辑删除讲师列表
  deleteTeacherId(id) {
    return request({
      url: `/eduService/eduTeacher/${id}`,
      method: 'delete'
      // teacherQuery条件对象，后端使用RequestBody获取数据
      // data表示把对象转换json进行传递到接口里面
    })
  },

  // 3. 根据id修改讲师信息
  updateTeacherById(id, teacherQuery) {
    return request({
      url: `/eduService/eduTeacher/${id}`,
      method: 'put',
      data: teacherQuery
    })
  },

  // 4.添加讲师信息
  addTeacher(eduTeacher) {
    return request({
      url: `/eduService/eduTeacher/addTeacher`,
      method: 'post',
      data: eduTeacher
    })
  }
}