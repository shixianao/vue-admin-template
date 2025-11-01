<template>
  <div class="app-container">
    <div class="head-container">
      <h1>用户管理</h1>
      <el-button type="primary" @click="handleAdd">新增用户</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="userList"
      border
      fit
      highlight-current-row
    >
      <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
      <el-table-column prop="name" label="用户姓名" min-width="120"></el-table-column>
      <el-table-column prop="className" label="所属班级" min-width="150"></el-table-column>
      <el-table-column prop="email" label="邮箱" min-width="180"></el-table-column>
      <el-table-column prop="phone" label="电话" min-width="150"></el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="180" align="center"></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>

    <!-- 新增/编辑用户弹窗 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="500px"
      @close="resetForm"
    >
      <el-form :model="formData" :rules="formRules" ref="userForm" label-width="80px">
        <el-form-item label="用户姓名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入用户姓名" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="所属班级" prop="classId">
          <el-select v-model="formData.classId" placeholder="请选择班级">
            <el-option
              v-for="classItem in classOptions"
              :key="classItem.id"
              :label="classItem.name"
              :value="classItem.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入电话" maxlength="11"></el-input>
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
import { getUserList, createUser, updateUser, deleteUser } from '@/api/user'
import { getClassList } from '@/api/class'

export default {
  name: 'UserList',
  data() {
    return {
      userList: [],
      classOptions: [],
      listLoading: true,
      dialogVisible: false,
      dialogTitle: '新增用户',
      currentPage: 1,
      pageSize: 20,
      total: 0,
      formData: {
        id: null,
        name: '',
        classId: null,
        email: '',
        phone: ''
      },
      formRules: {
        name: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        classId: [
          { required: true, message: '请选择所属班级', trigger: 'change' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchClasses()
    this.fetchData()
  },
  methods: {
    fetchClasses() {
      getClassList().then(response => {
        this.classOptions = response.data.items
      }).catch(error => {
        this.$message.error('获取班级列表失败: ' + error.message)
      })
    },
    fetchData() {
      this.listLoading = true
      getUserList({ page: this.currentPage, limit: this.pageSize }).then(response => {
        this.userList = response.data.items
        this.total = response.data.total
        this.listLoading = false
      }).catch(error => {
        this.listLoading = false
        this.$message.error('获取用户列表失败: ' + error.message)
      })
    },
    handleAdd() {
      this.dialogTitle = '新增用户'
      this.resetForm()
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.dialogTitle = '编辑用户'
      this.formData = { ...row }
      this.dialogVisible = true
    },
    handleDelete(row) {
      this.$confirm('确定要删除用户 "' + row.name + '" 吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(row.id).then(() => {
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
        classId: null,
        email: '',
        phone: ''
      }
      if (this.$refs.userForm) {
        this.$refs.userForm.resetFields()
      }
    },
    submitForm() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          const request = this.formData.id ? updateUser(this.formData) : createUser(this.formData)
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
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
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

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.dialog-footer {
  text-align: right;
}
</style>