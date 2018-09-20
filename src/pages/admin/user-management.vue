<template>
  <div class="page-body">
    <div class="page-header">
      <el-breadcrumb>
        <el-breadcrumb-item :to="{path: '/'}"><i class="fa fa-home"></i></el-breadcrumb-item>
        <el-breadcrumb-item >用户管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="box">
      <el-select v-model="searchForm.roleCode" size="small" clearable placeholder="角色" style="width: 150px">
        <el-option
          v-for="item in roleTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="searchForm.status" size="small" clearable placeholder="状态" style="width: 150px">
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input placeholder="手机号" size="small" v-model="searchForm.mobilePhoneLike" style="width: 150px" clearable/>
      <el-input placeholder="用户名" size="small" v-model="searchForm.userNameLike" style="width: 150px" clearable/>
      <p></p>
      <m-button type="info" size="small" @click="handleSearch"><i class="fa fa-search"> 搜索</i></m-button>
      <m-button type="info" size="small" @click="handleShowAddForm(null)"><i class="fa fa-plus"> 添加</i></m-button>
      <p></p>
      <el-table :data="tableData" style="width: 100% ">
        <el-table-column prop="id" label="ID" align="center" width="50px"></el-table-column>
        <el-table-column prop="userName" label="用户名" width="120"></el-table-column>
        <el-table-column prop="nickName" label="昵称" width="150"></el-table-column>
        <el-table-column prop="mobilePhone" label="电话" width="150"></el-table-column>
        <el-table-column prop="roleCode" label="角色" width="150"></el-table-column>
        <el-table-column prop="lastLoginTime" :formatter="dateFormatter" label="最近登陆时间" width="200"></el-table-column>
        <el-table-column label="账户状态" fixed="right">
          <template slot-scope="scope">
            <el-switch
              @change="handleChangeStatus($event,scope.row.id)"
              v-model="scope.row.status"
              :active-value="0"
              :inactive-value="1"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="150">
          <template slot-scope="scope">
            <el-button @click="handleShowAddForm(scope.row)" type="text">编辑</el-button>
            <el-button @click="handleDeleteUser (scope.row.id)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <p></p>
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleClickPage"
                     :current-page="searchForm.currentPage"
                     :page-sizes="[10, 20, 30, 40]"
                     :page-size="searchForm.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="addFormDialog.title" :visible.sync="addFormDialog.visible">
      <el-form ref="form" :label-width="addFormDialog.formLabelWidth" :model="addFormDialog.form">
        <el-form-item label="用户名" >
          <el-input size="small" v-model="addFormDialog.form.userName" autocomplete="off" :disabled="!addFormDialog.isAdd"
                    :style="{width: this.addFormDialog.formInputWidth}"></el-input>
        </el-form-item>
        <el-form-item label="昵称" >
          <el-input size="small" v-model="addFormDialog.form.nickName" autocomplete="off"
                    :style="{width: this.addFormDialog.formInputWidth}"></el-input>
        </el-form-item>
        <el-form-item label="密码" >
          <el-input size="small" v-model="addFormDialog.form.password" autocomplete="off" :disabled="!addFormDialog.isAdd"
                    :style="{width: this.addFormDialog.formInputWidth}"></el-input>
        </el-form-item>
        <el-form-item label="头像" >
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-change='changeUpload'
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="addFormDialog.form.portrait" :src="addFormDialog.form.portrait" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="手机" >
          <el-input size="small" v-model="addFormDialog.form.mobilePhone" autocomplete="off"
                    :style="{width: this.addFormDialog.formInputWidth}"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" >
          <el-input size="small" v-model="addFormDialog.form.email" autocomplete="off"
                    :style="{width: this.addFormDialog.formInputWidth}"></el-input>
        </el-form-item>
        <el-form-item label="用户类型" >
          <el-select v-model="addFormDialog.form.roleCode" clearable placeholder="角色"
                     :style="{width: this.addFormDialog.formInputWidth}">
            <el-option
              v-for="item in roleTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="个人简介" >
          <el-input size="small" type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="addFormDialog.form.description"
                    autocomplete="off"
                    :style="{width: this.addFormDialog.formInputWidth}"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="addFormDialog.visible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="addFormDialog.isAdd ? handleAddUser() : handleUpdateUser()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        statusOptions: [
          {
            value: 0,
            label: '启用'
          },
          {
            value: 1,
            label: '禁用'
          }
        ],
        roleTypeOptions: [],
        tableData: [],
        total: 0,
        searchForm: {
          'status': '',
          'roleCode': '',
          'mobilePhoneLike': '',
          'userNameLike': '',
          'currentPage': 1,
          'pageSize': 10
        },
        // 用户添加|修改表单 对话框属性
        addFormDialog: {
          visible: false,
          title: '',
          isAdd: '',
          formLabelWidth: '100px',
          formInputWidth: '300px',
          form: {
            'id': '',
            'userName': '',
            'password': '',
            'portrait': '',
            'nickName': '',
            'mobilePhone': '',
            'email': '',
            'roleCode': '',
            'description': ''
          }
        }
      }
    },
    mounted () {
      this.handleSearch()
      this.handleRoleTypeOptions()
    },
    methods: {
      // 初始化数据
      handleSearch () {
        let self = this
        let url = self.$api.userList
        let succeed = function (res) {
          self.tableData = res.data.list
          self.total = res.data.total
        }
        self.$axiosPOST(url, self.searchForm, succeed)
      },
      // 显示添加用户的form
      handleShowAddForm (row) {
        if (row === undefined || row === null) {
          this.addFormDialog.title = '添加用户'
          this.addFormDialog.isAdd = true
          this.addFormDialog.form = {
            'id': '',
            'userName': '',
            'password': '',
            'portrait': '',
            'nickName': '',
            'mobilePhone': '',
            'email': '',
            'roleCode': '',
            'description': ''
          }
        } else {
          this.addFormDialog.title = '修改用户'
          this.addFormDialog.isAdd = false
          this.addFormDialog.form = {
            'id': row.id,
            'userName': row.userName,
            'password': row.password,
            'portrait': row.portrait,
            'nickName': row.nickName,
            'mobilePhone': row.mobilePhone,
            'email': row.email,
            'roleCode': row.roleCode,
            'description': row.description
          }
        }
        this.addFormDialog.visible = true
      },
      // 用户添加
      handleAddUser () {
        let self = this
        let url = self.$api.register
        let succeed = function (res) {
          self.$message('添加成功')
          self.handleSearch()
          self.addFormDialog.visible = false
        }
        self.$axiosPOST(url, this.addFormDialog.form, succeed)
      },
      // 用户删除
      handleDeleteUser (id) {
        let self = this
        this.$alert('删除后不可恢复！确定删除？','警告', {
          type: 'warning'
        }).then(res => {
          let url = self.$api.userDelete + '/' + id
          let succeed = function (res) {
            self.$message('删除成功')
            self.handleSearch()
          }
          self.$axiosPOST(url, {}, succeed)
        })
      },
      // 用户修改
      handleUpdateUser () {
        let self = this
        let url = self.$api.userUpdate
        let succeed = function (res) {
          self.$message('修改成功')
          self.handleSearch()
          self.addFormDialog.visible = false
        }
        self.$axiosPOST(url, this.addFormDialog.form, succeed)
      },
      // 头像上传成功回调
      handleAvatarSuccess (res, file) {
        this.addFormDialog.form.portrait = URL.createObjectURL(file.raw)
        alert(this.addFormDialog.form.portrait)
      },
      // 上传前校验
      beforeAvatarUpload (file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M;
      },
      // 头像上传修改时回调
      changeUpload (file, fileList) {
        let self = this
        // FileReader
        if (window.FileReader) { // 验证当前的浏览器是否支持图片预览
          var reader = new FileReader()
          var regexImage = /^image\// // js正则表达式，匹配是否拥有image
          console.log(file)
          let image = file.raw
          if (regexImage.test(image.type)) {
            // 设置读取结束的回调函数
            reader.onload = function (data) {
              self.addFormDialog.form.portrait = data.target.result // 将结果数据显示到img标签上
            }
            // 开始读取上传的文件内容
            reader.readAsDataURL(image)
          } else {
            self.$message('请确认图片格式是否正确')
          }
        } else {
          self.$message('请使用谷歌浏览器')
        }
      },
      // 获取用户类型列表
      handleRoleTypeOptions () {
        let self = this
        let url = self.$api.roleListAll
        let succeed = function (res) {
          console.log(res);
          res.data.forEach(item => {
            self.roleTypeOptions.push(
              {
                value: item.roleCode,
                label: item.roleName
              }
            )
          })
          console.log(self.roleTypeOptions)
        }
        self.$axiosPOST(url, {}, succeed)
      },
      handleChangeStatus (newVal, userId) {
        let self = this
        let url = self.$api.userUpdateStatus + '/' + userId + '/' + newVal
        let succeed = function (res) {
          self.$message(newVal === 0 ? '已启用' : '已禁用')
          self.handleSearch()
        }
        self.$axiosPOST(url, {}, succeed)
      },
      // 翻页
      handleClickPage (page) {
        this.searchForm.currentPage = page
        this.handleSearch()
      },
      // 分页扩容
      handleSizeChange (pageSize) {
        this.searchForm.pageSize = pageSize
        this.handleSearch()
      },
      // 时间戳格式化
      dateFormatter (row, column) {
        var date = row[column.property]
        if (date === undefined || date === null) {
          return ''
        }
        return this.$formatDate(new Date(date), 'YYYY-MM-DD HH:mm:ss')
      }
    }
  }
</script>
<style>
  .box-body{
    width: 100%;
    overflow: auto;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
