<template>
  <div class="home_container">
    <!-- 主页布局 -->
    <el-container class="home_container">
      <!-- 侧边栏 -->
      <el-collapse-transition>
        <el-aside :width="isToggle?'60px':'255px'">
          <div>Cloud Admin</div>
          <el-menu background-color="#333744" text-color="#fff" active-text-color="skyblue" :unique-opened="true" router
            :collapse="isToggle" :collapse-transition="false" :default-active="activePath">
            <!-- uqique-opend是否只保持一个子菜单展开 -->
            <!-- default-active是当前激活菜单的索引值，用路径来表示-->
            <!-- 是否使用 vue-router 的模式，启用该模式会在激活导航时以 
            index 作为 path 进行路由跳转 -->

            <!------------ 一级菜单 ------------------ -->
            <!-- 这里index只接受字符串，所以用了拼接字符串的方式来解决 -->
            <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
              <!-- 一级菜单模板区域 -->
              <template slot="title">
                <!-- icon图标 -->
                <!-- 动态绑定一级菜单的calss属性来让每个一个菜单显示不同的图标，用一个对象来存取id ，用中括号来取参-->
                <i :class="iconfont[item.id]"></i>
                <!-- 文本 -->
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单 -->
              <!-- index的值是跳转路径的值 -->
              <el-menu-item :index="'/'+subitem.path" v-for="subitem in item.children" :key="subitem.id"
                @click="saveNavStatus('/'+subitem.path)">
                <!-- 二级菜单模板区域 -->
                <template slot="title">
                  <!-- icon -->
                  <i class="el-icon-menu"></i>
                  <!-- 图标 -->
                  <span>{{subitem.authName}}</span>
                </template>
              </el-menu-item>

            </el-submenu>

          </el-menu>
        </el-aside>
      </el-collapse-transition>
      <!-- container区 -->
      <el-container>
        <!-- 导航栏 -->
        <el-header>
          <el-tooltip class="item" effect="dark" :content="isShowTip" placement="right" :enterable="false">
            <div calss="asideicon" @click="toggleAside">|||</div>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="点击退出" placement="bottom" :enterable="false">
            <el-button class="el-icon-switch-button" @click="logout" circle></el-button>
          </el-tooltip>
        </el-header>
        <!-- 内容区 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {

        // 左侧菜单数据
        menuList: [],
        // 动态显示菜单图标
        iconfont: {
          125: 'iconfont icon-user',
          101: 'iconfont icon-tijikongjian',
          102: 'iconfont icon-shangpin',
          103: 'iconfont icon-danju',
          145: 'iconfont icon-baobiao'
        },
        // 判断侧边栏是否打开或关闭
        isToggle: false,
        // 当前选中菜单路径
        activePath: ''
      }
    },
    computed: {
      // 侧边栏按钮提示
      isShowTip() {
        return this.isToggle ? '打开侧边栏' : '关闭侧边栏'
      }
    },
    created() {
      // home组件渲染完毕就发送请求获取菜单数据
      this.getMneuList()
      this.activePath = window.sessionStorage.getItem('activepath')
    },
    methods: {
      // 退出登录
      logout() {
        window.sessionStorage.clear();
        this.$router.push('/login')
      },
      //请求都是异步操作，所以建议写成异步函数，async是promise的语法糖
      // 获取菜单列表
      async getMneuList() {
        const {
          data: res
        } = await this.$http.get('menus')
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.menuList = res.data
        // console.log("打印用户列表",res);
      },
      // 打开或关闭侧边栏
      toggleAside() {
        this.isToggle = !this.isToggle
      },
      // 显示图标高亮
      saveNavStatus(activepath) {
        window.sessionStorage.setItem("activepath", activepath)
        this.activePath = activepath;
      }


    }
  }
</script>

<style lang='less' scoped>
  .home_container {
    height: 100%;
  }

  .el-header {
    padding-left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    border-bottom: 2px solid rgba(245, 246, 249);

    >div {
      letter-spacing: .2em;
      // background: #666;
      cursor: pointer;
      width: 60px;
      height: 60px;
      text-align: center;
      line-height: 60px;
      font-weight: 600;
    }

    >div:hover {
      color: rgb(130, 184, 255);
      background: rgba(93, 155, 236, 0.199);
      border: 1px solid rgb(130, 184, 255);
      border-radius: 2px;
    }
  }

  .el-aside {
    color: #fff;
    background: rgb(51, 55, 63);

    >div {
      width: 100%;
      height: 60px;
      line-height: 60px;
      text-align: center;
      font-weight: 500;
      font-size: 20px;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .15);
      background-color: #30333c;
    }

    .el-menu {
      border-right: none;
    }
  }

  .el-main {
    background: rgba(245, 246, 249);

  }

  .iconfont {
    margin-right: 10px;
  }
</style>