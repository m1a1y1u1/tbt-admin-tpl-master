<template>
<div class="page-body">
  <div class="page-header">
    <el-breadcrumb>
      <el-breadcrumb-item :to="{path: '/'}"><i class="fa fa-home"></i></el-breadcrumb-item>
      <el-breadcrumb-item >Banner 设置</el-breadcrumb-item>
    </el-breadcrumb>
  </div>

  <div class="box">
    <el-date-picker
      v-model="searchForm.validTime"
      size="small"
      type="datetimerange"
      value-format="timestamp"
      range-separator="至"
      start-placeholder="有效时间起"
      end-placeholder="有效时间止"
      :style="{width: '400px'}"
      align="right">
    </el-date-picker>
    <p></p>
    <m-button type="info" size="small" @click="handleSearch"><i class="fa fa-search"> 搜索</i></m-button>
    <m-button type="info" size="small" @click="handleShowAddForm(null)"><i class="fa fa-plus"> 添加</i></m-button>
    <p></p>
    <el-table :data="tableData" style="width: 100% ">
      <el-table-column prop="id" label="ID" align="center"></el-table-column>
      <el-table-column label="Banner">
        <template slot-scope="scope">
          <img :src="scope.row.imageSrc" height="40"/>
        </template>
      </el-table-column>
      <el-table-column prop="validTimeStart" :formatter="dateFormatter" label="有效时间起"></el-table-column>
      <el-table-column prop="validTimeEnd" :formatter="dateFormatter" label="有效时间起"></el-table-column>
      <el-table-column prop="updateTime" :formatter="dateFormatter" label="编辑时间"></el-table-column>
      <el-table-column label="操作" fixed="right" width="100">
        <template slot-scope="scope">
          <el-button @click="handleShowAddForm(scope.row)" type="text">编辑</el-button>
          <el-button @click="handleDeleteBanner(scope.row.id)" type="text">刪除</el-button>
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
      <el-form-item label="Banner" >
        <el-upload ref="upload"
                   :action="this.$api.qiniuUploadLink"
                   list-type="picture"
                   :file-list="bannerImageList"
                   :multiple="false"
                   :data="postData"
                   :on-preview="handlePictureCardPreview"
                   :on-success="handleAvatarSuccess"
                   :before-upload="beforeAvatarUpload"
                   :on-error="handleAvatarError"
                   :on-remove="handleRemoveUpload"
                   :style="{width: this.addFormDialog.formInputWidth}">
          <el-button size="mini" class="el-icon-plus"> 添加图片</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="内容类型" >
        <el-select size="small" v-model="addFormDialog.form.contentType" clearable placeholder="选择内容类型"
                   :style="{width: this.addFormDialog.formInputWidth}" @change="handleContentTypeChange">
          <el-option
            v-for="(item,key) in contentTypeOptions"
            :key="key"
            :disabled="item.disabled"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Banner有效期" >
        <el-date-picker
          v-model="addFormDialog.form.validTime"
          size="small"
          type="datetimerange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :style="{width: this.addFormDialog.formInputWidth}"
          align="right">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="指向内容" >
        <el-select size="small" v-model="addFormDialog.form.resouceLink" clearable placeholder="选择指向内容"
                   :style="{width: this.addFormDialog.formInputWidth}">
          <el-option
            filterable
            v-for="(item,index) in resouceOptions"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="addFormDialog.visible = false">取 消</el-button>
      <el-button size="small" type="primary" @click="addFormDialog.isAdd ? handleAddBanner() : handleUpdateBanner()">确 定</el-button>
    </div>
  </el-dialog>
  <!--放大图-->
  <el-dialog :visible.sync="addFormDialog.bigImgVisible">
    <img width="100%" :src="addFormDialog.form.imageSrc" alt="">
  </el-dialog>
