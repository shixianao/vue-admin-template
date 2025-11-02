<template>
  <div class="goods-publish-container">
    <h2>发布二手物品</h2>

    <el-form ref="publishForm" :model="publishForm" :rules="publishRules" label-width="100px">
      <el-form-item label="物品标题" prop="title">
        <el-input v-model="publishForm.title" placeholder="请输入物品标题" />
      </el-form-item>

      <el-form-item label="物品价格" prop="price">
        <el-input-number v-model="publishForm.price" :min="0.01" :precision="2" :step="0.01" />
      </el-form-item>

      <el-form-item label="物品分类" prop="category">
        <el-select v-model="publishForm.category" placeholder="请选择物品分类">
          <el-option label="电子产品" value="电子产品" />
          <el-option label="书籍" value="书籍" />
          <el-option label="运动器材" value="运动器材" />
          <el-option label="服装" value="服装" />
          <el-option label="生活用品" value="生活用品" />
          <el-option label="其他" value="其他" />
        </el-select>
      </el-form-item>

      <el-form-item label="物品描述" prop="description">
        <el-input v-model="publishForm.description" type="textarea" placeholder="请输入物品描述" :rows="5" />
      </el-form-item>

      <el-form-item label="物品图片">
        <el-upload
          class="avatar-uploader"
          action="#"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handleImageChange"
          accept="image/*"
          :limit="1"
          :before-upload="beforeUpload"
        >
          <img v-if="publishForm.image" :src="publishForm.image" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>

      <el-form-item label="联系人" prop="contact.name">
        <el-input v-model="publishForm.contact.name" placeholder="请输入联系人姓名" />
      </el-form-item>

      <el-form-item label="联系方式" prop="contact.phone">
        <el-input v-model="publishForm.contact.phone" placeholder="请输入联系方式" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">发布物品</el-button>
        <el-button @click="resetForm">重置</el-button>
        <el-button @click="$router.go(-1)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { publishGoods } from '@/api/goods'

export default {
  name: 'GoodsPublish',
  data() {
    const validatePhone = (rule, value, callback) => {
      const phoneReg = /^1[3-9]\d{9}$/
      if (!value) {
        return callback(new Error('请输入联系方式'))
      }
      if (!phoneReg.test(value)) {
        return callback(new Error('请输入正确的手机号码'))
      }
      callback()
    }

    return {
      publishForm: {
        title: '',
        price: 0,
        category: '',
        description: '',
        image: '',
        contact: {
          name: '',
          phone: ''
        }
      },
      publishRules: {
        title: [
          { required: true, message: '请输入物品标题', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入物品价格', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择物品分类', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请输入物品描述', trigger: 'blur' },
          { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
        ],
        'contact.name': [
          { required: true, message: '请输入联系人姓名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        'contact.phone': [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleImageChange(file) {
      // 将图片转换为base64
      this.getBase64(file.raw, (base64) => {
        this.publishForm.image = base64
      })
    },
    getBase64(file, callback) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => callback(reader.result)
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) {
        this.$message.error('只能上传JPG/PNG图片!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过2MB!')
        return false
      }
      return true
    },
    submitForm() {
      this.$refs.publishForm.validate((valid) => {
        if (valid) {
          // 保存到localStorage
          this.saveGoods()
        } else {
          console.log('表单验证失败')
          return false
        }
      })
    },
    saveGoods() {
      // 先调用API发布物品
      publishGoods(this.publishForm).then(response => {
        const newGood = response.data

        // 然后更新localStorage
        const goods = localStorage.getItem('secondHandGoods')
        const goodsList = goods ? JSON.parse(goods) : []
        goodsList.unshift(newGood) // 新发布的物品放在最前面
        localStorage.setItem('secondHandGoods', JSON.stringify(goodsList))

        this.$message.success('物品发布成功')
        this.$router.push('/goods/list')
      }).catch(error => {
        console.error('发布物品失败:', error)
        this.$message.error('发布物品失败')
      })
    },
    resetForm() {
      this.$refs.publishForm.resetFields()
      this.publishForm.image = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.goods-publish-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all .3s;
}

.avatar-uploader:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
