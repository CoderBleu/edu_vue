<template>
  <div>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item label="讲师名称" prop="name">
        <el-input v-model="ruleForm.name"/>
      </el-form-item>
      <el-form-item label="讲师排序" prop="sort">
        <el-input-number v-model="ruleForm.sort" :min="0" :max="2" controls-position="right"/>
      </el-form-item>
      <el-form-item label="讲师头衔" prop="level">
        <el-select
          v-model="ruleForm.level"
          clearable
          placeholder="请选择讲师头衔"
        >
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历" prop="intro">
        <el-input
          :autosize="{ minRows: 2, maxRows: 5}"
          v-model="ruleForm.intro"
          type="textarea"/>
      </el-form-item>
      <el-form-item label="讲师简介" prop="career">
        <el-input
          :rows="7"
          v-model="ruleForm.career"
          type="textarea"
          maxlength="300"
          show-word-limit/>
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">

        <!-- 头衔缩略图 -->
        <pan-thumb :image="ruleForm.avatar"/>
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
        </el-button>

        <!--
      v-show：是否显示上传组件
      :key：类似于id，如果一个页面多个图片上传控件，可以做区分
      :url：后台上传的url地址
      @close：关闭上传组件
      @crop-upload-success：上传成功后的回调
        <input type="file" name="file"/>
      -->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API+'/eduOss/fileOss'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"/>
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacher from '@/api/edu/teacher'
// 引入图片上传组件
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  components: { ImageCropper, PanThumb },
  data() {
    // 自定义表单验证
    // var checkSort = (rule, value, callback) => {
    //   const regEmail = /^[0-2]*$/
    //   if (regEmail.test(value)) {
    //     return callback()
    //   }
    //   callback(new Error('请输入合法的排序'))
    // }
    // 定义变量和初始值
    return {
      ruleForm: {
        // 可以给头像写个默认地址，不上传的话，就使用这个
        avatar: ''
      },
      imagecropperShow: false,
      // 上传组件key值
      imagecropperKey: 0,
      // 获取dev.env.js里面的地址
      BASE_API: process.env.BASE_API,
      // 上传按钮是否被禁用
      saveBtnDisabled: false,
      rules: {
        name: [
          { required: true, message: '请输入讲师名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        sort: [
          { required: true, trigger: 'blur' }
        ],
        level: [
          { required: true, message: '请选择讲师头衔', trigger: 'blur' }
        ],
        intro: [
          { required: true, message: '请输入讲师资历', trigger: 'blur' }
        ],
        career: [
          { required: true, message: '请输入讲师简介', trigger: 'blur' },
          { max: 300, message: '最大可输入300个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 关闭上传弹框的方法
    close() {
      this.imagecropperShow = false
      // 上传组件初始化，防止第二次点击的时候提示图片上传成功
      this.imagecropperKey = this.imagecropperKey + 1
    },
    // 上传成功方法
    cropSuccess(data) {
      this.imagecropperShow = false
      // 上传之后接口返回图片地址
      this.ruleForm.avatar = data.url
      this.imagecropperKey = this.imagecropperKey + 1
    },
    onSubmit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          teacher
            .addTeacher(this.ruleForm)
            .then(res => {
              this.updateDialogVisible = false
              this.$message.success('添加' + res.message)
            })
            .catch(err => {
              this.$message.error('添加' + err)
            })
        } else {
          this.$message.error('请完善好表单信息')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.el-form {
  margin: 2% 1% 0 0;
}
</style>