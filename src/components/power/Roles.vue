<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-button type="primary" @click="addRoles()">添加角色</el-button>
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', index === 0 ? 'bdtop' : '', 'tantan']"
              v-for="(item, index) in scope.row.children"
              :key="item.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item.id)">{{
                  item.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限和三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[index2 === 0 ? '' : 'bdtop', 'tantan']"
                  v-for="(ite, index2) in item.children"
                  :key="ite.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, ite.id)"
                      >{{ ite.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="it in ite.children"
                      :key="it.id"
                      closable
                      @close="removeRightById(scope.row, it.id)"
                      >{{ it.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showRoles(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRoles(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightList(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%">
      <el-form
        :rules="RolesRules"
        ref="rolesFromRef"
        label-width="100px"
        :model="rolesFrom"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="rolesFrom.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="rolesFrom.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRolesInfo()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色信息 -->
    <el-dialog title="提示" :visible.sync="UpdateDialogVisible" width="50%">
      <el-form ref="updateFormRef" :model="updateForm" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="updateForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="updateForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="UpdateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="fnuUpdateRoles()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog
      title="提示"
      :visible.sync="showSetRightListVisible"
      width="50%"
      @close="clearList()"
    >
      <!-- 树行组件 -->
      <el-tree ref="treeRef" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" :data="rightList" :props="treetProps"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showSetRightListVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRights"
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
      rolesList: [],
      rightList:[],
      addDialogVisible: false,
      RolesRules: {
        roleName: [{ required: true, message: "请输入角色名", tigger: "blur" }],
      },
      rolesFrom: {
        roleName: "",
        roleDesc: "",
      },
      UpdateDialogVisible: false,
      updateForm: {},
      showSetRightListVisible: false,
      treetProps:{
          label:'authName',
          children:'children'
      },
      roleId:'',
    //   默认选中的
      defKeys:[]
    };
  },
  mounted() {
    this.getRolesList();
  },
  methods: {
    //   获取角色列表
    getRolesList() {
      http({
        url: "/roles",
        method: "get",
      }).then((res) => {
        this.rolesList = res.data;
      });
    },
    // 弹出添加角色列表
    addRoles() {
      this.addDialogVisible = true;
    },
    // 添加角色
    addRolesInfo() {
      this.$refs.rolesFromRef.validate((valid) => {
        if (!valid) return;
        http({
          url: "/roles",
          method: "post",
          data: this.rolesFrom,
        }).then((res) => {
          this.addDialogVisible = false;
          this.$message.success("添加成功");
          this.getRolesList();
        });
      });
    },
    // 弹出角色列表 编辑信息
    showRoles(id) {
      this.UpdateDialogVisible = true;
      http({
        url: "/roles/" + id,
        method: "get",
      }).then((res) => {
        this.updateForm = res.data;
      });
    },
    // 修改角色成功
    fnuUpdateRoles() {
      this.$refs.updateFormRef.validate((valid) => {
        if (!valid) return;
        http({
          url: "/roles/" + this.updateForm.roleId,
          method: "put",
          data: this.updateForm,
        }).then((res) => {
          this.$message.success("修改成功");
          this.UpdateDialogVisible = false;
          this.getRolesList();
        });
      });
    },
    // 删除角色
    removeRoles(id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消删除",
        type: "warning",
      })
        .then(() => {
          http({
            url: "/roles/" + id,
            method: "delete",
          }).then((res) => {
            this.$message.success("删除成功");
            this.getRolesList();
          });
        })
        .catch(() => {
          this.$message.info("已取消");
        });
    },
    // 删除权限
    removeRightById(roleid, rightid) {
      // 弹框
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          http({
            url: `roles/${roleid.id}/rights/${rightid}`,
            method: "delete",
          }).then((res) => {
            roleid.children = res.data;
          });
        })
        .catch(() => {
          this.$message.info("已取消");
        });
    },
    // 分配权限
    showSetRightList(role) {
        this.roleId=role.id
        this.showSetRightListVisible = true
        http({
            url:'/rights/tree',
            method:'get'
        }).then(res=>{
            this.rightList=res.data
            this.getLeafKeys(role,this.defKeys)
        })
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存在defKeys数组中
    getLeafKeys(node,arr){
        if(!node.children){
            return arr.push(node.id)
        }
        node.children.forEach(item=>this.getLeafKeys(item,arr))
    },
    clearList(){
        this.defKeys=[]
    },
    async addRights(){
        const keys=[
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        console.log(this.roleId);
        const idStr = keys.join(',')
        console.log(idStr);
        
        http({
            url:`roles/${this.roleId}/rights`,
            data:{
                rids:idStr
            },
            method:'post'
        }).then(res=>{
            console.log(res);
            this.$message.success('分配成功')
            this.getRolesList()
            this.showSetRightListVisible=false
        })

    }
  },
  components: {},
};
</script>

<style scoped lang="less">
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.tantan {
  display: flex;
  align-items: center;
}
</style>
