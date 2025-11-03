<template>
  <div class="app-container">
    <div class="head-container">
      <h1>班级管理</h1>
      <el-button type="primary" @click="handleAdd">新增班级</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="classList"
      border
      fit
      highlight-current-row
    >
      <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
      <el-table-column prop="name" label="班级名称" min-width="150"></el-table-column>
      <el-table-column prop="description" label="班级描述" min-width="200"></el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="180" align="center"></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑班级弹窗 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="500px"
      @close="resetForm"
    >
      <el-form :model="formData" :rules="formRules" ref="classForm" label-width="80px">
        <el-form-item label="班级名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入班级名称" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="班级描述" prop="description">
          <el-input
            v-model="formData.description"
            placeholder="请输入班级描述"
            type="textarea"
            rows="3"
            maxlength="100"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getClassList, createClass, updateClass, deleteClass } from '@/api/class'

export default {
  name: 'ClassList',
  data() {
    return {
      classList: [],
      listLoading: true,
      dialogVisible: false,
      dialogTitle: '新增班级',
      formData: {
        id: null,
        name: '',
        description: ''
      },
      formRules: {
        name: [
          { required: true, message: '请输入班级名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        description: [
          { max: 100, message: '长度不超过 100 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getClassList().then(response => {
        this.classList = response.data.items
        this.listLoading = false
      }).catch(error => {
        this.listLoading = false
        this.$message.error('获取班级列表失败: ' + error.message)
      })
    },
    handleAdd() {
      this.dialogTitle = '新增班级'
      this.resetForm()
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.dialogTitle = '编辑班级'
      this.formData = { ...row }
      this.dialogVisible = true
    },
    handleDelete(row) {
      this.$confirm('确定要删除班级 "' + row.name + '" 吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteClass(row.id).then(() => {
          this.$message.success('删除成功')
          this.fetchData()
        }).catch(error => {
          this.$message.error('删除失败: ' + error.message)
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    resetForm() {
      this.formData = {
        id: null,
        name: '',
        description: ''
      }
      if (this.$refs.classForm) {
        this.$refs.classForm.resetFields()
      }
    },
    submitForm() {
      this.$refs.classForm.validate((valid) => {
        if (valid) {
          const request = this.formData.id ? updateClass(this.formData) : createClass(this.formData)
          request.then(() => {
            this.$message.success(this.formData.id ? '更新成功' : '创建成功')
            this.dialogVisible = false
            this.fetchData()
          }).catch(error => {
            this.$message.error((this.formData.id ? '更新' : '创建') + '失败: ' + error.message)
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.head-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dialog-footer {
  text-align: right;
}
</style>