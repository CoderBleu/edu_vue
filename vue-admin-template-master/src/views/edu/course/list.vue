<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="courseQuery.title" placeholder="课程名称"/>
      </el-form-item>

      <el-form-item>
        <el-select v-model="courseQuery.status" clearable placeholder="课程状态">
          <el-option value="Normal" label="已发布"/>
          <el-option value="Draft" label="未发布"/>
        </el-select>
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 表格 -->
    <el-table
      :data="list"
      border
      fit
      highlight-current-row>

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="title" label="课程名称" width="400" />

      <el-table-column align="center" label="课程状态" width="180">
        <template slot-scope="scope">
          {{ scope.row.status==='Normal'?'已发布':'未发布' }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="lessonNum" label="课时数"/>

      <el-table-column align="center" prop="gmtCreate" label="添加时间" width="200"/>

      <el-table-column align="center" prop="viewCount" label="浏览数量" width="80" />

      <el-table-column label="操作" width="220" align="center">
        <template slot-scope="scope">
          <router-link :to="'/edu/course/info/'+scope.row.id">
            <el-button :title="baseInfo" type="primary" size="mini" icon="el-icon-edit"/>
          </router-link>
          <router-link :to="'/edu/course/chapter/'+scope.row.id">
            <el-button :title="mainInfo" type="success" size="mini" icon="el-icon-edit"/>
          </router-link>
          <el-button :title="delInfo" type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)"/>
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
// 引入调用teacher.js文件
import course from '@/api/edu/course'

export default {
  data() {
    return {
      list: null,
      page: 1,
      limit: 10,
      total: 0,
      // 条件封装对象
      courseQuery: {},
      baseInfo: '编辑课程基本信息',
      mainInfo: '编辑课程大纲信息',
      delInfo: '删除课程信息'
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 讲师列表的方法
    getList(page = 1) {
      this.page = page
      course.getListCourse(this.page, this.limit, this.courseQuery)
        .then(response => { // 请求成功
          // response接口返回的数据
          this.list = response.data.list
          this.total = response.data.total
        })
    },
    // 清空的方法
    resetData() {
      // 表单输入项数据清空
      this.courseQuery = {}
      // 查询所有讲师数据
      this.getList()
    },
    // 删除课程方法
    removeDataById(id) {
      this.$confirm('确定删除课程吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        course.delCourseById(id)
          .then(response => {
            this.$message.success(response.message)
            this.getList(this.page)
          })
          .catch(err => {
            this.$error.error(err.message)
          })
      })
    }
  }
}
</script>
