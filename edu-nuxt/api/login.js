import request from '@/utils/request'

export default {
  // 登录
  login(member) {
    return request({
      url: '/userCenter/member/login',
      method: 'post',
      data: member
    })
  },

   //根据token获取用户信息
   getLoginUserInfo() {
    return request({
      url: `/userCenter/member/getMemberInfo`,
      method: 'get'
    })
  }
}