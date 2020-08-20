<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />

    <el-tree
      ref="tree2"
      :data="data2"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    />

  </div>
</template>

<script>
import subject from '@/api/edu/subject'
export default {

  data() {
    return {
      filterText: '',
      // 返回所有分类数据
      data2: [],
      defaultProps: {
        label: 'title',
        children: 'children'
      }
    }
  },
  watch: {
    filterText(val) {
      // 调用filterNode方法
      this.$refs.tree2.filter(val)
    }
  },
  created() {
    this.getAllSubjectList()
  },
  methods: {
    getAllSubjectList() {
      subject.getSubjectList()
        .then(response => {
          this.data2 = response.data.list
        })
    },
    filterNode(value, data) {
      if (!value) return true
      value = value.trim()
      // 没查到就返回 -1
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
    }
  }
}
</script>