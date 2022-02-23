<template>
  <fragment>
    <el-container>
      <!-- 头部 -->

      <el-header>
        <div>
          <span>电商后台管理系统</span>
        </div>
        <el-button  type="info" @click="loginout()">退出</el-button>
      </el-header>
      <!-- 主体 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside width="200px">
          <!-- 侧边栏菜单区域 -->
          <el-menu
            background-color="rgb(49, 55, 67)"
            text-color="white"
            active-text-color="rgb(53,155,255)"
            unique-opened
            router
            :default-active="activePath"
          >
            <!-- 一级菜单 -->
            <el-submenu
              :index="item.id + ''"
              v-for="item in menuslist"
              :key="item.id"
            >
              <!-- 一级菜单模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i :class="iconlist[item.id]"></i>
                <!-- 文本 -->
                {{ item.authName }}
              </template>
              <!-- 二级菜单 -->
              <el-menu-item
                :index="'/' + ite.path"
                v-for="ite in item.children"
                :key="ite.id"
                @click="savestate('/' + ite.path)"
              >
                <template slot="title">
                  <!-- 图标 -->
                  <i class="el-icon-menu"></i>
                  <!-- 文本 -->
                  <span>{{ ite.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 主体内容 -->
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </fragment>
</template>

<script>
import http from "@/http/index.js";
export default {
  props: {},
  data() {
    return {
      menuslist: [],
      iconlist: {
        125: "el-icon-s-custom",
        103: "el-icon-s-grid",
        101: "el-icon-s-goods",
        102: "el-icon-s-order",
        145: "el-icon-s-platform",
      },
      activePath: "",
    };
  },

  created () {
    http({
      url: "/menus",
      method: "get",
    }).then((res) => {
      window.sessionStorage.setItem('activePath',res.data.path)
      this.menuslist = res.data;
    });
    this.activePath = window.sessionStorage.getItem("activePath");
  },

  methods: {
    loginout() {
      window.sessionStorage.clear();
      this.$router.push('/login');
      location.reload()
    },
    savestate(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
.el-container {
  height: 100%;
}

.el-header {
  background: rgb(54, 61, 64);
  display: flex;
  justify-content: space-between;
  align-items: center;
  div {
    display: flex;
    align-items: center;
  }
  span {
    color: white;
    font-size: 20px;
  }
}
.el-aside {
  background: rgb(49, 55, 67);
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background: rgb(233, 237, 241);
}
</style>
