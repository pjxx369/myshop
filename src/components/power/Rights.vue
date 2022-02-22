<template>
  <div>
      <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
        <el-table :data="rightsList" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="权限名称" prop="authName"></el-table-column>
            <el-table-column label="路径" prop="path"></el-table-column>
            <el-table-column label="权限等级" prop="level">
                <template slot-scope="scope">
                    <!-- 1级权限 -->
                    <el-tag v-if="scope.row.level==0">一级</el-tag>
                    <!-- 2级权限 -->
                    <el-tag v-else-if="scope.row.level==1" type="success">二级</el-tag>
                    <!-- 3级权限 -->
                    <el-tag v-else type="warning">三级</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
  </div>
</template>

<script>
import http from "@/http/index.js";
export default {
  props: {},
  data() {
    return {
        // 权限列表
        rightsList:[]
    };
  },
  mounted(){
    this.getrightsList()
  },
  methods: {
      getrightsList(){
          http({
              url:'/rights/list',
              method:'get'
          }).then(res=>{
              this.rightsList=res.data
          })
      }
  },
  components: {},
};
</script>

<style scoped lang="less">
</style>
