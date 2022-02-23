<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button @click="showAddCate" type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        class="treeTable"
        show-index
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        index-text="#"
        border
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            style="color: lightgreen"
            v-if="scope.row.cat_deleted === false"
            class="el-icon-success"
          ></i>
          <i style="color: red" v-else class="el-icon-error"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag
            v-else-if="scope.row.cat_level === 1"
            size="mini"
            type="success"
            >二级</el-tag
          >
          <el-tag v-else size="mini" type="warning">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="okt" slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="showUpdateCate(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button size="mini" type="danger" icon="el-icon-delete"
          @click="showDeleteCate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClose"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRulesRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options绑定数据源 -->
          <!-- props指定配置对象 -->
          <el-cascader
            :options="parentCateList"
            :props="cascaderProps"
            expand-trigger="hover"
            v-model="choseCateList"
            @change="parentCateChange"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改分类的对话框 -->
    <el-dialog title="修改分类" :visible.sync="updateDialogVisible" width="50%">
      <el-form
        :model="updateCodeList"
        ref="updateCodeListRef"
        label-width="100px"
      >
        <el-form-item label="分类名称">
            <el-input v-model="updateCodeList.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateCodeChange"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import http from "@/http/index.js";
export default {
  props: {},
  data() {
    return {
      cateList: [],
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "okt",
        },
      ],
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类的名称", trigger: "blur" },
        ],
      },
      parentCateList: [],
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      choseCateList: [],
      updateDialogVisible: false,
      updateCodeList:{}
    };
  },
  mounted() {
    this.getCateList();
  },
  methods: {
    getCateList() {
      http({
        url: "/categories",
        method: "get",
        data: this.querInfo,
      }).then((res) => {
        this.cateList = res.data;
        this.total = res.data.length;
      });
    },
    showAddCate() {
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    getParentCateList() {
      http({
        url: "/categories",
        method: "get",
        params: {
          type: 2,
        },
      }).then((res) => {
        this.parentCateList = res.data;
      });
    },
    parentCateChange() {
      if (this.choseCateList.length > 0) {
        this.addCateForm.cat_pid =
          this.choseCateList[this.choseCateList.length - 1];
        this.addCateForm.cat_level = this.choseCateList.length;
        return;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    addCate() {
      this.$refs.addCateFormRulesRef.validate((valid) => {
        if (!valid) return;
        http({
          url: "/categories",
          method: "post",
          data: this.addCateForm,
        }).then((res) => {
          this.$message.success("添加分类成功");
          this.getCateList()
          this.addCateDialogVisible = false;
        });
      });
    },
    addCateDialogClose() {
      this.$refs.addCateFormRulesRef.resetFields();
      this.choseCateList = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },
    // 修改分类
    showUpdateCate(id) {
      this.updateDialogVisible = true;
      console.log(id);
      http({
          url:'/categories/'+id,
          method:'get'
      }).then(res=>{
          this.updateCodeList = res.data
      })
    },
    updateCodeChange(){
        this.$refs.updateCodeListRef.validate(valid=>{
            if(!valid) return
            http({
                url:'/categories/'+this.updateCodeList.cat_id,
                method:'put',
                data:{cat_name:this.updateCodeList.cat_name}
            }).then(res=>{
                this.$message.success('更改成功')
                this.updateDialogVisible = false
                this.getCateList()
            })
        })
    },
    showDeleteCate(id){
        this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          http({
            url:'/categories/'+id,
            method:'delete'
          }).then(res=>{
            console.log(res);
            if(res.meta.status==200){
              this.$message.success('删除分类成功')
              this.getCateList()
            }else{
              this.$message.error('数据传输错误')
            }
          })
          
        }).catch(()=>{
          this.$message.info('已取消')
        })
    }
  },
  components: {},
};
</script>

<style scoped lang="less">
.treeTable {
  margin-top: 20px;
}
.el-cascader {
  width: 100%;
}
</style>
