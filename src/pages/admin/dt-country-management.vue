<template>
<div class="page-body">
  <div class="page-header">
    <el-breadcrumb>
      <el-breadcrumb-item :to="{path: '/'}"><i class="fa fa-home"></i></el-breadcrumb-item>
      <el-breadcrumb-item >系统设置</el-breadcrumb-item>
      <el-breadcrumb-item >国家字典</el-breadcrumb-item>
    </el-breadcrumb>
  </div>

  <div class="box">
    <el-input placeholder="中文名" size="small" v-model="searchForm.nameCh" style="width: 150px" clearable/>
    <el-input placeholder="英文名" size="small" v-model="searchForm.nameEn" style="width: 150px" clearable/>
    <m-button type="info" size="small" @click="handleSearch"><i class="fa fa-search"></i></m-button>
    <p></p>
    <el-table :data="tableData" style="width: 100% ">
      <el-table-column prop="id" label="ID" align="center"></el-table-column>
      <el-table-column prop="code" label="国家代码"></el-table-column>
      <el-table-column prop="nameEn" label="英文名称"></el-table-column>
      <el-table-column prop="nameCh" label="中文名称"></el-table-column>
      <el-table-column prop="description" label="简称"></el-table-column>
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
</div>
</template>
<script>
  export default {
    data () {
      return {
        tableData: [],
        total: 0,
        searchForm: {
          'code': '',
          'nameEn': '',
          'nameCh': '',
          'description': '',
          'currentPage': 1,
          'pageSize': 10
        }
      }
    },
    mounted () {
      this.handleSearch()
    },
    methods: {
      // 初始化数据
      handleSearch () {
        let self = this
        let url = self.$api.dtCountryList
        let succeed = function (res) {
          self.tableData = res.data.list
          self.total = res.data.total
        }
        console.log(self.searchForm)
        self.$axiosPOST(url, self.searchForm, succeed)
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
