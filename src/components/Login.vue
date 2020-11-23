<template>
  <div id="login">
      <div class="loginBox">
          <!-- 头像 -->
          <div class="avatarBox">
              <img src="../assets/tr.webp" alt="">
          </div>
          <!-- from登录表单 -->
          <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login_form">
              <!-- 用户名 -->
            <el-form-item prop="username">
                <el-input  v-model="loginForm.username" prefix-icon="iconfont icon-user" ></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password">
                <el-input  v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type='password'></el-input>
            </el-form-item>
            <!-- 按钮 -->
            <el-form-item class="btns">
                <el-button type="primary" @click="loginFormPre">登录</el-button>
                <el-button type="info" @click="loginFormRest">重置</el-button>
            </el-form-item>

          </el-form>
      </div>
  </div>
  
</template>

<script>
export default {
    name:'login',
    data(){
        return {
            //登录数据绑定对象
            loginForm:{
                username:'admin',
                password:'123456'
            },
            //表单验证对象
            loginFormRules:{
                username:[
                    { required: true, message: '请输入登录名称', trigger: 'blur' },
                     { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
                ],
                password:[
                     { required: true, message: '请输入登录密码', trigger: 'blur' },
                     { min: 6, max: 15, message: '长度在 6 到  15个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        // change(event){
        //     this.$forceUpdata()
        // }
        //重置表单恢复为默认
        loginFormRest(){
            this.$refs.loginFormRef.resetFields()
        },
        loginFormPre(){

            this.$refs.loginFormRef.validate(async valid=>{
               
                if(!valid) return; 
                // 解构赋值方式获取data
                const {data:res}=await this.$http.post('login',this.loginForm)
                if(res.meta.status!==200){
                   return   this.$message.error('登录失败')
                }else{
                    this.$message.success('登录成功')
                    //1.将登陆成功后的token保存到客户端的sessionStorage中
                        // 1.1项目中除了登陆之外的其他API接口必须在登录后才能使用
                        // 1.2token只应在网站打开期间生效，所以保存在sessionStorage
                    //2.通过编程式导航跳转后台主页，路径为/home
                    console.log(res);
                        window.sessionStorage.setItem('token',res.data.token);
                        this.$router.push('/home')
                }
                

            })
        }
    }
}
</script>

<style lang='less' scoped>
#login{
    height: 100%;
    width: 100%;
    background: #2b4b6b;
    position: relative;
    background:url('../assets/pic5.png') no-repeat ;
    background-size: cover;
}
.loginBox{
    width: 550px;
    height: 350px;
    background: #fff;
    border-radius: 5px;
    position: absolute;
    left: 50%;
    top: 50%;
    
    transform: translate(-50%,-50%);
    box-shadow: 0 0px 10px rgb(197, 197, 197);

    .avatarBox{
    width: 100px;
    height: 100px;
    border-radius: 50px;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background: #fff;
    overflow: hidden;
    border: 1px solid rgb(219, 215, 215);
    box-shadow: 0 1px 8px rgb(197, 197, 197);

    img{
    width: 100%;
    
}
}
.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding:0 20px;
    box-sizing: border-box;
}

.btns{
    display: flex;
    justify-content: flex-end;
}
}

 
</style>