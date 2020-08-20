<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>

    <el-form label-width="120px">

      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <!-- 所属分类 TODO -->
      <el-form-item label="课程分类">
        <el-cascader
          v-model="selectedOptions"
          :options="subjectList"
          :props="subjectProps"
          size="medium"
          expand-trigger="hover"
          placeholder="请输入要搜索的课程分类"
          clearable
          filterable
          @change="getCheckedNodes"
        />
      </el-form-item>

      <!-- 课程讲师 TODO -->
      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">

          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>

        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description"/>
      </el-form-item>

      <!-- 课程封面-->
      <el-form-item label="课程封面">

        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/eduOss/fileOss'"
          class="avatar-uploader">
          <img :src="courseInfo.cover" style="width: 88px; height: 88px" lazy="true">
        </el-upload>

      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import course from '@/api/edu/course'
import subject from '@/api/edu/subject'
import Tinymce from '@/components/Tinymce' // 引入组件
export default {
  components: {
    Tinymce
  },
  data() {
    return {
      saveBtnDisabled: false,
      courseInfo: {
        title: '',
        subjectId: '', // 二级分类id
        subjectParentId: '', // 一级分类id
        teacherId: '',
        lessonNum: 0,
        description: '',
        cover: 'https://coderblue.cn/images/blue.jpg',
        price: 0
      },
      // 用于级联选择器数据回显
      selectedOptions: [],
      // 回显后的课程的id
      courseId: '',
      BASE_API: process.env.BASE_API, // 接口API地址
      teacherList: [], // 封装所有的讲师
      // 分类列表
      subjectList: [],
      // 查询出来的值对应级联选择器显示的值
      subjectProps: {
        value: 'id',
        label: 'title',
        children: 'children'
      }
    }
  },
  created() {
    // 获取路由id值
    if (this.$route.params && this.$route.params.id !== undefined) {
      this.courseId = this.$route.params.id
      // 调用根据id查询课程的方法
      this.getListTeacher()
      this.getSubjectList()
      // 获取确认后再次返回查看的信息
      this.getInfo(this.courseId)
    } else {
      // 初始化所有讲师
      this.getListTeacher()
      // 查询所有分类列表
      this.getSubjectList()
    }
  },
  methods: {
    getInfo(id) {
      course.getInfo(id)
        .then(response => {
          this.courseInfo = response.data.publishCourse
          this.selectedOptions.push(response.data.publishCourse.subjectParentId)
          this.selectedOptions.push(response.data.publishCourse.subjectId)
        })
    },
    // 上传封面成功调用的方法
    handleAvatarSuccess(res, file) {
      this.courseInfo.cover = res.data.url
    },
    // 上传之前调用的方法
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 查询所有分类列表
    getSubjectList() {
      subject.getSubjectList()
        .then(response => {
          this.subjectList = response.data.list
        })
    },
    // 查询所有的讲师
    getListTeacher() {
      course.getListTeacher()
        .then(response => {
          this.teacherList = response.data.list
        })
    },
    // 级联选择器选中的值
    getCheckedNodes(value) {
      this.courseInfo.subjectParentId = value[0]
      this.courseInfo.subjectId = value[1]
    },
    async saveOrUpdate() {
      if (this.courseId !== '') {
        course.updateInfoById(this.courseId, this.courseInfo)
          .then(response => {
            this.$message({
              type: 'success',
              message: '修改课程信息成功!'
            })
            // 跳转到第二步
            this.$router.push({ path: '/edu/course/chapter/' + this.courseId })
          })
      } else {
        course.addCourseInfo(this.courseInfo)
          .then(response => {
            this.$message({
              type: 'success',
              message: '添加课程信息成功!'
            })
            // 跳转到第二步
            this.$router.push({ path: '/edu/course/chapter/' + response.data.courseId })
          })
      }
    }
  }
}
</script>
