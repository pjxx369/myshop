<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <div id="main" style="width:900px;height:500px"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import _ from 'lodash'
import http from "@/http/index.js";
export default {
  props: {},
  data() {
    return {
        options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    };
  },
  mounted() {
    // var myChart = echarts.init(document.getElementById('main'))
    var myChart = echarts.init(document.getElementById('main'));
    http({
        url:'/reports/type/1',
        method:'get'
    }).then(res=>{
        const result = _.merge(res.data,this.options)
        myChart.setOption(result)
    })
    
  },
  methods: {},
  components: {},
};
</script>

<style scoped lang="less">
</style>
