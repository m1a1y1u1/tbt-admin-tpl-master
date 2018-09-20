<template>
  <div class="page-body">
    <div class="page-header">
      <el-breadcrumb>
        <el-breadcrumb-item :to="{path: '/'}"><i class="fa fa-home"></i></el-breadcrumb-item>
        <el-breadcrumb-item >项目管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="box">
      <el-select filterable v-model="searchForm.schedule" size="small" clearable placeholder="状态" style="width: 150px">
        <el-option
          v-for="(item,index) in statusOptions"
          :key="index"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input placeholder="项目名" size="small" v-model="searchForm.nameLike" style="width: 150px" clearable/>
      <el-input placeholder="代币名" size="small" v-model="searchForm.tokenLike" style="width: 150px" clearable/>
      <p></p>
      <m-button type="info" size="small" @click="handleSearch"><i class="fa fa-search"> 搜索</i></m-button>
      <m-button type="info" size="small" @click="handleShowAddForm(null)"><i class="fa fa-plus"> 添加</i></m-button>
      <p></p>
      <el-table :data="tableData" style="width: 100% ">
        <el-table-column prop="id" label="ID" align="center" width="50px"></el-table-column>
        <el-table-column prop="code" label="项目编号"></el-table-column>
        <el-table-column prop="name" label="项目名"></el-table-column>
        <el-table-column prop="logoSrc" label="LOGO">
          <template slot-scope="scope">
            <img :src="scope.row.logoSrc" :title="scope.row.name" width="50" height="50"></img>
          </template>
        </el-table-column>
        <el-table-column prop="token" label="代币名"></el-table-column>
        <el-table-column prop="updateTime" :formatter="dateFormatter" label="更新时间"></el-table-column>
        <el-table-column label="是否推荐" fixed="right"  width="100">
          <template slot-scope="scope">
            <el-switch @change="handleChangeStatus($event,scope.row.id)"
                       v-model="scope.row.statusOfRecommended"
                       :active-value="1"
                       :inactive-value="0"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="100">
          <template slot-scope="scope">
            <el-button @click="handleShowAddForm(scope.row)" type="text">编辑</el-button>
            <el-button @click="handleLogicDeleteProject(scope.row.id)" type="text">刪除</el-button>
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
    <el-dialog ref="addFormDialog" :title="addFormDialog.title" :visible.sync="addFormDialog.visible" style="padding:0px">
      <!-- ref="addForm" 用于定位 更改将导致复位失败 -->
      <el-form ref="addForm" :label-width="addFormDialog.formLabelWidth" :model="addFormDialog.form">
        <el-tabs ref="addFormTabs" tab-position="top" v-model="addFormDialog.activeTabName">
          <!--项目基本信息tab-->
          <el-tab-pane label="基本信息" :name="addFormDialog.defaultTabName">
            <el-form-item label="项目名称" >
              <el-input placeholder="请输入项目名称" size="small" v-model="addFormDialog.form.name" autocomplete="off" clearable
                        :style="{width: addFormDialog.formInputWidth}"></el-input>
            </el-form-item>
            <el-form-item label="项目LOGO" >
              <el-upload
                class="avatar-uploader"
                :action="$api.qiniuUploadLink"
                :data="postData"
                :multiple="false"
                :show-file-list="false"
                :on-success="handleLogoAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="addFormDialog.form.logoSrc" :src="addFormDialog.form.logoSrc" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="代币名称" >
              <el-input placeholder="代币名称" size="small" v-model="addFormDialog.form.token" autocomplete="off" clearable
                        :style="{width: addFormDialog.formInputWidth}"></el-input>
            </el-form-item>
            <el-form-item label="官网地址" >
              <el-input placeholder="请输入官网地址" size="small" v-model="addFormDialog.form.homePageUrl" autocomplete="off" clearable
                        :style="{width: addFormDialog.formInputWidth}"></el-input>
            </el-form-item>
            <el-form-item label="白皮书" >
              <el-upload
                class="avatar-uploader"
                :action="$api.qiniuUploadLink"
                :data="postData"
                list-type="picture-card"
                :on-success="handleWhitePageAvatarSuccess"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="底层平台" >
              <el-select filterable size="small" v-model="addFormDialog.form.underlyingPlatformCode" clearable placeholder="底层平台"
                         :style="{width: addFormDialog.formInputWidth}">
                <el-option
                  v-for="(item,index) in platformTypeOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="注册国家" >
              <el-select filterable size="small" v-model="addFormDialog.form.registeredCountryCode" clearable placeholder="注册国家"
                         :style="{width: addFormDialog.formInputWidth}">
                <el-option
                  v-for="(item,index) in countryOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="项目分类" >
              <el-select filterable size="small" v-model="addFormDialog.form.typeCode" clearable placeholder="项目分类"
                         :style="{width: addFormDialog.formInputWidth}">
                <el-option
                  v-for="(item,index) in projectTypeOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="项目概述" >
              <el-input placeholder="请输入项目概述" size="small" type="textarea"
                        :rows="5"
                        v-model="addFormDialog.form.summary"
                        autocomplete="off" clearable></el-input>
            </el-form-item>
          </el-tab-pane>
          <!--项目财务数据 tab-->
          <el-tab-pane label="财务数据">
            <el-form-item label="Token销售量" >
              <el-input placeholder="请输入Token销售量" size="small" v-model="addFormDialog.form.countOfCirculation" autocomplete="off" clearable
                        :style="{width: addFormDialog.formInputWidth}"></el-input>
            </el-form-item>
            <el-form-item label="Token发行量" >
              <el-input placeholder="请输入Token发行量" size="small" v-model="addFormDialog.form.countOfTotal" autocomplete="off" clearable
                        :style="{width: addFormDialog.formInputWidth}"></el-input>
            </el-form-item>
            <el-form-item label="市值" >
              <el-input placeholder="请输入市值" size="small" v-model="addFormDialog.form.marketValue" autocomplete="off" clearable
                        :style="{width: addFormDialog.formInputWidth}"></el-input>
            </el-form-item>
            <el-form-item label="软顶" >
              <el-input placeholder="请输入软顶" size="small" v-model="addFormDialog.form.softCap" autocomplete="off" clearable
                        :style="{width: addFormDialog.formInputWidth}"></el-input>
            </el-form-item>
            <el-form-item label="软顶货币" >
              <el-select filterable size="small" v-model="addFormDialog.form.softCapCurrency" clearable placeholder="软顶货币"
                         :style="{width: addFormDialog.formInputWidth}">
                <el-option
                  v-for="(item,index) in currencyTypeOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="硬顶" >
              <el-input placeholder="请输入硬顶" size="small" v-model="addFormDialog.form.hartCap" autocomplete="off" clearable
                        :style="{width: addFormDialog.formInputWidth}"></el-input>
            </el-form-item>
            <el-form-item label="硬顶货币" >
              <el-select filterable size="small" v-model="addFormDialog.form.hartCapCurrency" clearable placeholder="硬顶货币"
                         :style="{width: addFormDialog.formInputWidth}">
                <el-option
                  v-for="(item,index) in currencyTypeOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="USDT兑率" >
              <el-input placeholder="请输入USDT兑率" size="small" v-model="addFormDialog.form.exchangeRateOfUsdt" autocomplete="off" clearable
                        :style="{width: addFormDialog.formInputWidth}"></el-input>
            </el-form-item>
            <el-form-item label="预售时间" >
              <el-date-picker
                v-model="addFormDialog.let.preSaleTime"
                size="small"
                type="datetimerange"
                value-format="timestamp"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :style="{width: addFormDialog.formInputWidth}"
                align="right">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="ICO时间" >
              <el-date-picker
                v-model="addFormDialog.let.icoTime"
                size="small"
                value-format="timestamp"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :style="{width: addFormDialog.formInputWidth}"
                align="right">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="开启白名单" >
              <el-select size="small" v-model="addFormDialog.form.needWhitelist" clearable placeholder="是否开启白名单"
                         :style="{width: addFormDialog.formInputWidth}">
                <el-option
                  v-for="(item,index) in booleanOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开启KYC" >
              <el-select size="small" v-model="addFormDialog.form.needKyc" clearable placeholder="是否开启KYC"
                         :style="{width: addFormDialog.formInputWidth}">
                <el-option
                  v-for="(item,index) in booleanOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="可接收货币" >
              <el-select filterable size="small" v-model="addFormDialog.form.acceptableCurrency" multiple clearable placeholder="可接收货币（多选）"
                         :style="{width: addFormDialog.formInputWidth}">
                <el-option
                  v-for="(item,index) in currencyTypeOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="受限国家" >
              <el-select filterable size="small" v-model="addFormDialog.form.restrictCountry" multiple clearable placeholder="受限国家（多选）"
                         :style="{width: addFormDialog.formInputWidth}">
                <el-option
                  v-for="(item,index) in countryOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-tab-pane>

          <!--项目团队成员 tab-->
          <el-tab-pane label="团队成员">
            <span slot="label">
              <el-badge :value="addFormDialog.form.teamMemberList.length" class="badge-item">
                团队成员
              </el-badge>
            </span>
            <div v-for="(item,index) in addFormDialog.form.teamMemberList" class="dashed-border" :key="index">
              <el-form-item label="名称" >
                <el-input placeholder="请输入名称" size="small" v-model="item.memberName" autocomplete="off" clearable
                          :style="{width: addFormDialog.formInputWidth}"></el-input>
              </el-form-item>
              <el-form-item label="职务" >
                <el-input placeholder="请输入职务" size="small" v-model="item.post" autocomplete="off" clearable
                          :style="{width: addFormDialog.formInputWidth}"></el-input>
              </el-form-item>
              <el-form-item label="头像" >
                <el-upload
                  class="avatar-uploader"
                  :data="postData"
                  :action="$api.qiniuUploadLink"
                  :show-file-list="false"
                  :on-success="(res, files) => { $message('头像成功上传'); item.portraitSrc = $api.qiniuImagePreLink + res.key }"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="item.portraitSrc" :src="item.portraitSrc" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
              <el-form-item label="介绍" >
                <el-input placeholder="请输入介绍" size="small" type="textarea" :rows="5" v-model="item.description" autocomplete="off" clearable
                          :style="{width: addFormDialog.formInputWidth}"></el-input>
              </el-form-item>
              <!--删除此项目成员 按钮-->
              <el-form-item label="">
                <el-tooltip class="item" effect="dark" content="删除该成员" placement="left">
                  <el-button type="danger" @click="handleRemoveTeamMemberForm(index,item.id)" icon="el-icon-delete" circle></el-button>
                </el-tooltip>
              </el-form-item>
            </div>
            <p></p>
            <el-form-item label="" style="margin-bottom: 0">
              <!--添加项目成员 追加表单按钮-->
              <el-tooltip class="item" effect="dark" content="添加项目成员" placement="left">
                <el-button type="primary" icon="el-icon-plus" @click="handleAppendTeamMemberForm" circle></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="回到顶部" placement="right">
                <el-button type="default" icon="el-icon-arrow-up" @click="handleGoAddFormTop" circle></el-button>
              </el-tooltip>
            </el-form-item>
          </el-tab-pane>

          <!--官媒社交 tab-->
          <el-tab-pane label="官媒社交">
            <span slot="label">
              <el-badge :value="defaultSocialMediumList.length" class="badge-item">
                官媒社交
              </el-badge>
            </span>

            <div v-for="(item,index) in defaultSocialMediumList" :key="index">

              <el-form-item :label="item.name">
                <el-input v-model="item.linkSrc" autocomplete="off" clearable :placeholder="item.name"
                          :style="{width: addFormDialog.formInputWidth}">
                    <img slot="prepend" :src="require('../../assets/image/'+ item.name +'.png')"
                         style="height: 32px;margin-top: 2px">
                </el-input>
              </el-form-item>
            </div>
            <p></p>
            <el-form-item label="" style="margin-bottom: 0">
              <!--<el-tooltip class="item" effect="dark" content="添加新媒体" placement="left">
                <el-button type="primary" icon="el-icon-plus" @click="handleAppendTeamMemberForm" circle></el-button>
              </el-tooltip>-->
              <el-tooltip class="item" effect="dark" content="回到顶部" placement="right">
                <el-button type="default" icon="el-icon-arrow-up" @click="handleGoAddFormTop" circle></el-button>
              </el-tooltip>
            </el-form-item>
          </el-tab-pane>

          <!--项目里程碑 tab-->
          <el-tab-pane label="里程碑">
            <span slot="label">
              <el-badge :value="addFormDialog.form.milepostList.length" class="badge-item">
                里程碑
              </el-badge>
            </span>

            <div v-for="(item,index) in addFormDialog.form.milepostList" class="dashed-border" :key="index">
              <el-form-item label="时间">
                <el-date-picker clearable
                  size="small"
                  v-model="item.milepostTime"
                  value-format="timestamp"
                  align="right"
                  type="date"
                  placeholder="选择日期"
                  :style="{width: addFormDialog.formInputWidth}">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="事件">
                <el-input size="small" type="textarea"
                          :rows="5"
                          placeholder="请输入内容"
                          v-model="item.eventContent"
                          autocomplete="off" clearable
                          :style="{width: addFormDialog.formInputWidth}"></el-input>
              </el-form-item>
              <el-form-item label="">
                <el-tooltip class="item" effect="dark" content="删除该事件" placement="left">
                  <el-button type="danger" @click="handleRemoveMilepostForm(index,item.id)" icon="el-icon-delete" circle></el-button>
                </el-tooltip>
              </el-form-item>
            </div>

            <p></p>
            <el-form-item label="" style="margin-bottom: 0">
              <!--添加里程碑事件表单 按钮-->
              <el-tooltip class="item" effect="dark" content="添加事件" placement="left">
                <el-button type="primary" icon="el-icon-plus" @click="handleAppendMilepostForm" circle></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="回到顶部" placement="right">
                <el-button type="default" icon="el-icon-arrow-up" @click="handleGoAddFormTop" circle></el-button>
              </el-tooltip>
            </el-form-item>
          </el-tab-pane>

          <!--项目热度统计 tab-->
          <el-tab-pane label="热度">
            <span slot="label">
              <el-badge :value="addFormDialog.form.popularityList.length" class="badge-item">
                热度
              </el-badge>
            </span>

            <div v-for="(item,index) in addFormDialog.form.popularityList" class="dashed-border" :key="index">
              <el-form-item label="统计时间">
                <el-date-picker clearable
                                size="small"
                                v-model="item.acquisitionTime"
                                value-format="timestamp"
                                align="right"
                                type="date"
                                placeholder="选择日期"
                                :style="{width: addFormDialog.formInputWidth}">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="网站排名">
                <el-input placeholder="请输入网站排名" size="small" v-model="item.rankingOfWebsite" autocomplete="off" clearable
                          :style="{width: addFormDialog.formInputWidth}"></el-input>
              </el-form-item>
              <el-form-item label="电报群用户量">
                <el-input placeholder="请输入电报群用户量" size="small" v-model="item.countsOfTelegraphUser" autocomplete="off" clearable
                          :style="{width: addFormDialog.formInputWidth}"></el-input>
              </el-form-item>
              <el-form-item label="Twitter粉丝量">
                <el-input placeholder="请输入Twitter粉丝量" size="small" v-model="item.fansOfTwitter" autocomplete="off" clearable
                          :style="{width: addFormDialog.formInputWidth}"></el-input>
              </el-form-item>
              <el-form-item label="">
                <el-tooltip class="item" effect="dark" content="删除当前热度统计" placement="left">
                  <el-button type="danger" @click="handleRemovePopularityForm(index,item.id)" icon="el-icon-delete" circle></el-button>
                </el-tooltip>
              </el-form-item>
            </div>

            <p></p>
            <el-form-item label="" style="margin-bottom: 0">
              <!--添加里程碑事件表单 按钮-->
              <el-tooltip class="item" effect="dark" content="添加事件" placement="left">
                <el-button type="primary" icon="el-icon-plus" @click="handleAppendPopularityForm" circle></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="回到顶部" placement="right">
                <el-button type="default" icon="el-icon-arrow-up" @click="handleGoAddFormTop" circle></el-button>
              </el-tooltip>
            </el-form-item>
          </el-tab-pane>

          <!--项目评分 tab-->
          <el-tab-pane label="评分">
            <el-form-item label="综合评分">
              <el-input placeholder="请输入综合评分" size="small" v-model="addFormDialog.form.scoreOfComprehensive" autocomplete="off" clearable
                        :style="{width: addFormDialog.formInputWidth}"></el-input>
            </el-form-item>
            <el-form-item label="项目得分">
              <el-input placeholder="请输入项目得分" size="small" v-model="addFormDialog.form.scoreOfProject" autocomplete="off" clearable
                        :style="{width: addFormDialog.formInputWidth}"></el-input>
            </el-form-item>
            <el-form-item label="团队得分">
              <el-input placeholder="请输入团队得分" size="small" v-model="addFormDialog.form.scoreOfTeam" autocomplete="off" clearable
                        :style="{width: addFormDialog.formInputWidth}"></el-input>
            </el-form-item>
            <el-form-item label="用户得分">
              <el-input placeholder="请输入用户得分" size="small" v-model="addFormDialog.form.scoreOfUser" autocomplete="off" clearable
                        :style="{width: addFormDialog.formInputWidth}"></el-input>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="addFormDialog.isAdd ? handleAddProject() : handleUpdateProject()">发布项目</el-button>
      </div>
    </el-dialog>
    <!--放大图-->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        postData: { // 七牛
          token: ''
        },
        statusOptions: [
          {
            value: 0,
            label: '即将开始'
          },
          {
            value: 1,
            label: '进行中'
          },
          {
            value: 2,
            label: '已结束'
          }
        ],
        booleanOptions: [
          {
            value: 0,
            label: '是'
          },
          {
            value: 1,
            label: '否'
          }
        ],
        projectTypeOptions: [], // 项目类型
        currencyTypeOptions: [], // 系统可选的货币类型
        platformTypeOptions: [], // 项目底层平台
        countryOptions: [], // 国家地区列表
        tableData: [],
        total: 0,
        searchForm: {
          'schedule': '', // 进度 0：即将开始  1：进行中 2：已结束
          'nameLike': '',
          'tokenLike': '',
          'currentPage': 1,
          'pageSize': 10
        },
        // 项目添加|修改表单 对话框属性
        addFormDialog: {
          visible: false,
          title: '',
          isAdd: '',
          formLabelWidth: '100px',
          formInputWidth: '400px',
          let: {// 临时值
            preSaleTime: [],
            icoTime: []
          },
          defaultTabName: 'baseInfo',
          activeTabName: '',
          tabsIsFixed: false,
          form: {
            id: '',
            name: '',
            code: '',
            logoSrc: '',
            token: '',
            homePageUrl: '',
            whitePageUrlJson: [],
            summary: '',
            underlyingPlatformCode: '',
            registeredCountryCode: '',
            typeCode: '',
            hartCap: '',
            hartCapCurrency: '',
            softCap: '',
            softCapCurrency: '',
            exchangeRateOfUsdt: '',
            marketValue: '',
            countOfCirculation: '',
            countOfTotal: '',
            restrictCountry: '',
            acceptableCurrency: '',
            needKyc: '',
            needWhitelist: '',
            statusOfRecommended: '',
            status: '',
            preSaleStartTime: '',
            preSaleEndTime: '',
            icoStartTime: '',
            icoEndTime: '',
            scoreOfProject: '',
            scoreOfTeam: '',
            scoreOfComprehensive: '',
            teamMemberList: [{// 团队人员列表
              id: '',
              projectId: '',
              memberName: '',
              portraitSrc: '',
              post: '',
              description: ''
            }],
            socialMediumJsonArray: '',
            milepostList: [{
              id: '',
              projectId: '',
              milepostTime: '',
              eventContent: ''
            }],
            popularityList: [{
              id: '',
              projectId: '',
              acquisitionTime: '',
              rankingOfWebsite: '',
              countsOfTelegraphUser: '',
              fansOfTwitter: ''
            }]
          }
        },
        defaultSocialMediumList: [// 系統支持的社交媒体列表
          {
            linkSrc: '',
            placeholder: '请输入bitcoint链接地址',
            name: 'bitcointalk'
          },
          {
            linkSrc: '',
            placeholder: '请输入blog链接地址',
            name: 'blog'
          },
          {
            linkSrc: '',
            placeholder: '请输入discord链接地址',
            name: 'discord'
          },
          {
            linkSrc: '',
            placeholder: '请输入facebook链接地址',
            name: 'facebook'
          },
          {
            linkSrc: '',
            placeholder: '请输入github链接地址',
            name: 'github'
          },
          {
            linkSrc: '',
            placeholder: '请输入INS链接地址',
            name: 'INS'
          },
          {
            linkSrc: '',
            placeholder: '请输入linkedin链接地址',
            name: 'linkedin'
          },
          {
            linkSrc: '',
            placeholder: '请输入Reddit链接地址',
            name: 'Reddit'
          },
          {
            linkSrc: '',
            placeholder: '请输入Slack链接地址',
            name: 'Slack'
          },
          {
            linkSrc: '',
            placeholder: '请输入steemit链接地址',
            name: 'steemit'
          },
          {
            linkSrc: '',
            placeholder: '请输入telegram链接地址',
            name: 'telegram'
          },
          {
            linkSrc: '',
            placeholder: '请输入twitter链接地址',
            name: 'twitter'
          },
          {
            linkSrc: '',
            placeholder: '请输入vimeo链接地址',
            name: 'vimeo'
          }
        ],
        dialogVisible: false,
        dialogImageUrl: '',
        // 时间控件回调相关
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end])
            }
          }]
        }
      }
    },
    watch: {
      'addFormDialog.let.preSaleTime' (curVal, oldVal) {
        console.log('预售时间：' + curVal)
        if (curVal !== null && curVal !== []) {
          // 获取预售时间的毫秒数
          this.addFormDialog.form.preSaleStartTime = curVal[0]
          this.addFormDialog.form.preSaleEndTime = curVal[1]
        }
      },
      'addFormDialog.let.icoTime' (curVal, oldVal) {
        console.log('ICO时间：' + curVal)
        if (curVal !== null && curVal !== []) {
          // 获取ICO时间的毫秒数
          this.addFormDialog.form.icoStartTime = curVal[0]
          this.addFormDialog.form.icoEndTime = curVal[1]
        }
      }
    },
    mounted () {
      this.getQiniuToken()// 获取上传令牌
      this.handleSearch()// 初始加载表格数据
      window.addEventListener('scroll', this.handleScroll, true)
      /* 加载页面所需下拉列表 */
      this.handleCountryOptions()
      this.handleNeedOptionsList()
    },
    destroyed () {
      window.removeEventListener('scroll', this.handleScroll, true)
    },
    methods: {
      // 初始化数据
      handleSearch () {
        let self = this
        let url = self.$api.sysProjectList
        let succeed = function (res) {
          self.tableData = res.data.list
          self.total = res.data.total
        }
        self.$axiosPOST(url, self.searchForm, succeed)
      },
      // 显示添加项目的form
      handleShowAddForm (row) {
        let self = this
        // 复位tab
        self.addFormDialog.activeTabName = self.addFormDialog.defaultTabName
        if (row === undefined || row === null) {
          self.addFormDialog.title = '新建项目'
          self.addFormDialog.isAdd = true
          // 重置项目一级参数
          for (let key in self.addFormDialog.form) {
            let item = self.addFormDialog.form[key]
            self.addFormDialog.form[key] = ''
          }
          // 重置媒体数组json
          self.defaultSocialMediumList.forEach(item => {
            item.linkSrc = 'http://'
          })
          // 重置联动时间中间数据
          self.addFormDialog.let.preSaleTime = []
          self.addFormDialog.let.icoTime = []
          // 重置成员数组tab表单数据
          self.addFormDialog.form.teamMemberList = [{
            'id': '',
            'projectId': '',
            'memberName': '',
            'portraitSrc': '',
            'post': '',
            'description': ''
          }]
          // 重置里程碑事件tab表单数据
          self.addFormDialog.form.milepostList = [{
            'id': '',
            'projectId': '',
            'milepostTime': '',
            'eventContent': ''
          }]
          // 重置项目人气指标统计列表数据（人气）
          self.addFormDialog.form.popularityList = [{
            'id': '',
            'projectId': '',
            'acquisitionTime': '',
            'rankingOfWebsite': '',
            'countsOfTelegraphUser': '',
            'fansOfTwitter': ''
          }]
          self.addFormDialog.visible = true
        } else {
          self.addFormDialog.title = '编辑项目'
          self.addFormDialog.isAdd = false
          // 表单一级参数赋值
          for (let key in self.addFormDialog.form) {
            if (key !== 'milepostList'
              && key !== 'popularityList'
              && key !== 'teamMemberList') {
              self.addFormDialog.form[key] = row[key]
            }
          }
          console.log(row)
          // 项目表单媒体json参数解析赋值
          let socialMediumJsonArray = JSON.parse(row.socialMediumJsonArray)
          self.defaultSocialMediumList.forEach(defaultMedium => {
            defaultMedium.linkSrc = ''
            socialMediumJsonArray.forEach(hasMedium => {
              if (defaultMedium.name === hasMedium.name) {
                defaultMedium.linkSrc = hasMedium.linkSrc
              }
            })
          })
          self.addFormDialog.form.restrictCountry = JSON.parse(row.restrictCountry)
          self.addFormDialog.form.acceptableCurrency = JSON.parse(row.acceptableCurrency)
          self.addFormDialog.let.preSaleTime = []
          self.addFormDialog.let.icoTime = []
          self.addFormDialog.let.preSaleTime.push(row.preSaleStartTime)
          self.addFormDialog.let.preSaleTime.push(row.preSaleEndTime)
          self.addFormDialog.let.icoTime.push(row.icoStartTime)
          self.addFormDialog.let.icoTime.push(row.icoEndTime)
          // 表单媒体列表、项目成员列表后台拉取
          let success = function (res) {
            console.log(res.data.teamMemberList)
            self.addFormDialog.form.teamMemberList = res.data.teamMemberList
            console.log(res.data.milepostList)
            self.addFormDialog.form.milepostList = res.data.milepostList
            console.log(res.data.popularityList)
            self.addFormDialog.form.popularityList = res.data.popularityList
            self.addFormDialog.visible = true
          }
          self.handlePullContextInformation(row.id, success)
        }
      },
      // ajax 表单媒体列表、项目成员列表后台拉取(项目上下文信息)
      handlePullContextInformation (projectId, callback) {
        this.$axiosPOST(this.$api.sysProjectExtraInfoList + '/' + projectId, {}, callback)
      },
      // 项目添加
      handleAddProject () {
        let self = this
        let url = self.$api.sysProjectAdd
        let succeed = function (res) {
          self.$message('添加成功')
          self.handleSearch()
          self.addFormDialog.visible = false
        }
        // 读取社交媒体信息，添加重构成json
        let socialMediumJsonArray = [];
        this.defaultSocialMediumList.forEach(item => {
          if (item.linkSrc.trim() !== '') {
            socialMediumJsonArray.push({
              'name': item.name.trim(),
              'linkSrc': item.linkSrc.trim()
            })
          }
        })
        // 转json字符串存储
        this.addFormDialog.form.socialMediumJsonArray = JSON.stringify(socialMediumJsonArray)
        console.log(JSON.stringify(this.addFormDialog.form))
        self.$axiosPOST(url, this.addFormDialog.form, succeed)
      },
      // 项目删除
      handleLogicDeleteProject (projectId) {
        this.$alert('是否确认删除该项目？', '警告', {
          type: 'warning',
          callback: res => {
            this.$axiosPOST(this.$api.sysProjectLogicDelete + '/' + projectId, {}, res => {
              this.$message('项目已删除')
              this.handleSearch()
            })
          }
        })
      },
      // 推荐状态修改x
      handleChangeStatus (newVal, projectId) {
        let self = this
        let url = self.$api.sysProjecUpdateRecommended + '/' + projectId + '/' + newVal
        let succeed = function (res) {
          self.handleSearch()
        }
        self.$axiosPOST(url, {}, succeed)
      },
      // 项目修改
      handleUpdateProject () {
        let self = this
        let url = self.$api.sysProjecUpdate
        let succeed = function (res) {
          self.$message('修改成功')
          self.handleSearch()
          self.addFormDialog.visible = false
        }

        // 读取社交媒体信息，添加重构成json
        let socialMediumJsonArray = []
        this.defaultSocialMediumList.forEach(item => {
          if (item.linkSrc.trim() !== '') {
            socialMediumJsonArray.push({
              'name': item.name.trim(),
              'linkSrc': item.linkSrc.trim()
            })
          }
        })
        // 转json字符串存储
        this.addFormDialog.form.socialMediumJsonArray = JSON.stringify(socialMediumJsonArray)
        console.log(this.addFormDialog.form)
        self.$axiosPOST(url, this.addFormDialog.form, succeed)
      },
      // 追加项目成员表单回调
      handleAppendTeamMemberForm () {
        this.addFormDialog.form.teamMemberList.push({ // 团队人员列表
          'id': '',
          'projectId': '',
          'memberName': '',
          'portraitSrc': '',
          'post': '',
          'description': ''
        })
      },
      // 追加项目里程碑表单回调
      handleAppendMilepostForm () {
        this.addFormDialog.form.milepostList.push({ // 项目里程碑事件列表
          'id': '',
          'projectId': '',
          'milepostTime': '',
          'eventContent': ''
        })
      },
      // 追加热度统计表单回调
      handleAppendPopularityForm () {
        this.addFormDialog.form.popularityList.push({ // 热度统计列表
          'id': '',
          'projectId': '',
          'acquisitionTime': '',
          'rankingOfWebsite': '',
          'countsOfTelegraphUser': '',
          'fansOfTwitter': ''
        })
      },
      // 回到addForm顶部回调方法
      handleGoAddFormTop () {
        this.$refs.addForm.$el.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'start'})
      },
      // 删除指定序列的成员表单，若id不为空，调用接口删除指定id的成员，否则直接移除指定序列的dom
      handleRemoveTeamMemberForm (index, id) {
        let self = this;
        if (id !== undefined && id !== null && id !== '') {
          self.$alert('确定删除当前项目成员？注意：该操作不可恢复', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            self.$axiosPOST(self.$api.sysProjectTeamInfoDelete + '/' + id, {}
              , res => {
                self.addFormDialog.form.teamMemberList.splice(index, 1)
                self.$message('该成员已成功删除')
              })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        } else {
          self.$confirm('确定删除？注意：已填入信息将丢失', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            self.addFormDialog.form.teamMemberList.splice(index, 1)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        }
      },
      handleRemoveMilepostForm (index, id) {
        let self = this
        if (id !== undefined && id !== null && id !== '') {
          self.$alert('确定删除当前里程碑事件？注意：该操作不可恢复', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            self.$axiosPOST(self.$api.sysProjectMilepostDelete + '/' + id, {}
              , res => {
                self.addFormDialog.form.milepostList.splice(index, 1)
                self.$message('该里程碑事件已成功删除')
              })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        } else {
          self.$confirm('确定删除？注意：已填入信息将丢失', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            self.addFormDialog.form.milepostList.splice(index, 1)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        }
      },
      handleRemovePopularityForm (index, id) {
        let self = this
        if (id !== undefined && id !== null && id !== '') {
          self.$alert('确定删除当前项热度统计信息？注意：该操作不可恢复', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            self.$axiosPOST(self.$api.sysProjectsPopularityDelete + '/' + id, {}
              , res => {
                self.addFormDialog.form.popularityList.splice(index, 1)
                self.$message('该项目热度记录已成功删除')
              })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        } else {
          self.$confirm('确定删除？注意：已填入信息将丢失', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            self.addFormDialog.form.popularityList.splice(index, 1)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        }
      },
      getQiniuToken () {
        let self = this
        let success = function (res) {
          self.postData.token = res.data
        }
        self.$axiosPOST(self.$api.qiniuToken, {}, success)
      },
      // Logo上传 成功回调
      handleLogoAvatarSuccess(res, file) {
        this.$message('Logo成功上传')
        this.addFormDialog.form.logoSrc = this.$api.qiniuImagePreLink + res.key
      },
      // 白皮书上传 成功回调
      handleWhitePageAvatarSuccess(res, file) {
        this.$message('白皮书成功上传')
        this.addFormDialog.form.whitePageUrlJson.push(this.$api.qiniuImagePreLink + res.key)
      },
      // 头像上传 成功回调
      handlePortraitAvatarSuccess(res, file) {
        this.$message('头像成功上传')
        return this.$api.qiniuImagePreLink + res.key
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
      // 放大回调
      handlePictureCardPreview (file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      // 上传删除回调
      handleRemove (file, fileList) {
        console.log(file, fileList)
      },
      // 获取国家下拉列表
      handleCountryOptions () {
        let self = this
        let url = self.$api.dtCountryAll
        let succeed = function (res) {
          console.log(res)
          res.data.forEach(item => {
            self.countryOptions.push(
              {
                value: item.code,
                label: item.nameCh + '-' + item.nameEn
              }
            )
          })
        }
        self.$axiosPOST(url, {}, succeed)
      },
      // 一次加载项目页面需要的下拉列表信息
      handleNeedOptionsList () {
        let self = this
        let url = self.$api.findDictionaryListByModels + '/projectType,currencyType,projectPlatformType'
        let succeed = function (res) {
          res.data.projectType.forEach(item => {
            console.log('开始装配：projectTypeOptions')
            if (item.model === 'projectType') {
              self.projectTypeOptions.push(
                {
                  value: item.id.toString(),
                  label: item.value
                }
              )
            }
          })
          res.data.currencyType.forEach(item => {
            console.log('开始装配：currencyTypeOptions')
            if (item.model === 'currencyType') {
              self.currencyTypeOptions.push(
                {
                  value: item.id.toString(),
                  label: item.value
                }
              )
            }
          })
          res.data.projectPlatformType.forEach(item => {
            console.log('开始装配：platformTypeOptions')
            if (item.model === 'projectPlatformType') {
              self.platformTypeOptions.push(
                {
                  value: item.id.toString(),
                  label: item.value
                }
              )
            }
          })
          console.log(self.platformTypeOptions)
          console.log(self.currencyTypeOptions)
          console.log(self.projectTypeOptions)
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
      },
      handleScroll () {
        let scrollTop = this.$refs.addFormDialog.$el.scrollTop
        let offsetTop = this.$refs.addFormTabs.$el.offsetTop + document.documentElement.clientHeight * 0.15
        let toggleClass = 'fixed-top'
        let tabHeadWarpClass = this.$refs.addFormTabs.$el.firstChild.firstChild.className
        if (scrollTop > offsetTop && (' ' + tabHeadWarpClass + ' ').indexOf(' ' + toggleClass + ' ') < 0) {
          this.$refs.addFormTabs.$el.firstChild.firstChild.className = tabHeadWarpClass.trim() + ' ' + toggleClass
        } else if (scrollTop < offsetTop && (' ' + tabHeadWarpClass + ' ').indexOf(' ' + toggleClass + ' ') > -1) {
          this.$refs.addFormTabs.$el.firstChild.firstChild.className = tabHeadWarpClass.replace(toggleClass, '')
        }
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
  .badge-item .el-badge__content{
    top: 10px;
    right: 5px
  }
  .dashed-border{
    border: 1px dashed #d9d9d9;
    border-radius: 3px;
  }

  .el-tabs__header .fixed-top{
    position: fixed !important;
    background-color:#Fff;
    top:0;
    z-index:999;
  }
</style>