</div>
</template>
<script>
  export default {
    data () {
      return {
        postData: {
          token: ''
        },
        bannerImageList: [],
        resouceOptions: [],
        contentTypeOptions: [
          {
            label: '项目',
            value: 0
          },
          {
            label: '测试',
            value: 2
          },
          {
            disabled: true,
            label: '资讯',
            value: 1
          }],
        tableData: [],
        total: 0,
        addFormDialog: {
          visible: false,
          title: '',
          isAdd: '',
          bigImgVisible: false,
          formLabelWidth: '130px',
          formInputWidth: '400px',
          form: {
            id: '',
            imageSrc: '',
            validTimeStart: '',
            validTimeEnd: '',
            validTime: '',
            contentType: 0,
            resouceLink: ''
          }
        },
        searchForm: {
          validTime: [],
          validTimeStart: '',
          validTimeEnd: '',
          currentPage: 1,
          pageSize: 10
        }
      }
    },
    mounted () {
      this.getQiniuToken()
      this.handleSearch()
      this.handleProjectListAll()
    },
    watch: {
      'searchForm.validTime' (newVal, oldVal) {
        this.searchForm.validTimeStart = newVal[0]
        this.searchForm.validTimeEnd = newVal[1]
      },
      'addFormDialog.form.validTime' (newVal, oldVal) {
        this.addFormDialog.form.validTimeStart = newVal[0]
        this.addFormDialog.form.validTimeEnd = newVal[1]
      }
    },
    methods: {
      // 初始化数据
      handleSearch () {
        let self = this
        let url = self.$api.layoutBannerList
        let succeed = function (res) {
          self.tableData = res.data.list
          self.total = res.data.total
        }
        console.log(self.searchForm)
        self.$axiosPOST(url, self.searchForm, succeed)
      },
      // 显示表单 dialog
      handleShowAddForm (row) {
        let self = this
        self.addFormDialog.form.validTime = []
        self.addFormDialog.form.validTimeStart = ''
        self.addFormDialog.form.validTimeEnd = ''
        self.addFormDialog.form.imageSrc = ''
        self.addFormDialog.form.contentType = 0
        self.addFormDialog.form.resouceLink = ''
        self.resouceOptions = []
        self.bannerImageList = []
        if (row === null || row === '') {
          self.addFormDialog.title = '添加Banner'
          self.addFormDialog.isAdd = true
        } else {
          self.addFormDialog.title = '修改Banner'
          self.addFormDialog.isAdd = false
          for (let key in row) {
            self.addFormDialog.form[key] = row[key]
          }
          self.addFormDialog.form.validTime.push(row.validTimeStart)
          self.addFormDialog.form.validTime.push(row.validTimeEnd)
          self.handleContentTypeChange()
        }
        self.addFormDialog.visible = true
      },
      // 表单banner内容类型变更函数
      handleContentTypeChange () {
        if (this.addFormDialog.form.contentType === 0) { // 项目列表回调
          this.handleProjectListAll()
        }
        if (this.addFormDialog.form.contentType === 1) { // 资讯列表回调
          alert('资讯列表回调')
        }
      },
      // 获取项目列表
      handleProjectListAll () {
        let self = this
        let url = self.$api.sysProjectListAll
        let succeed = function (res) {
          console.log(res.data)
          self.resouceOptions = []
          for (let index in res.data) {
            let option = res.data[index]
            if (self.addFormDialog.form.contentType === 0) { // 项目
              self.resouceOptions.push({
                label: '项目：' + option.name + '【' + option.code + '】',
                value: option.id.toString()
              })
            } else {
              self.resouceOptions = []
              self.resouceOptions.push({
                label: '资讯标题',
                value: option.id
              })
            }
          }
        }
        self.$axiosPOST(url, self.addFormDialog.form, succeed)
      },
      // 添加表单提交
      handleAddBanner () {
        let self = this
        let url = self.$api.layoutBannerAdd
        let succeed = function (res) {
          self.$message('Banner添加成功')
          self.handleSearch()
          self.addFormDialog.visible = false
        }
        self.$axiosPOST(url, self.addFormDialog.form, succeed)
      },
      // 修改表单提交
      handleUpdateBanner () {
        let self = this
        let url = self.$api.layoutBannerUpdate
        let succeed = function (res) {
          self.$message('Banner修改成功')
          self.handleSearch()
          self.addFormDialog.visible = false
        }
        self.$axiosPOST(url, self.addFormDialog.form, succeed)
      },
      handleAvatarSuccess (res, file) { // 上传成功后在图片框显示图片
        this.$message('Banner已成功上传，请及时提交')
        this.addFormDialog.form.imageSrc = this.$api.qiniuImagePreLink + res.key
      },
      handleAvatarError (res) { // 显示错误
        this.$message('上传失败')
        console.log(res)
      },
      // 手动上传方法
      submitUpload () {
        this.$refs.uploadBatch.submit()
      },
      beforeAvatarUpload (file) { // 在图片提交前进行验证
        const isJPG = file.type === 'image/jpeg'
        const isPNG = file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 2

        const isFull = this.bannerImageList.length > 0 ? true : false;
        if (isFull) {
          this.$alert('只能上传一个Banner图片', '提示')
        }

        if (!isJPG && !isPNG) {
          this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return !isFull && (isJPG || isPNG) && isLt2M
      },
      getQiniuToken () {
        let self = this
        let success = function (res) {
          self.postData.token = res.data
        }
        self.$axiosPOST(self.$api.qiniuToken, {}, success)
      },
      //  删除指定id的Banner
      handleDeleteBanner (id) {
        this.$alert('确认删除banner？注意：删除后无法恢复', '警告', {
          type: 'warning'
        }).then(res => {
          this.$axiosPOST(this.$api.layoutBannerDelete + '/' + id, {}, item => {
            this.$message('删除成功')
            this.handleSearch()
          })
        })
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
      // 放大回调
      handlePictureCardPreview (file) {
        this.addFormDialog.form.imageSrc = file.url
        this.addFormDialog.bigImgVisible = true
      },
      // 上传删除回调
      handleRemoveUpload (file, fileList) {
        console.log('上传删除：', file, fileList)
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
</style>
