<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>

    <el-button type="text" @click="openChapterDialog()">添加章节</el-button>

    <el-collapse>
      <el-collapse-item
        v-for="(chapter, index) in chapterVideoList"
        :key="chapter.id"
        :name="index + 1"
        class="expandParent">
        <template slot="title">
          <i class="header-icon el-icon-d-arrow-right"/>
          <span style="font-weight: bolder;">章节{{ chapter.sort }}：</span>
          {{ chapter.title }}
          <!-- float: right; -->
          <span style="position: absolute; right: 2%; margin-right: 1rem;">
            <el-button style="" size="mini" type="success" @click="openVideo(chapter.id)">添加小节</el-button>
            <el-button style="" size="mini" type="primary" @click="openEditChatper(chapter.id)">编辑</el-button>
            <el-button size="mini" type="danger" @click="removeChapter(chapter.id)">删除</el-button>
          </span>
        </template>
        <div v-if="chapter.children.length !== 0">
          <div
            v-for="video in chapter.children"
            :key="video.id"
            class="expandDiv">
            <!-- 多选框-批量删除视频
            <el-checkbox-group v-model="checkedVideos" @change="handleCheckedVideosChange">
              <el-checkbox :key="video.title"/>
            </el-checkbox-group> -->
            <i class="header-icon el-icon-view"/>
            <span style="font-weight: bolder;">小节{{ video.sort }}：</span>
            {{ video.title }}
            <span class="acts" style="float: right;margin-right: 2rem;" >
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="editVideo(video.id)"/>
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeVideo(video.id)"/>
            </span>
          </div>
        </div>
        <div v-else>
          <div style="text-align: center;">请先添加小节</div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <div>
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" :title="chapterTitle">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="1" controls-position="right"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" :title="videoTitle">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="1" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="0">免费</el-radio>
            <el-radio :label="1">付费</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API+'/eduVod/video/uploadAlyVideo'"
            :limit="1"
            class="upload-demo">
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">最大支持1G，<br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import chapter from '@/api/edu/chapter'
import video from '@/api/edu/video'

