<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avater_box">
        <img src="@/assets/img/logo.png" alt="" />
      </div>
      <!-- 登录表单 -->
      <el-form class="login_form" :model="form" :rules="loginRules" ref="form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            prefix-icon="el-icon-lock"
            show-password
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button @click="login" type="primary">登录</el-button>
          <el-button @click="resetForm(form)" type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import http from "@/http/index.js";
export default {
  props: {},
  data() {
    return {
      // 登录表单数据对象
      form: {
        username: "admin",
        password: "123456",
      },
      //表单验证规则对象
      loginRules: {
        username: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 2, max: 11, message: "长度在2到11个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    //重置
    resetForm(form) {
      this.$refs["form"].resetFields();
    },
    //登录
    login() {
      http({
        url: "/login",
        method: "post",
        data: this.form,
      }).then((res) => {
        console.log(res);
        //失败与成功弹窗
        if (res.meta.status == 200) {
          this.$message.success("登录成功");
          //储存token
          let  token  = res.data.token;
          window.sessionStorage.setItem("token", token);
          
          this.$router.push('/home')
        } else {
          this.$message.error("登录失败");
        }
      });
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
* {
  margin: 0;
  padding: 0;
}
html,
body {
  width: 100%;
  height: 100%;
}

.login_container {
  height: 100%;
  background-color: #2b4b6b;
  display: flex;
  justify-content: center;
  align-items: center;
  .login_box {
    width: 450px;
    height: 300px;
    background: white;
    border-radius: 3px;
    position: relative;
    .avater_box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-sizing: border-box;
      box-shadow: 0 0 10px #ddd;
      overflow: hidden;
      position: absolute;
      background: white;
      left: 50%;
      transform: translate(-50%, -50%);
      img {
        width: 100%;
        height: 100%;
        background: #ddd;
        z-index: 2;
        border-radius: 50%;
      }
    }
    .login_form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      .btns {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
