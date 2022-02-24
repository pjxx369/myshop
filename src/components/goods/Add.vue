<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <!-- 提示区 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      ></el-alert>
      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tap栏区 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="110px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTableave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                expand-trigger="hover"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyTableDate"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  v-for="(ite, i) in item.attr_vals"
                  :key="i"
                  :label="ite"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action图片要上传的api接口地址 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
              <!-- 富文本编辑器  -->
              <quill-editor v-model="addForm.goods_introduce">

              </quill-editor>
              <el-button class="btnADD" @click="add" type="primary">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="50%"
    >
      <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
import http from "@/http/index.js";
import _ from 'lodash';
export default {
  props: {},
  data() {
    return {
      activeIndex: "0",
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce:'',
        attrs:[]
      },
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", tigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", tigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", tigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", tigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", tigger: "blur" },
        ],
      },
      cateList: [],
      cateProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      manyTableDate: [],
      onlyTableData: [],
      uploadURL: "https://lianghj.top:8888/api/private/v1/upload",
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      previewPath: "",
      previewVisible:false,
    };
  },
  mounted() {
    this.getCateList();
  },
  methods: {
    //   获取所有商品分类
    getCateList() {
      http({
        url: "/categories",
        method: "get",
      }).then((res) => {
        this.cateList = res.data;
      });
    },
    // 级联选择器选中事件
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    beforeTableave(activeName, oldActvieName) {
      if (oldActvieName == "0" && this.addForm.goods_cat.length != 3) {
        this.$message.error("请选择商品分类");
        return false;
      }
    },
    tabClick() {
      // 访问的是商品参数
      if (this.activeIndex === "1") {
        http({
          url: `/categories/${this.addForm.goods_cat[2]}/attributes`,
          method: "get",
          params: {
            sel: "many",
          },
        }).then((res) => {
          res.data.forEach((item) => {
            item.attr_vals =
              item.attr_vals.length === 0 ? [] : item.attr_vals.split(",");
          });
          this.manyTableDate = res.data;
        });
      } else if (this.activeIndex === "2") {
        http({
          url: `/categories/${this.addForm.goods_cat[2]}/attributes`,
          method: "get",
          params: {
            sel: "only",
          },
        }).then((res) => {
            console.log(res);
          this.onlyTableData = res.data;
        });
      }
    },
    handlePreview(file) {
      this.previewPath = file.response.data.url;
      this.previewVisible = true
    },
    handleRemove(file) {
      const filePath = file.response.data.tmp_path;
      let i = this.addForm.pics.findIndex((x) => {
        x.pic === filePath;
      });
      this.addForm.pics.splice(i, 1);
    },
    handSuccess(response) {
      const picInfo = {
        pic: response.data.tmp_path,
      };
      this.addForm.pics.push(picInfo);
    },
    add(){
        this.$refs.addFormRef.validate(valid=>{
            if(!valid) return this.$message.error('请填写必填选项')

            const form = _.cloneDeep(this.addForm)
            form.goods_cat = form.goods_cat.join(',')
            // 处理静态属性和动态参数
            this.manyTableDate.forEach(item=>{
                const newInfo = {
                    attr_id:item.attr_id,
                    attr_vals:item.attr_vals.join(' ')
                }
                this.addForm.attrs.push(newInfo)
            })
            
            this.onlyTableData.forEach(item=>{
                const newInfo ={
                    attr_id:item.attr_id,
                    attr_vals:item.attr_vals
                }
                this.addForm.attrs.push(newInfo)
            })
            form.attrs = this.addForm.attrs
            http({
                url:'/goods',
                method:'post',
                data:form
            }).then(res=>{
                this.$message.success('添加商品成功')
                this.$router.push('/goods')
            })
        })
    }
  },

  components: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
};
</script>

<style scoped lang="less">
.el-steps {
  margin: 20px 0;
}
.el-steps-title {
  font-size: 13px !important;
}
.el-checkbox {
  margin: 0;
}
.previewImg{
    width: 100%;
}
.btnADD{
    margin-top: 20px;
}
</style>
