<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">主页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <!-- 采用的栅格布局 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="getinfo.query" clearable @clear="getuserList()">
            <el-button slot="append" icon="el-icon-search" @click="getuserList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表数据 -->
      <el-table :data="userList" border style="width: 100%" stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" width="180">
        </el-table-column>
        <el-table-column prop="role_name" label="角色" width="180">
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template v-slot:default="slotscope">
            <el-switch v-model="slotscope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"
              @change="userStateChanged(slotscope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template v-slot:default="slotscope">
            <!-- 这里可以通过作用域插槽把当前行的数据传入进去 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(slotscope.row.id)">
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUserInfo(slotscope.row.id)"></el-button>

            <el-tooltip class="item" effect="dark" content="分配角色" placement="bottom" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="getinfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="getinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加用户dialog 对话框-->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" :before-close="handleClose"
      @close="addFormClosed">

      <!-- 内容主体区 -->
      <!-- rules需要动态绑定 -->
      <el-form ref="addFormRef" :rules="addFormRules" :model="addForm" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户对话框区域 -->

    <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="50%" :before-close="handleClose"
      @close="editClose">
      <!-- 内容主体区 -->
      <!-- rules需要动态绑定 -->
      <el-form ref="editRef" :rules="editRules" :model="editForm" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>

        <el-button type="primary" @click="editUserinfo">确 定</el-button>

      </span>
    </el-dialog>
    <!-- //-------------到底了---------------------- -->
  </div>
</template>

<script>
  export default {
    name: 'user',
    data() {
      //验证手机的自定义规则
      const checkMobile = (rule, value, cb) => {
        const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        if (regMobile.test(value)) {
          cb()
        } else {
          cb(new Error('手机号码格式不正确'))
        }

      }
      //验证邮箱的规则
      const checkEmail = (rule, value, cb) => {
        const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        if (reg.test(value)) {
          cb()
        } else {
          cb(new Error('邮箱格式不正确'))
        }
      }

      return {
        // 用户列表
        userList: [],
        // 获取用户列表的参数对象
        getinfo: {
          query: '',
          pagenum: 1,
          pagesize: 5
        },
        total: 0,
        // 控制添加用户对话框的显示与隐藏
        dialogVisible: false,
        // 编辑用户对话框的显示与隐藏
        editDialogVisible: false,
        // 添加用户的表单数据
        addForm: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        // 编辑用户表单数据对象
        editForm: {

        },
        //添加用户表单验证规则
        addFormRules: {
          username: [{
              required: true,
              message: '请输入用户名',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 8,
              message: '长度在 3 到 8 个字符',
              trigger: 'blur'
            }
          ],
          password: [{
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 8,
              message: '长度在 6到 15 个字符',
              trigger: 'blur'
            }
          ],
          email: [{
              required: true,
              message: '请输入邮箱',
              trigger: 'blur'
            },
            {
              validator: checkEmail,
              trigger: 'blur'
            }
          ],
          mobile: [{
              required: true,
              message: '请输入手机号',
              trigger: 'blur'
            },
            {
              validator: checkMobile,
              trigger: 'blur'
            }
          ]
        },
        //编辑用户表单验证规则
        editRules: {
          email: [{
              required: true,
              message: '请输入邮箱',
              trigger: 'blur'
            },
            {
              validator: checkEmail,
              trigger: 'blur'
            }
          ],
          mobile: [{
              required: true,
              message: '请输入手机号',
              trigger: 'blur'
            },
            {
              validator: checkMobile,
              trigger: 'blur'
            }
          ]
        }
      }

    },
    created() {
      this.getuserList()
    },
    methods: {
      // 获取用户列表数据
      async getuserList() {
        const {
          data: res
        } = await this.$http.get('users', {
          params: this.getinfo
        })
        if (res.meta.status !== 200) return this.$message.error('获取用户数据失败！')
        this.userList = res.data.users;
        // console.log("打印users,res.data",res.data);
        this.total = res.data.total
      },
      // 监听显示每页显示个数
      handleSizeChange(newsize) {

        this.getinfo.pagesize = newsize
        this.getuserList()
      },
      // 监听当前页数
      handleCurrentChange(newpage) {
        this.getinfo.pagenum = newpage
        this.getuserList()
      },
      // 用户状态同步到服务端
      async userStateChanged(userinfo) {
        // console.log(userinfo);
        const {
          data: res
        } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
        if (res.meta.status !== 200) {
          userinfo.mg_state = !userinfo.mg_state;
          return this.$message.error('用户状态修改失败')
        }
        this.$message.success('用户状态修改成功！')
      },
      //dialog关闭图标触发事件
      handleClose() {
        this.dialogVisible = false
        this.editDialogVisible = false
      },
      // 监听用户对话框的关闭事件
      addFormClosed() {
        this.$refs.addFormRef.resetFields()
      },
      // 点击按钮添加新用户
      addUser() {
        //TODO:   表单提交之前都需要预验证！！！！！！！1
        this.$refs.addFormRef.validate(async valid => {
          // console.log(valid);
          const {
            data: res
          } = await this.$http.post('users', this.addForm)
          if (res.meta.status !== 201) return
          this.$message.success('添加用户成功')
          this.dialogVisible = false;
        })
      },
      // 展示编辑用户的对话框

      async showEditDialog(id) {

        const {
          data: res
        } = await this.$http.get(`users/${id}`)
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error('查询用户失败')
        }
        this.$message.success('查询用户成功')
        this.editForm = res.data;
        this.editDialogVisible = true
      },
      //编辑对话框关闭时触发的事件
      editClose() {
        // 关闭对话框重置表单初始内容
        this.$refs.editRef.resetFields();
        this.editDialogVisible = false
      },
      editUserinfo() {
        this.$refs.editRef.validate(async valid => {
          if (!valid) return
          const {
            data: res
          } = await this.$http.put(`users/${this.editForm.id}`, {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          })
          if (res.meta.status !== 200) return this.$message.error('用户信息修改失败')
          this.$message.success("用户信息修改成功")
          // 刷新用户列表
          this.getuserList()
          
        })

        this.editDialogVisible = false
      },
      //删除用户信息
      async deleteUserInfo(id){
        console.log(id);
        // 这里返回的是一个peomise对象，所以可以写成异步操作
        const confirmResult=await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        console.log(confirmResult);
        // 如果点击确定，返回的是一个字符串confirm
        // 如果用户取消操作则返回一个字符串cancle
        if(confirmResult!=='confirm'){
          return this.$message.info('已取消了删除')
        }
        const {data:res}=await this.$http.delete(`users/${id}`)
        if(res.meta.status!=200){return this.$message.error('删除失败')}
        this.$message.success('删除成功')
        this.getuserList()
      }
    },

  }
</script>

<style lang='less' scoped>
  .el-breadcrumb {
    margin-bottom: 10px;
    font-size: 14px;
  }

  .el-row {
    margin-bottom: 10px;
  }

  .el-pagination {
    margin-top: 15px;

  }
</style>