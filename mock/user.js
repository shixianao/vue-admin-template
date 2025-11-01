
const Mock = require('mockjs')

// Mock班级数据（用于用户关联）
const classes = Mock.mock({
  'classes|10': [{ 
    id: '@increment',
    name: '@ctitle(5, 10)',
    description: '@cparagraph(1, 3)',
    create_time: '@datetime'
  }]
})

// Mock用户数据
const usersData = Mock.mock({
  'users|50': [{ 
    id: '@increment',
    name: '@cname',
    classId: '@integer(1, 10)', // 关联班级ID
    email: '@email',
    phone: '@phone',
    sex: '@integer(0, 1) === 0 ? "男" : "女"', // 随机生成性别
    create_time: '@datetime'
  }]
})

const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

module.exports = [
  // user login
  {
    url: '/vue-admin-template/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/vue-admin-template/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/vue-admin-template/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  // get user list
  {
    url: '/vue-admin-template/user/list',
    type: 'get',
    response: config => {
      const { page = 1, limit = 20 } = config.query
      const startIndex = (page - 1) * limit
      const endIndex = page * limit
      const total = usersData.users.length
      const items = usersData.users.slice(startIndex, endIndex)

      // 关联班级名称
      const usersWithClass = items.map(user => {
        const className = classes.classes.find(c => c.id === user.classId)?.name || '未分配班级'
        return { ...user, className }
      })

      return {
        code: 20000,
        data: {
          total,
          items: usersWithClass
        }
      }
    }
  },

  // create user
  {
    url: '/vue-admin-template/user/create',
    type: 'post',
    response: config => {
      const newUser = config.body
      newUser.id = usersData.users.length + 1
      newUser.create_time = Mock.mock('@datetime')
      usersData.users.push(newUser)
      return {
        code: 20000,
        data: newUser
      }
    }
  },

  // update user
  {
    url: '/vue-admin-template/user/update',
    type: 'post',
    response: config => {
      const updatedUser = config.body
      const index = usersData.users.findIndex(u => u.id === updatedUser.id)
      if (index !== -1) {
        usersData.users[index] = updatedUser
        return {
          code: 20000,
          data: updatedUser
        }
      } else {
        return {
          code: 50000,
          message: '用户不存在'
        }
      }
    }
  },

  // delete user
  {
    url: '/vue-admin-template/user/delete/:id',
    type: 'post',
    response: config => {
      const id = parseInt(config.params.id)
      const index = usersData.users.findIndex(u => u.id === id)
      if (index !== -1) {
        usersData.users.splice(index, 1)
        return {
          code: 20000,
          data: { success: true }
        }
      } else {
        return {
          code: 50000,
          message: '用户不存在'
        }
      }
    }
  }
]
