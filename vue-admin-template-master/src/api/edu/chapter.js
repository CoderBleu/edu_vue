import request from '@/utils/request'
export default {
  // 根据课程id获取章节和小节数据列表
  getAllChapterVideo(courseId) {
    return request({
      url: '/eduService/eduChapter/getChapterVideo/' + courseId,
      method: 'get'
    })
  },
  // 添加章节
  addChapter(chapter) {
    return request({
      url: '/eduService/eduChapter/addChapter',
      method: 'post',
      data: chapter
    })
  },
  // 根据id查询章节
  getChapter(chapterId) {
    return request({
      url: '/eduService/eduChapter/getChapterInfo/' + chapterId,
      method: 'get'
    })
  },
  // 修改章节
  updateChapter(chapter) {
    return request({
      url: '/eduService/eduChapter/updateChapter/' + chapter.id,
      method: 'put',
      data: chapter
    })
  },
  // 删除章节
  deleteChapter(chapterId) {
    return request({
      url: '/eduService/eduChapter/' + chapterId,
      method: 'delete'
    })
  }
}