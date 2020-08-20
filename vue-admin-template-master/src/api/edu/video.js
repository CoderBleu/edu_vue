import request from '@/utils/request'
export default {

  // 添加小节
  addVideo(video) {
    return request({
      url: '/eduService/eduVideo/addVideo',
      method: 'post',
      data: video
    })
  },

  // 删除小节
  deleteVideo(id) {
    return request({
      url: '/eduService/eduVideo/' + id,
      method: 'delete'
    })
  },

  // 根据小节id回显数据
  findVideoInfoById(id) {
    return request({
      url: '/eduService/eduVideo/findVideoInfoById/' + id,
      method: 'get'
    })
  },

  // 修改小节信息
  updateVideoInfo(video) {
    return request({
      url: '/eduService/eduVideo/updateVideo/' + video.id,
      method: 'put',
      data: video
    })
  },

  // 删除视频
  deleteAliyunVod(videoSourceId) {
    return request({
      url: '/eduVod/video/removeAlyVideo/' + videoSourceId,
      method: 'delete'
    })
  }
}