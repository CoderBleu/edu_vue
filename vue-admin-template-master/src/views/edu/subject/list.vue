<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="subjectQuery.title" placeholder="课程分类名" />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="subjectQuery.gmtCreate"
          type="datetime"
          placeholder="选择开始时间"
          default-time="00:00:00"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="subjectQuery.gmtModified"
          type="datetime"
          placeholder="选择截止时间"
          default-time="00:00:00"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>

      <el-button
        type="primary"
        icon="el-icon-search"
        @click="getList()"
      >查询</el-button
      >
      <el-button type="default" @click="resetData()">清空</el-button>
      <el-upload
        ref="upload"
        :before-upload="beforeAvatarUpload"
        :on-success="fileUploadSuccess"
        :on-error="fileUploadError"
        :disabled="importBtnDisabled"
        :limit="1"
        :action="BASE_API+url"
        style="margin-bottom: 1%"
        name="file"
      >
        <el-button slot="trigger" icon="el-icon-upload" type="primary">导入</el-button>
        <el-button icon="el-icon-download" type="danger" @click="exportExcel()">导出</el-button>
      </el-upload>
    </el-form>

    <el-table
      :data="tableData"
      border
      fit
      highlight-current-row
      stripe
      style="width: 100%"
      @expand-change="expandChange">
      <!-- 展开行 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="4">
              <span style="font-weight: bolder;">一级分类</span>
            </el-col>
            <el-col :span="8">
              <span style="font-weight: bolder;">二级分类</span>
            </el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="4">
              <el-tag>{{ scope.row.title }}</el-tag>
              <i class="el-icon-caret-right"/>
            </el-col>
            <el-col :span="8">
              <el-row
                v-for="(item, index) in scope.row.children"
                :key="item.id + '' + index"
                style="margin-bottom: 1rem;">
                <el-col :span="8">
                  <el-tag
                    type="success"
                    closable
                    @close="handleClose(item)">{{ item.title }}</el-tag>
                  <i class="el-icon-caret-right"/>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>

      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">{{
          scope.$index + 1
        }}</template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="分类名"
        width="180"/>
      <el-table-column
        prop="sort"
        label="排序"/>
      <el-table-column
        prop="gmtCreate"
        label="创建时间"/>
      <el-table-column
        prop="gmtModified"
        label="修改时间"/>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            type="success"
            size="mini"
            icon="el-icon-edit"
            @click="updateSubjectInfo(scope.row)"
          >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id)"
          >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getList"
    />
  </div>
</template>

<script>
import subject from '@/api/edu/subject'
export default {

  data() {
    return {
      page: 1, // 当前页
      limit: 6, // 每页记录数
      total: 0, // 总记录数
      // 可以使用 [],不能使用 {}
      tableData: null,
      subjectQuery: {},
      url: '/eduService/subject/addSubject',
      BASE_API: process.env.BASE_API, // 接口API地址
      importBtnDisabled: false // 按钮是否禁用,
    }
  },
  watch: {
  },
  created() {
    this.getAllSubjectList()
  },
  methods: {
    getAllSubjectList() {
      subject.getSubjectListCondition(this.page, this.limit, this.subjectQuery)
        .then(response => {
          this.tableData = response.data.list
          this.total = response.data.total
        })
    },
    resetData() {
      this.subjectQuery = {}
      this.getAllSubjectList()
    },
    // 只能展开一行
    expandChange(row, expandedRows) {
      if (expandedRows.length > 1) {
        expandedRows.shift()
      }
    },
    getList(page = 1) {
      this.page = page
      subject.getSubjectListCondition(this.page, this.limit, this.subjectQuery)
        .then(res => {
          this.tableData = res.data.list
          this.total = res.data.total
        })
    },
    // 上传成功
    fileUploadSuccess(response) {
      // 提示信息
      this.loading = false
      this.$message({
        type: 'success',
        message: '添加课程分类成功'
      })
      // 跳转课程分类列表
      // 路由跳转
    },
    // 上传失败
    fileUploadError() {
      this.loading = false
      this.$message({
        type: 'error',
        message: '添加课程分类失败'
      })
    },
    updateSubjectInfo(data) {

    },
    removeDataById(id) {

    },
    // 点击二级分类的关闭按钮触发
    handleClose(tag) {
      this.$message.success(tag.title.trim())
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    exportExcel() {
      subject.exportExcel()
        .then(res => {
          this.$message.success('下载' + res.message)
        })
        .catch(err => {
          this.$message.success('下载' + err.message)
        })
    },
    // 上传之前调用的方法
    beforeAvatarUpload(file) {
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      if (!isExcel) {
        this.$message.error('上传文件只能是 Excel 格式!')
      }
      return isExcel
    }
  }
}
</script>