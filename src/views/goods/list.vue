<template>
  <div class="goods-list-container">
    <div class="goods-header">
      <h2>二手物品列表</h2>
      <el-button type="primary" @click="$router.push('/goods/publish')">发布新物品</el-button>
    </div>

    <el-row :gutter="20">
      <el-col v-for="good in goods" :key="good.id" :span="6" class="goods-item">
        <el-card :body-style="{ padding: '0px' }" shadow="hover">
          <img :src="good.image" class="goods-image" alt="物品图片">
          <div class="goods-info">
            <h3 class="goods-title">{{ good.title }}</h3>
            <p class="goods-price">价格: {{ good.price }} 元</p>
            <p class="goods-category">分类: {{ good.category }}</p>
            <p class="goods-description">{{ good.description }}</p>
            <div class="goods-contact">
              <p>联系人: {{ good.contact.name }}</p>
              <p>联系方式: {{ good.contact.phone }}</p>
            </div>
            <div class="goods-meta">
              <span class="goods-time">{{ formatDate(good.createTime) }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getGoodsList } from '@/api/goods'

export default {
  name: 'GoodsList',
  data() {
    return {
      goods: [],
      loading: false
    }
  },
  mounted() {
    this.loadGoods()
  },
  methods: {
    loadGoods() {
      // 从localStorage加载数据
      const goods = localStorage.getItem('secondHandGoods')
      if (goods) {
        this.goods = JSON.parse(goods)
      } else {
        // 如果没有数据，从mock API获取
        this.loadFromApi()
      }
    },
    loadFromApi() {
      this.loading = true
      getGoodsList({ page: 1, limit: 20 }).then(response => {
        this.goods = response.data.list
        localStorage.setItem('secondHandGoods', JSON.stringify(this.goods))
        this.loading = false
      }).catch(error => {
        console.error('获取物品列表失败:', error)
        this.loading = false
      })
    },
    formatDate(time) {
      const date = new Date(time)
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
    }
  }
}
</script>

<style lang="scss" scoped>
.goods-list-container {
  padding: 20px;
}

.goods-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  h2 {
    margin: 0;
    color: #333;
  }
}

.goods-item {
  margin-bottom: 20px;
}

.goods-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.goods-info {
  padding: 15px;
}

.goods-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.goods-price {
  font-size: 20px;
  color: #ff5722;
  margin-bottom: 8px;
}

.goods-category {
  font-size: 14px;
  color: #999;
  margin-bottom: 8px;
}

.goods-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.goods-contact {
  background-color: #f5f7fa;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 10px;
  p {
    margin: 5px 0;
    font-size: 14px;
  }
}

.goods-meta {
  font-size: 12px;
  color: #999;
  text-align: right;
}
</style>
