<template>
  <div class="analysis-container">
    <el-card shadow="hover" class="analysis-card">
      <template #header>
        <div class="card-header">
          <span>数据统计</span>
        </div>
      </template>
      <div class="statistics">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-number">{{ userCount }}</div>
                <div class="stat-label">用户总数</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-number">{{ classCount }}</div>
                <div class="stat-label">班级总数</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-number">{{ maleCount }}</div>
                <div class="stat-label">男生总数</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-number">{{ femaleCount }}</div>
                <div class="stat-label">女生总数</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
    
    <el-card shadow="hover" class="analysis-card">
      <template #header>
        <div class="card-header">
          <span>班级性别比例</span>
        </div>
      </template>
      <div class="chart-container">
        <div id="genderPieChart" ref="genderPieChart" style="width: 100%; height: 400px;"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { getUserList, getClassList } from '@/api/user'
import { getClassList as getClassListApi } from '@/api/class'

export default {
  name: 'Analysis',
  data() {
    return {
      userCount: 0,
      classCount: 0,
      maleCount: 0,
      femaleCount: 0,
      genderData: [],
      chartInstance: null
    }
  },
  mounted() {
    this.initCharts()
    this.fetchData()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    if (this.chartInstance) {
      this.chartInstance.dispose()
    }
  },
  methods: {
    initCharts() {
      this.chartInstance = echarts.init(this.$refs.genderPieChart)
    },
    handleResize() {
      if (this.chartInstance) {
        this.chartInstance.resize()
      }
    },
    fetchData() {
      // 获取用户数据
      getUserList().then(response => {
        if (response.code === 20000) {
          const users = response.data.items
          this.userCount = users.length
          this.maleCount = users.filter(user => user.sex === '男').length
          this.femaleCount = users.filter(user => user.sex === '女').length
        }
      })
      
      // 获取班级数据
      getClassListApi().then(response => {
        if (response.code === 20000) {
          const classes = response.data.items
          this.classCount = classes.length
          this.genderData = classes.map(cls => ({
            name: cls.className,
            male: cls.maleCount || 0,
            female: cls.femaleCount || 0
          }))
          this.updateChart()
        }
      })
    },
    updateChart() {
      if (!this.chartInstance) return
      
      // 准备饼图数据
      const pieData = []
      this.genderData.forEach(cls => {
        pieData.push({
          name: `${cls.name}-男`,
          value: cls.male
        })
        pieData.push({
          name: `${cls.name}-女`,
          value: cls.female
        })
      })
      
      // 设置饼图选项
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          top: 'bottom',
          data: this.genderData.flatMap(cls => [
            `${cls.name}-男`,
            `${cls.name}-女`
          ])
        },
        series: [
          {
            name: '班级性别比例',
            type: 'pie',
            radius: '70%',
            center: ['50%', '50%'],
            data: pieData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            // 设置不同性别的颜色
            itemStyle: {
              color: function(params) {
                const colors = {
                  '男': '#409EFF',
                  '女': '#67C23A'
                }
                return colors[params.name.split('-')[1]]
              }
            }
          }
        ]
      }
      
      this.chartInstance.setOption(option)
    }
  }
}
</script>

<style scoped>
.analysis-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 70px);
}

.analysis-card {
  margin-bottom: 20px;
}

.card-header {
  font-size: 16px;
  font-weight: bold;
}

.statistics {
  margin-top: 20px;
}

.stat-card {
  text-align: center;
  border-radius: 8px;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.stat-content {
  padding: 20px 0;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.chart-container {
  margin-top: 20px;
}
</style>