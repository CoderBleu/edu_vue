<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="teacherQuery.name" placeholder="讲师名" />
      </el-form-item>

      <el-form-item>
        <el-select
          v-model="teacherQuery.level"
          clearable
          placeholder="讲师头衔"
        >
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="teacherQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="teacherQuery.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-button
        type="primary"
        icon="el-icon-search"
        @click="getList()"
      >查询</el-button
      >
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 表格 -->
    <el-table :data="list" border fit highlight-current-row>
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">{{
          (page - 1) * limit + scope.$index + 1
        }}</template>
      </el-table-column>

      <el-table-column prop="name" label="名称" width="80" />

      <el-table-column label="头衔" width="80">
        <template slot-scope="scope">{{
          scope.row.level === 1 ? "高级讲师" : "首席讲师"
        }}</template>
      </el-table-column>

      <el-table-column prop="intro" label="资历" />

      <el-table-column prop="gmtCreate" label="添加时间" width="160" />

      <el-table-column prop="sort" label="排序" width="60" />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            type="success"
            size="mini"
            icon="el-icon-edit"
            @click="updateTeacherInfo(scope.row)"
          >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id, scope.row.name)"
          >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getList"
    />

    <!-- 修改讲师信息的弹框 -->
    <el-dialog
      :visible.sync="updateDialogVisible"
      title="修改信息"
      width="60%"
    >
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
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateTeacherById">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// 引入调用teacher.js文件
import teacher from '@/api/edu/teacher'

export default {
  data() {
    // 定义变量和初始值
    return {
      list: null, // 查询之后接口返回集合
      page: 1, // 当前页
      limit: 6, // 每页记录数
      total: 0, // 总记录数
      teacherQuery: {}, // 条件封装对象
      updateDialogVisible: false,
      ruleForm: {},
      rules: {
        name: [
          { required: true, message: '请输入讲师名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请选择讲师排序', trigger: 'blur' }
        ],
        level: [
          { required: true, trigger: 'blur' }
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
  created() {
    // 页面渲染之前执行，一般调用methods定义的方法
    // 调用
    this.getList()
  },
  methods: {
    // 创建具体的方法，调用teacher.js定义的方法
    // 讲师列表的方法
    getList(page = 1) {
      this.page = page
      teacher
        .getTeacherListPage(this.page, this.limit, this.teacherQuery)
        .then((response) => {
          // 请求成功
          // response接口返回的数据
          this.list = response.data.rows
          this.total = response.data.total
        })
    },
    resetData() {
      // 清空的方法
      // 表单输入项数据清空
      this.teacherQuery = {}
      // 查询所有讲师数据
      this.getList()
    },
    // 删除讲师的方法
    removeDataById(id, name) {
      this.$confirm('此操作将永久删除 ' + name + ' 讲师记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定，执行then方法
        // 调用删除的方法
        teacher.deleteTeacherId(id).then((response) => {
          // 删除成功
          // 提示信息
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 回到列表页面
          this.getList()
        })
      }) // 点击取消，执行catch方法
    },
    updateTeacherInfo(row) {
      this.updateDialogVisible = true
      this.ruleForm = row
    },
    updateTeacherById() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          teacher
            .updateTeacherById(this.ruleForm.id, this.ruleForm)
            .then(res => {
              this.updateDialogVisible = false
              this.$message.success('修改' + res.message)
            })
            .catch(err => {
              this.$message.error(err)
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
