<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear='getGoodList'>
            <el-button slot="append" icon="el-icon-search" @click="getGoodList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table表格区 -->
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格（元）"
          width="120px"
          prop="goods_price"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          width="80px"
          prop="goods_weight"
        ></el-table-column>
        <el-table-column label="创建时间" width="160px" prop="add_time">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import http from "@/http/index.js";
export default {
  props: {},
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      //接收商品列表数据
      goodslist: [],
      total: 0,
    };
  },
  mounted() {
    this.getGoodList();
  },
  methods: {
    //   根据分页获取的商品列表
    getGoodList() {
      http({
        url: "/goods",
        method: "get",
        params: this.queryInfo,
      }).then((res) => {
        this.goodslist = res.data.goods;
        this.total = res.data.total;
      });
    },
    handleSizeChange(newsize){
        this.queryInfo.pagesize = newsize
        this.getGoodList()
    },
    handleCurrentChange(newpage){
        this.queryInfo.pagenum =newpage
        this.getGoodList()
    },
    // 删除商品
    removeById(id){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
            http({
                url:'/goods/'+id,
                method:'delete',
            }).then(res=>{
                this.$message.success('删除成功')
                this.getGoodList()
            }).cath(()=>{
                this.$message.info('已取消')
            })
        })
    },
    goAddpage(){
        this.$router.push('/add')
    }
  },
  components: {},
};
</script>

<style scoped lang="less">
</style>
