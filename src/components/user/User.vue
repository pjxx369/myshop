<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <div style="margin-top: 15px">
        <el-row :gutter="20">
          <el-col :span="7"
            ><el-input
              placeholder="请输入内容"
              v-model="queryinfo.query"
              clearable
              @clear="found()"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="found(queryinfo.query)"
              ></el-button> </el-input
          ></el-col>
          <el-col :span="4">
            <el-button type="primary" @click="add()">添加用户</el-button>
          </el-col>
        </el-row>
        <!-- 用户列表 -->
        <el-table :data="userlist" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <el-table-column label="电话" prop="mobile"></el-table-column>
          <el-table-column label="角色" prop="role_name"></el-table-column>
          <!-- 状态 -->
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.mg_state"
                @change="userstateChange(scope.row)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                circle
                @click="showEditDialog(scope.row.id)"
              ></el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                circle
                @click="removeUserByid(scope.row.id)"
              ></el-button>
              <el-tooltip
                class="item"
                effect="dark"
                content="分配角色"
                placement="top"
                :enterable="false"
              >
                <el-button
                  size="mini"
                  type="warning"
                  icon="el-icon-setting"
                  circle
                  @click="updateRole(scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 增加用户区 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="moble">
          <el-input v-model="addForm.moble"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户数据 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%">
      <el-form
        ref="editFormRef"
        :rules="editFormRule"
        :model="editForm"
        label-width="80px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色"
     :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleOut"
      >
      <div>
        <p>当前的用户：{{ userInfo.username }}</p>
        <p>当前的角色：{{ userInfo.role_name }}</p>
        <p>
          分配新角色：
          <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo"
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
    var checkEmail = (rule, value, cb) => {
      const regEmail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
      if (regEmail.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法邮箱"));
    };
    var checkMoble = (rule, value, cb) => {
      const regMoble =
        /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMoble.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法手机号"));
    };
    return {
      //获取列表参数
      queryinfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userlist: [],
      total: 0,
      addDialogVisible: false,
      //添加用户的表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        moble: "",
      },
      addRules: {
        username: [
          { required: true, message: "请输入用户名", tigger: "blur" },
          { min: 3, max: 10, message: "长度在3-10个字符", tigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", tigger: "blur" },
          { min: 6, max: 15, message: "长度在6-15个字符", tigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", tigger: "blur" },
          { validator: checkEmail, tigger: "blur" },
        ],
        moble: [
          { required: true, message: "请输入手机", tigger: "blur" },
          { validator: checkMoble, tigger: "blur" },
        ],
      },
      editFormRule: {
        email: [
          { required: true, message: "请输入邮箱", tigger: "blur" },
          { validator: checkEmail, tigger: "blur" },
        ],
        mobile: [{ validator: checkMoble, tigger: "blur" }],
      },
      editDialogVisible: false,
      editForm: {},
      setRoleDialogVisible: false,
      userInfo: {},
      rolesList: [],
      selectRoleId:''
    };
  },
  created() {
    http({
      url: "/users",
      path: "get",
      params: this.queryinfo,
    }).then((res) => {
      console.log(res);
      this.userlist = res.data.users;
      this.total = res.data.total;
    });
  },
  methods: {
    handleSizeChange(newSize) {
      this.queryinfo.pagesize = newSize;
      console.log(this.queryinfo);
      http({
        url: "/users",
        path: "get",
        params: this.queryinfo,
      }).then((res) => {
        this.userlist = res.data.users;
        this.total = res.data.total;
      });
    },
    getUserList() {
      http({
        url: "/users",
        path: "get",
        params: this.queryinfo,
      }).then((res) => {
        this.userlist = res.data.users;
        this.total = res.data.total;
      });
    },
    handleCurrentChange(newPage) {
      this.queryinfo.pagenum = newPage;
      http({
        url: "/users",
        path: "get",
        params: this.queryinfo,
      }).then((res) => {
        this.userlist = res.data.users;
        this.total = res.data.total;
      });
    },
    // 监听switch开关状态
    userstateChange(userinfo) {
      console.log(userinfo);
      http({
        url: `/users/${userinfo.id}/state/${userinfo.mg_state}`,
        method: "put",
      }).then((res) => {
        if (res.meta.status !== 200) {
          userinfo.mg_state = !userinfo.mg_state;
          return;
        }
        this.$message.success("更新成功");
      });
    },
    found(val) {
      http({
        url: "/users",
        path: "get",
        params: this.queryinfo,
      }).then((res) => {
        this.userlist = res.data.users;
        this.total = res.data.total;
      });
    },
    add() {
      this.addDialogVisible = true;
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 添加新用户
    addUser() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return;
        http({
          method: "post",
          url: "/users",
          data: this.addForm,
        }).then((res) => {
          console.log(res);
          if (res.meta.status != 201) {
            this.$message.error("添加失败");
          } else {
            this.$message.success("添加成功");
            this.addDialogVisible = false;
            this.getUserList();
          }
        });
      });
    },
    //编辑信息
    showEditDialog(id) {
      this.editDialogVisible = true;
      http({
        url: "/users/" + id,
        method: "get",
      }).then((res) => {
        if (res.meta.status != 200) {
          this.$message.error("获取失败");
        }
        this.$message.success("获取成功");
        this.editForm = res.data;
      });
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return;
        http({
          url: `users/${this.editForm.id}`,
          method: "put",
          data: {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          },
        }).then((res) => {
          this.getUserList();
        });
      });
      this.editDialogVisible = false;
      this.$message.success("更新用户信息成功");
    },
    //根据Id删除用户信息
    removeUserByid(id) {
      //弹框是否删除
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 删除用户请求
          http({
            url: "/users/" + id,
            method: "delete",
          }).then((res) => {
            this.getUserList();
            this.$message({
              type: "success",
              message: "删除成功",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    updateRole(userInfo) {
      this.userInfo = userInfo;
      http({
        url: "/roles",
        method: "get",
      }).then((res) => {
        this.rolesList = res.data;
        console.log(res);
        console.log(this.userInfo);
      });

      this.setRoleDialogVisible = true;
    },
    saveRoleInfo(){
      if(!this.selectRoleId){
        this.$message.error('请选择要分配的角色')
        return
      }

      http({
        url:`/users/${this.userInfo.id}/role`,
        method:'put',
        data:{
          rid:this.selectRoleId
        }
      }).then(res=>{
        this.$message.success('分配角色成功!')
        this.getUserList()
        this.setRoleDialogVisible = false
      })
    },
    setRoleOut(){
      this.selectRoleId=''
      this.userInfo=''
    }
  },
  components: {},
};
</script>

<style scoped lang="less">
</style>
