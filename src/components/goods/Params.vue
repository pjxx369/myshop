<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 警告 -->
      <el-alert
        show-icon
        title="注意，只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
      >
      </el-alert>
      <!-- 商品分类区 -->
      <el-row class="cat_top">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品的级联选择框 -->
          <el-cascader
            v-model="selectCateKeys"
            :options="cateList"
            :props="cateProps"
            expand-trigger="hover"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 页签区 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            :disabled="isBtnDisabled"
            type="primary"
            size="mini"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i,scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 所以列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  @click="showEidtDialog(scope.row.attr_id)"
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteDialog(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            :disabled="isBtnDisabled"
            type="primary"
            size="mini"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i,scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="数据名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEidtDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteDialog(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加动态属性和静态属性对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="110px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改动态属性和静态属性对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="setDialogVisible"
      width="50%"
      @close="setDialogClose"
    >
      <el-form
        :model="setForm"
        :rules="setFormRules"
        ref="setFormRef"
        label-width="110px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="setForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setParams">确 定</el-button>
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
      // 级联所需对象
      cateList: [],
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      selectCateKeys: [],
      activeName: "many",
      onlyTableData: [],
      manyTableData: [],
      addDialogVisible: false,
      addForm: {},
      addFormRules: {
        attr_name: [
          { required: true, mesasage: "请输入参数名称", tigger: "blur" },
        ],
      },
      setDialogVisible: false,
      setForm: {},
      setFormRules: {
        attr_name: [
          { required: true, mesasage: "请输入参数名称", tigger: "blur" },
        ],
      },
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
      }).then((res) => {
        this.cateList = res.data;
      });
    },
    // 级联选择框选中改变函数
    handleChange() {
      if (this.selectCateKeys.length !== 3) {
        this.selectCateKeys = [];
        this.manyTableData=[]
        this.onlyTableData=[]
        return;
      }
      this.getCateData();
    },
    // 页签点击事件
    handleTabClick() {
      this.getCateData();
    },
    // 获取分类数据
    getCateData() {
      http({
        url: `/categories/${this.cateId}/attributes`,
        method: "get",
        params: {
          sel: this.activeName,
        },
      }).then((res) => {
        console.log(res);
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
          item.inputVisible = false;
          item.inputValue = "";
        });
        console.log(res.data);
        if (this.activeName === "many") {
          this.manyTableData = res.data;
        } else {
          this.onlyTableData = res.data;
        }
      });
    },
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    addParams() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return;
        http({
          url: `categories/${this.cateId}/attributes`,
          method: "post",
          data: {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          },
        }).then((res) => {
          console.log(res);
          this.$message.success("添加成功");
          this.addDialogVisible = false;
          this.getCateData();
        });
      });
    },
    // 修改
    showEidtDialog(id) {
      http({
        url: `categories/${this.cateId}/attributes/${id}`,
        method: "get",
        params: {
          attr_sel: this.activeName,
        },
      }).then((res) => {
        this.setForm = res.data;
        this.setDialogVisible = true;
      });
    },
    // 重置
    setDialogClose() {
      this.$refs.setFormRef.resetFields();
    },
    // 点击按钮修改信息
    setParams() {
      this.$refs.setFormRef.validate((valid) => {
        if (!valid) return;

        http({
          url: `categories/${this.cateId}/attributes/${this.setForm.attr_id}`,
          method: "put",
          data: {
            attr_name: this.setForm.attr_name,
            attr_sel: this.activeName,
          },
        }).then((res) => {
          this.$message.success("修改成功");
          this.setDialogVisible = false;
          this.getCateData();
        });
      });
    },
    // 删除参数
    deleteDialog(id) {
      this.$confirm("此操作将永久删除该属性, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        http({
          url: `categories/${this.cateId}/attributes/${id}`,
          method: "delete",
        }).then((res) => {
          this.$message.success("删除成功");
          this.getCateData();
        });
      });
    },
    // 文本框触发事件
    handleInputConfirm(row) {
      if (row.inputValue.trim().length == 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false;
      this.saveAttrVals(row)
    },
    showInput(row) {
      row.inputVisible = true;
      //自动获得焦点
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 删除对应参数可选项
    handleClose(i,row){
      row.attr_vals.splice(i,1)
      this.saveAttrVals(row)
    },
    saveAttrVals(row){
      http({
        url:`categories/${this.cateId}/attributes/${row.attr_id}`,
        method:"put",
        data:{
          attr_name:row.attr_name,
          attr_sel:row.attr_sel,
          attr_vals:row.attr_vals.join(' ')
        }
      }).then(res=>{
        this.$message.success('操作成功')
      })
    }
  },
  computed: {
    //如果按钮需要被禁用返回true 否则返回false
    isBtnDisabled() {
      if (this.selectCateKeys.length !== 3) {
        return true;
      } else {
        return false;
      }
    },
    //   当前选中的三级分类的id
    cateId() {
      if (this.selectCateKeys.length === 3) {
        return this.selectCateKeys[2];
      }
      return null;
    },
    //  动态计算标题文本
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
.cat_top {
  margin: 20px 0;
}
.el-tag {
  margin: 5px;
}
.input-new-tag {
  width: 120px !important;
}
</style>
