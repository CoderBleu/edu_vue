<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="3" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>

    <div class="ccInfo">
      <img :src="coursePublish.cover" :width="width" lazy>
      <div class="main">
        <h2>{{ coursePublish.title }}</h2>
        <p class="gray"><span>共{{ coursePublish.lessonNum }}课时</span></p>
        <p><span>所属一级分类：{{ coursePublish.subjectParentId }}</span></p>
        <p><span>所属二级分类： {{ coursePublish.subjectId }}</span></p>
        <p>课程讲师：{{ coursePublish.teacherName }}</p>
        <h3 class="red">￥{{ coursePublish.price }}</h3>
      </div>

      <div>
        <el-button @click="previous">返回修改</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="publish">发布课程</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import course from '@/api/edu/course'
export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseId: '',
      coursePublish: {},
      width: '250px'
    }
  },

  created() {
    if (this.$route.params && this.$route.params.id !== undefined) {
      this.courseId = this.$route.params.id
      this.getCoursePublishId()
    }
  },

  methods: {
    previous() {
      console.log('previous')
      this.$router.push({ path: '/edu/course/chapter/' + this.courseId })
    },

    publish() {
      course.publihCourse(this.courseId)
        .then(response => {
          this.$message({
            type: 'success',
            message: '课程发布成功!'
          })
          // 跳转课程列表页面
          this.$router.push({ path: '/edu/course/list' })
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.message
          })
        })
    },

    // 根据课程id查询
    getCoursePublishId() {
      course.getInfo(this.courseId)
        .then(response => {
          this.coursePublish = response.data.publishCourse
        })
    }
  }
}
</script>