webpackJsonp([14],{MOZV:function(e,a,t){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var l={data:function(){return{tableData:[],total:0,searchForm:{code:"",nameEn:"",nameCh:"",description:"",currentPage:1,pageSize:10}}},mounted:function(){this.handleSearch()},methods:{handleSearch:function(){var e=this,a=e.$api.dtCountryList;console.log(e.searchForm),e.$axiosPOST(a,e.searchForm,function(a){e.tableData=a.data.list,e.total=a.data.total})},handleClickPage:function(e){this.searchForm.currentPage=e,this.handleSearch()},handleSizeChange:function(e){this.searchForm.pageSize=e,this.handleSearch()}}},r={render:function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",{staticClass:"page-body"},[t("div",{staticClass:"page-header"},[t("el-breadcrumb",[t("el-breadcrumb-item",{attrs:{to:{path:"/"}}},[t("i",{staticClass:"fa fa-home"})]),e._v(" "),t("el-breadcrumb-item",[e._v("系统设置")]),e._v(" "),t("el-breadcrumb-item",[e._v("国家字典")])],1)],1),e._v(" "),t("div",{staticClass:"box"},[t("el-input",{staticStyle:{width:"150px"},attrs:{placeholder:"中文名",size:"small",clearable:""},model:{value:e.searchForm.nameCh,callback:function(a){e.$set(e.searchForm,"nameCh",a)},expression:"searchForm.nameCh"}}),e._v(" "),t("el-input",{staticStyle:{width:"150px"},attrs:{placeholder:"英文名",size:"small",clearable:""},model:{value:e.searchForm.nameEn,callback:function(a){e.$set(e.searchForm,"nameEn",a)},expression:"searchForm.nameEn"}}),e._v(" "),t("m-button",{attrs:{type:"info",size:"small"},on:{click:e.handleSearch}},[t("i",{staticClass:"fa fa-search"})]),e._v(" "),t("p"),e._v(" "),t("el-table",{staticStyle:{width:"100%"},attrs:{data:e.tableData}},[t("el-table-column",{attrs:{prop:"id",label:"ID",align:"center"}}),e._v(" "),t("el-table-column",{attrs:{prop:"code",label:"国家代码"}}),e._v(" "),t("el-table-column",{attrs:{prop:"nameEn",label:"英文名称"}}),e._v(" "),t("el-table-column",{attrs:{prop:"nameCh",label:"中文名称"}}),e._v(" "),t("el-table-column",{attrs:{prop:"description",label:"简称"}})],1),e._v(" "),t("p"),e._v(" "),t("el-pagination",{attrs:{background:"","current-page":e.searchForm.currentPage,"page-sizes":[10,20,30,40],"page-size":e.searchForm.pageSize,layout:"total, sizes, prev, pager, next, jumper",total:e.total},on:{"size-change":e.handleSizeChange,"current-change":e.handleClickPage}})],1)])},staticRenderFns:[]};var n=t("C7Lr")(l,r,!1,function(e){t("Y0WF")},null,null);a.default=n.exports},Y0WF:function(e,a){}});
//# sourceMappingURL=14.f36c869eb301d93f164f.js.map