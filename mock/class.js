const Mock = require('mockjs')

const data = Mock.mock({
  'classes|10': [{ 
    id: '@increment',
    name: '@ctitle(5, 10)',
    description: '@cparagraph(1, 3)',
    create_time: '@datetime',
    maleCount: '@integer(10, 30)', // 随机生成男生数量
    femaleCount: '@integer(10, 30)' // 随机生成女生数量
  }]
})

module.exports = [
  {
    url: '/vue-admin-template/class/list',
    type: 'get',
    response: config => {
      const items = data.classes
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  },
  {
    url: '/vue-admin-template/class/create',
    type: 'post',
    response: config => {
      const newClass = config.body
      newClass.id = data.classes.length + 1
      newClass.create_time = Mock.mock('@datetime')
      data.classes.push(newClass)
      return {
        code: 20000,
        data: newClass
      }
    }
  },
  {
    url: '/vue-admin-template/class/update',
    type: 'post',
    response: config => {
      const updatedClass = config.body
      const index = data.classes.findIndex(c => c.id === updatedClass.id)
      if (index !== -1) {
        data.classes[index] = updatedClass
        return {
          code: 20000,
          data: updatedClass
        }
      } else {
        return {
          code: 50000,
          message: '班级不存在'
        }
      }
    }
  },
  {
    url: '/vue-admin-template/class/delete/:id',
    type: 'post',
    response: config => {
      const id = parseInt(config.params.id)
      const index = data.classes.findIndex(c => c.id === id)
      if (index !== -1) {
        data.classes.splice(index, 1)
        return {
          code: 20000,
          data: { success: true }
        }
      } else {
        return {
          code: 50000,
          message: '班级不存在'
        }
      }
    }
  }
]