export default {
  data() {
    return {
      saveBtnDisabled: false,
      courseId: '', // 课程id
      chapterVideoList: [],
      chapter: { // 封装章节数据
        title: '',
        sort: 1
      },
      video: {
        title: '',
        sort: 1,
        isFree: 0,
        videoSourceId: '',
        videoOriginalName: ''
      },
      videoTitle: '添加课时',
      chapterTitle: '添加章节',
      dialogChapterFormVisible: false, // 章节弹框
      dialogVideoFormVisible: false, // 小节弹框
      chapterIcon: '<i class="el-icon-edit"></i>',
      fileList: [], // 上传文件列表
      BASE_API: process.env.BASE_API, // 接口API地址
      checkedVideos: [], // 多选框选中的值
      isIndeterminate: true
    }
  },
  created() {
    // 获取路由的id值
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      // 根据课程id查询章节和小节
      this.getChapterVideo(this.courseId)
    }
  },
  methods: {
    handleCheckedVideosChange(val) {
      this.checkedVideos = val
      this.isIndeterminate = false
    },
    // 点击确定调用的方法
    handleVodRemove() {
      // 调用接口的删除视频的方法
      video.deleteAliyunVod(this.video.videoSourceId)
        .then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          // 把文件列表清空
          this.fileList = []
          // 把video视频id和视频名称值清空
          // 上传视频id赋值
          this.video.videoSourceId = ''
          // 上传视频名称赋值
          this.video.videoOriginalName = ''
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    // 点击删除调用这个方法
    beforeVodRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 上传视频成功调用的方法
    handleVodUploadSuccess(response, file, fileList) {
      // 上传视频id赋值
      this.video.videoSourceId = response.data.videoId
      // 上传视频名称赋值
      this.video.videoOriginalName = file.name
    },
    handleUploadExceed() {
      this.$message.warning('想要重新上传视频，请先删除已上传的视频')
    },
    // 修改小节:打开弹窗回显数据
    editVideo(id) {
      this.videoTitle = '修改课时'
      this.dialogVideoFormVisible = true
      video.findVideoInfoById(id)
        .then(res => {
          this.video = res.data.video
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    // 删除小节
    removeVideo(id) {
      const _this = this
      this.$confirm('此操作将删除小节, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 点击确定，执行then方法
        // 调用删除的方法
        video.deleteVideo(id)
          .then(response => { // 删除成功
            // 提示信息
            this.$message({
              type: 'success',
              message: response.message
            })
            // 刷新页面
            this.getChapterVideo(_this.courseId)
          })
          .catch(err => {
            this.$message.error(err.message)
          })
      }) // 点击取消，执行catch方法
    },
    // 添加小节弹框的方法
    openVideo(chapterId) {
      this.dialogVideoFormVisible = true
      const video = {
        title: '',
        sort: 1,
        isFree: 0,
        chapterId: chapterId
      }
      this.video = video
    },
    // 添加小节
    addVideo() {
      // 设置课程id
      this.video.courseId = this.courseId
      video.addVideo(this.video)
        .then(response => {
          // 关闭弹框
          this.dialogVideoFormVisible = false
          // 提示
          this.$message({
            type: 'success',
            message: response.message
          })
          this.getChapterVideo(this.courseId)
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    saveOrUpdateVideo() {
      const _this = this
      if (!this.video.id) {
        this.addVideo()
      } else {
        video.updateVideoInfo(this.video)
          .then(response => {
            this.dialogVideoFormVisible = false
            this.$message({
              type: 'success',
              message: response.message
            })
            this.getChapterVideo(_this.courseId)
          })
          .catch(err => {
            this.$message.error(err.message)
          })
      }
    },

    // ==============================章节操作====================================
    // 删除章节
    removeChapter(chapterId) {
      const _this = this
      this.$confirm('此操作将删除章节, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 点击确定，执行then方法
        // 调用删除的方法
        chapter.deleteChapter(chapterId)
          .then(response => { // 删除成功
            // 提示信息
            this.$message({
              type: 'success',
              message: '删除章节成功'
            })
            // 刷新页面
            this.getChapterVideo(_this.courseId)
          })
      }) // 点击取消，执行catch方法
    },
    // 修改章节弹框数据回显
    openEditChatper(chapterId) {
      // 弹框
      this.chapterTitle = '修改章节'
      this.dialogChapterFormVisible = true
      // 调用接口
      chapter.getChapter(chapterId)
        .then(response => {
          this.chapter = response.data.chapter
        })
    },
    // 弹出添加章节页面
    openChapterDialog() {
      // 表单数据清空
      const chapter = {
        title: '',
        sort: 0
      }
      this.chapter = chapter
      this.dialogChapterFormVisible = true
    },
    // 添加章节
    addChapter() {
      const _this = this
      // 设置课程id到chapter对象里面
      this.chapter.courseId = this.courseId
      chapter.addChapter(this.chapter)
        .then(response => {
          // 关闭弹框
          this.dialogChapterFormVisible = false
          // 提示
          this.$message({
            type: 'success',
            message: response.data.msg
          })
          // 刷新页面
          this.getChapterVideo(_this.courseId)
        })
        .catch(error => {
          this.$message.error(error.data.msg)
        })
    },
    // 修改章节的方法
    updateChapter() {
      const _this = this
      chapter.updateChapter(this.chapter)
        .then(response => {
          // 关闭弹框
          this.dialogChapterFormVisible = false
          // 提示
          this.$message({
            type: 'success',
            message: '修改章节成功'
          })
          // 刷新页面
          this.getChapterVideo(_this.courseId)
        })
    },
    saveOrUpdate() {
      if (!this.chapter.id) {
        this.addChapter()
      } else {
        this.updateChapter()
      }
    },
    // 根据课程id查询章节和小节
    getChapterVideo(courseId) {
      chapter.getAllChapterVideo(courseId)
        .then(response => {
          this.chapterVideoList = response.data.allChapterVideo
        })
    },
    previous() {
      this.$router.push({ path: '/edu/course/info/' + this.courseId })
    },
    next() {
      // 跳转到第三步
      this.$router.push({ path: '/edu/course/publish/' + this.courseId })
    }
  }
}
</script>
<style scoped>
.el-collapse {
    margin-bottom: 2rem;
}
.expandDiv {
  padding: 0.5rem 0 0.5rem 2rem;
  border-top: 1px solid #e7e5e5;
}
</style>
<style>
/* 去掉局部css，加个父级class，避免全局样式污染 */
.expandParent .el-collapse-item__content {
  padding-bottom: 5px;
}
.el-checkbox-group {
  width: 100%;
}
.el-checkbox {
  width: 100%;
}
</style>