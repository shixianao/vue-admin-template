const Mock = require('mockjs')

// 生成模拟二手物品数据
const mockGoods = {
  goods: []
}

// 手动生成一些模拟数据
const categories = ['电子产品', '书籍', '运动器材', '服装', '生活用品', '其他']
for (let i = 1; i <= 30; i++) {
  mockGoods.goods.push({
    id: i,
    title: `二手${categories[Math.floor(Math.random() * categories.length)]}${i}`,
    price: parseFloat((Math.random() * 5000 + 10).toFixed(2)),
    category: categories[Math.floor(Math.random() * categories.length)],
    description: `这是一个二手${categories[Math.floor(Math.random() * categories.length)]}的描述，物品状态良好，价格实惠。`,
    image: `https://via.placeholder.com/300x200?text=Goods+${i}`,
    contact: {
      name: Mock.Random.cname(),
      phone: `1${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 100000000)}`
    },
    createTime: Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000) // 30天内的随机时间
  })
}

const goods = [
  // 获取所有物品
  {
    url: '/goods/list',
    type: 'get',
    response: config => {
      const { page = 1, limit = 10 } = config.query
      
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const total = mockGoods.goods.length
      const list = mockGoods.goods.slice(startIndex, endIndex)
      
      return {
        code: 20000,
        data: {
          total,
          list
        }
      }
    }
  },
  
  // 获取单个物品
  {
    url: '/goods/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      const goods = mockGoods.goods.find(good => good.id === parseInt(id))
      
      return {
        code: 20000,
        data: goods
      }
    }
  },
  
  // 发布物品
  {
    url: '/goods/publish',
    type: 'post',
    response: config => {
      const { goods } = config.body
      
      // 生成新的ID
      const newId = Math.max(...mockGoods.goods.map(good => good.id)) + 1
      const newGood = {
        ...goods,
        id: newId,
        createTime: Date.now()
      }
      
      mockGoods.goods.unshift(newGood)
      
      return {
        code: 20000,
        message: '发布成功',
        data: newGood
      }
    }
  }
]

module.exports = goods